package com.sgepit.pmis.budgetNk.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budgetNk.dao.BudgetMoneyAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetNkDAO;
import com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetNk;
import com.sgepit.pmis.common.BusinessConstants;

public class BudgetStructureServiceImpl implements BudgetStructureService {

	private BudgetNkDAO budgetNkDAO;
	private BudgetMoneyAppNkDAO budgetMoneyAppNkDAO;

	private String beanName = BusinessConstants.BDGNK_PACKAGE
			+ BusinessConstants.BDGNK_ENTITY;

	public static BudgetStructureService getFromApplicationContext(
			ApplicationContext ctx) {
		return (BudgetStructureService) ctx.getBean("budgetNkDAO");
	}

	public void setbudgetNkDAO(BudgetNkDAO budgetNkDAO) {
		this.budgetNkDAO = budgetNkDAO;
	}

	public void setBudgetMoneyAppNkDAO(BudgetMoneyAppNkDAO budgetMoneyAppNkDAO) {
		this.budgetMoneyAppNkDAO = budgetMoneyAppNkDAO;
	}

	/**
	 * 获得概算树的节点集合
	 * 
	 * @param parentId
	 *            所属父节点ID
	 * @return
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getbudgetNkTree(String parentId, String pid)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "parent='%s' and pid='%s' order by bdgid";
		whereStr = String.format(whereStr, parentId, pid);
		
		List<BudgetNk> objects = budgetNkDAO.findByWhere(
				BusinessConstants.BDGNK_ENTITY, whereStr);

		for (BudgetNk budgetNk : objects) {
			ColumnTreeNode columnTreeNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			// temp.setRemainder((temp.getBdgMoney()==null?0:temp.getBdgMoney())
			// - (temp.getTotalMoney() == null?0: temp.getTotalMoney()));

			boolean leaf = budgetNk.getIsLeaf();
			node.setId(budgetNk.getBdgid()); // treenode.id
			node.setText(budgetNk.getBdgName()); // treenode.text
			if (leaf) {
				node.setLeaf(true);
				node.setIconCls("task");
			} else {
				node.setLeaf(false); // treenode.leaf
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}
			node.setIfcheck("none");
			columnTreeNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(budgetNk);
			columnTreeNode.setColumns(jo); // columns
			list.add(columnTreeNode);
		}

		return list;
	}

	/**
	 * 删除节点
	 */
	public void delete(String bdgid) throws BusinessException {
		BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(beanName, bdgid);
		if (budgetNk == null) {

			throw new BusinessException("该条目已被删除!");
		}

		// 若不为子节点则无法删除
		DetachedCriteria criteria = DetachedCriteria.forClass(BudgetNk.class);

		criteria.add(Restrictions.eq("parent", budgetNk.getBdgid()));

		// 设置投影，求属于该节点的子节点Count
		criteria.setProjection(Projections.count("bdgid"));

		// 当前节点的子节点数
		Integer childCount = (Integer) budgetNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);
		if (childCount > 0) {
			throw new BusinessException("该概算条目下还有子条目，无法删除!");
		}

		// 若有分摊记录则无法删除
		if (hasApportion(budgetNk.getBdgid())) {
			throw new BusinessException("该概算条目有分摊信息，无法删除!");

		}

		// 删除当前节点
		budgetNkDAO.delete(budgetNk);

		// 计算父节点金额
		updateParentBudgetMoney(budgetNk.getParent());

		// 判断父节点下是否还有其他子节点
		DetachedCriteria criteria2 = DetachedCriteria.forClass(BudgetNk.class);
		criteria2.add(Restrictions.eq("parent", budgetNk.getParent()));
		// 排除掉本节点
		criteria2.add(Restrictions.ne("bdgid", budgetNk.getBdgid()));

		// 设置投影，求该节点的兄弟节点Count
		criteria2.setProjection(Projections.count("bdgid"));
		Integer siblingCount = (Integer) budgetNkDAO.getHibernateTemplate()
				.findByCriteria(criteria2, 0, 1).get(0);

