package com.sgepit.pmis.budgetNk.service;

import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONObject;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.budgetNk.dao.BudgetClaAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetMoneyAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetNkDAO;
import com.sgepit.pmis.budgetNk.hbm.BudgetClaAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetNk;
import com.sgepit.pmis.common.BusinessConstants;

public class BudgetClaAppNkServiceImpl implements BudgetClaAppNkService {

	private BudgetClaAppNkDAO budgetClaAppNkDAO;
	private BudgetNkDAO budgetNkDAO;
	private BudgetMoneyAppNkDAO budgetMoneyAppNkDAO;

	private String beanName = BusinessConstants.BDGNK_PACKAGE
			+ BusinessConstants.BDGNK_CLA_APP_ENTITY;

	public void setBudgetMoneyAppNkDAO(BudgetMoneyAppNkDAO budgetMoneyAppNkDAO) {
		this.budgetMoneyAppNkDAO = budgetMoneyAppNkDAO;
	}

	public void setBudgetNkDAO(BudgetNkDAO budgetNkDAO) {
		this.budgetNkDAO = budgetNkDAO;
	}

	public void setBudgetClaAppNkDAO(BudgetClaAppNkDAO budgetClaAppNkDAO) {
		this.budgetClaAppNkDAO = budgetClaAppNkDAO;
	}

	public List<ColumnTreeNode> getBdgClaAppTree(String parentId, String conId,
			String claid) throws BusinessException {
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "parent = '" + parent + "' and conid = '" + conId
				+ "' and claid = '" + claid + "' order by bdgid";
		List<BudgetClaAppNk> budgetClaAppList = budgetClaAppNkDAO.findByWhere(
				BusinessConstants.BDGNK_PACKAGE
						+ BusinessConstants.BDGNK_CLA_APP_ENTITY, whereStr);

		for (BudgetClaAppNk claAppNk : budgetClaAppList) {
			ColumnTreeNode columnNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			// 查找概算信息，填充变更分摊中的扩展属性
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_ENTITY, claAppNk
							.getBdgid());

			// 若没有找到对应的概算信息，该变更分摊节点不会显示
			if (budgetNk == null)
				continue;

			claAppNk.setBdgNo(budgetNk.getBdgNo());
			claAppNk.setBdgName(budgetNk.getBdgName());

			// 查找分摊信息，填充bdgMoney域
			String appWhere = "conid= '" + conId + "' and bdgid='"
					+ claAppNk.getBdgid() + "'";
			List<BudgetMoneyAppNk> appList = budgetMoneyAppNkDAO.findByWhere(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_MONEY_APP_ENTITY,
					appWhere);
			if (appList.size() == 0)
				continue;
			claAppNk.setRealMoney(appList.get(0).getRealMoney());

			node.setId(claAppNk.getClaappid()); // treenode.id
			node.setText(claAppNk.getBdgName()); // treenode.text

			node.setLeaf(claAppNk.getIsLeaf());
			if (claAppNk.getIsLeaf()) {

				node.setIconCls("task");
			} else {
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			// node.setIfcheck("none");
			columnNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(claAppNk);
			columnNode.setColumns(jo); // columns
			nodeList.add(columnNode);

		}

		return nodeList;
	}

	public void saveSelectedBudgets(String conid, String claid, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			BudgetClaAppNk claAppNk = new BudgetClaAppNk();
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							.concat(BusinessConstants.BDGNK_ENTITY), ids[i]);

			if (budgetNk != null) {
				String whereStr = "bdgid = '" + budgetNk.getBdgid()
						+ "' and conid='" + conid + "' and claid='" + claid
						+ "'";
				List list = (List) budgetClaAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_CLA_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					// 若在结构维护中增加了节点使原叶子节点变为父节点则做相应更新
					BudgetClaAppNk curClaAppNk = (BudgetClaAppNk) list.get(0);
					if ((!budgetNk.getIsLeaf()) && curClaAppNk.getIsLeaf()) {
						curClaAppNk.setIsLeaf(false);
						budgetClaAppNkDAO.saveOrUpdate(curClaAppNk);
					}
				} else {

					claAppNk.setBdgid(budgetNk.getBdgid());
					claAppNk.setPid(budgetNk.getPid());
					claAppNk.setConid(conid);
					claAppNk.setClamoney(0.0);
					claAppNk.setClaid(claid);
					claAppNk.setParent(budgetNk.getParent());
					claAppNk.setIsLeaf(budgetNk.getIsLeaf());

					budgetClaAppNkDAO.insert(claAppNk);
				}

			}

		}

	}

	@SuppressWarnings("unchecked")
	private void sumBdgClaAppMoney(BudgetClaAppNk claAppNk) {
		// 到根节点退出
		if (claAppNk.getParent().equals("0"))
			return;

		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetClaAppNk.class);
		criteria.add(Restrictions.eq("parent", claAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", claAppNk.getConid()));
		criteria.add(Restrictions.eq("claid", claAppNk.getClaid()));

		criteria.setProjection(Projections.sum("clamoney"));

		Double sumClaMoney = (Double) budgetClaAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);

		// 得到父节点
		String parentNode = "bdgid = '" + claAppNk.getParent()
				+ "' and conid = '" + claAppNk.getConid() + "' and claid = '"
				+ claAppNk.getClaid() + "'";

		List<BudgetClaAppNk> parentList = budgetClaAppNkDAO.findByWhere(
				beanName, parentNode);
		if (parentList.size() > 0) {
			BudgetClaAppNk parent = parentList.get(0);
			parent.setClamoney(sumClaMoney == null ? 0.0 : sumClaMoney);

			budgetClaAppNkDAO.saveOrUpdate(parent);
			sumBdgClaAppMoney(parent);
		}

	}

	public void saveOrUpdate(BudgetClaAppNk claAppNk) {
		budgetClaAppNkDAO.saveOrUpdate(claAppNk);
		sumBdgClaAppMoney(claAppNk);

	}

	@SuppressWarnings("unchecked")
	public void delete(BudgetClaAppNk claAppNk) {

		// 若其下有子项目则级联删除
		// if (!claAppNk.getIsLeaf()) {
		// // 查找所有子节点
		// DetachedCriteria criteria = DetachedCriteria
		// .forClass(BudgetClaAppNk.class);
		// criteria.add(Restrictions.eq("parent", claAppNk.getParent()));
		// criteria.add(Restrictions.eq("conid", claAppNk.getConid()));
		// criteria.add(Restrictions.eq("claid", claAppNk.getClaid()));
		// List<BudgetClaAppNk> list = budgetClaAppNkDAO
		// .getHibernateTemplate().findByCriteria(criteria);
		// for (BudgetClaAppNk child : list) {
		// delete(child);
		// }
		//
		// }
		// 删除实体
		budgetClaAppNkDAO.delete(claAppNk);
		// 重新统计总分摊金额
		sumBdgClaAppMoney(claAppNk);
	}

	/**
	 * 删除索赔分摊
	 * 
	 * @param id
	 * @throws BusinessException
	 */
	public void delete(String id) throws BusinessException {
		BudgetClaAppNk claAppNk = (BudgetClaAppNk) budgetClaAppNkDAO.findById(
				beanName, id);
		if (claAppNk == null) {

			throw new BusinessException("该条目已被删除!");
		}
		delete(claAppNk);
		clearEmptyParentNode(claAppNk);

	}

	/**
	 * 清除已无子节点的父节点
	 * 
	 * @param id
	 */
	public void clearEmptyParentNode(BudgetClaAppNk claAppNk) {

		if (claAppNk == null) {
			return;
		}
		// 找到与此节点同级的其他节点count，若为0则可以删除父节点
		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetClaAppNk.class);
		criteria.add(Restrictions.eq("parent", claAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", claAppNk.getConid()));
		criteria.add(Restrictions.eq("claid", claAppNk.getClaid()));

		// 设置投影，即count
		criteria.setProjection(Projections.rowCount());
		Integer count = (Integer) budgetClaAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);
		if (count == 0) {

			if (!claAppNk.getParent().equals("0")) {
				String whereStr = "bdgid = '" + claAppNk.getParent()
						+ "' and conid='" + claAppNk.getConid()
						+ "' and claid= '" + claAppNk.getClaid() + "'";
				List list = (List) budgetClaAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_CLA_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					BudgetClaAppNk parentNode = (BudgetClaAppNk) list.get(0);
					budgetClaAppNkDAO.delete(parentNode);
					clearEmptyParentNode(parentNode);
				}
			}
		}

	}

}