		if (siblingCount == 0) {
			// 将其父节点的isLeaf设为true
			BudgetNk parentBudget = (BudgetNk) budgetNkDAO.findById(beanName,
					budgetNk.getParent());
			parentBudget.setIsLeaf(true);
			budgetNkDAO.saveOrUpdate(parentBudget);
		}

	}

	public String insert(Object transientInstance) {
		return budgetNkDAO.insert(transientInstance);
	}

	/**
	 * 保存概算，同时更新所有父节点的概算数值
	 */
	public void saveOrUpdate(Object transientInstance) throws BusinessException {
		BudgetNk budgetNk = (BudgetNk) transientInstance;
		boolean isAdd = false;
		if (budgetNk.getBdgid() == null) {
			isAdd = true;
		} else if (budgetNk.getBdgid().equals("")) {
			isAdd = true;
		}

		budgetNkDAO.saveOrUpdate(budgetNk);
		// 若为新增子节点则把父节点的isLeaf属性设为false
		if (isAdd) {
			// 获取父节点

			BudgetNk parentBudget = (BudgetNk) budgetNkDAO.findById(beanName,
					budgetNk.getParent());
			if (parentBudget.getIsLeaf()) {
				parentBudget.setIsLeaf(false);
				budgetNkDAO.saveOrUpdate(parentBudget);
			}

		}

		updateParentBudgetMoney(((BudgetNk) budgetNk).getParent());
	}

	/**
	 * 将当前节点的概算金额反应到每一层父节点上
	 * 
	 * @param parentId
	 */
	@SuppressWarnings("unchecked")
	private void updateParentBudgetMoney(String parentId) {

		// 当前的节点对象
		BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(beanName, parentId);
		// 查询当前节点的子对象
		List<BudgetNk> childList = budgetNkDAO.findByProperty(beanName,
				"parent", parentId);

		// 计算所有子节点的概算和
		Double curTotalBudget = 0.0;
		for (BudgetNk budget : childList) {
			curTotalBudget += budget.getBdgMoney() == null ? 0.0 : budget
					.getBdgMoney();
		}

		if (budgetNk != null) {
			budgetNk.setBdgMoney(curTotalBudget);
			budgetNkDAO.saveOrUpdate(budgetNk);

			if (!"0".equals(budgetNk.getParent()))
				updateParentBudgetMoney(budgetNk.getParent());
		}

	}

	/**
	 * 当前概算有无分摊信息
	 * 
	 * @param bdgid
	 * @return
	 */
	private boolean hasApportion(String bdgid) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetMoneyAppNk.class);
		criteria.add(Restrictions.eq("bdgid", bdgid));
		criteria.setProjection(Projections.count("appid"));
		if ((Integer) (budgetNkDAO.getHibernateTemplate().findByCriteria(
				criteria, 0, 1).get(0)) > 0) {
			return true;
		}
		return false;
	}

	public void sumTotalMoney(String bdgid) throws BusinessException {

		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetMoneyAppNk.class);
		// 设置条件
		criteria.add(Restrictions.eq("bdgid", bdgid));
		// 设置投影，即Sum求和
		criteria.setProjection(Projections.sum("realMoney"));
		// 得到结果
		Double totalMoney = (Double) budgetMoneyAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);

		// 在BudgetNk中获取当前概算对象
		BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(beanName, bdgid);
		// 更改保存对象
		budgetNk.setTotalMoney(totalMoney == null ? 0.0 : totalMoney);
		budgetNkDAO.saveOrUpdate(budgetNk);

	}

	public Double sumAllAppTotal(String pid) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetMoneyAppNk.class);
		criteria.add(Restrictions.eq("parent", "0"));
		criteria.add(Restrictions.eq("pid", pid));
		criteria.setProjection(Projections.sum("realMoney"));

		Object result = budgetNkDAO.getHibernateTemplate().findByCriteria(
				criteria, 0, 1).get(0);
		return result != null ? (Double) result : 0.0;

	}

	/**
	 * 查询该内控概算编号对应的所有的合同
	 * 
	 * @param bdgid
	 * @return
	 */
	public List queryBdgid(String bdgid) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		
		String sql = "select   "
				+ "(select max(t1.bdg_name) from bdg_info_nk t1 where t1.bdgid = tab.bdgid ) as bdgname"
				
				+ ",(select t3.conno from con_ove t3 where t3.conid=tab.conid ) as conno"
				+ ",(select t4.conname from con_ove t4 where t4.conid=tab.conid ) as conname"
				+ ",(select real_money from bdg_money_app_nk t5 where t5.conid=tab.conid and t5.bdgid=tab.bdgid) as realmoney"
				+ ",(select t6.bdg_money from bdg_info_nk t6 where t6.bdgid=tab.bdgid)as bdgmoney "
	
				+ " from bdg_money_app_nk tab " + "where tab.bdgid = '" + bdgid
				+ "'";
		return jdbc.queryForList(sql);
		
	}

}
