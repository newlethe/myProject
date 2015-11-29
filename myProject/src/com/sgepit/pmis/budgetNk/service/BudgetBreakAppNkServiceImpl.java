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
import com.sgepit.pmis.budgetNk.dao.BudgetBreakAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetMoneyAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetNkDAO;
import com.sgepit.pmis.budgetNk.hbm.BudgetBreakAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetNk;
import com.sgepit.pmis.common.BusinessConstants;

public class BudgetBreakAppNkServiceImpl implements BudgetBreakAppNkService {

	private BudgetBreakAppNkDAO budgetBreakAppNkDAO;
	private BudgetNkDAO budgetNkDAO;
	private BudgetMoneyAppNkDAO budgetMoneyAppNkDAO;

	private String beanName = BusinessConstants.BDGNK_PACKAGE
			+ BusinessConstants.BDGNK_BREAK_APP_ENTITY;

	public void setBudgetMoneyAppNkDAO(BudgetMoneyAppNkDAO budgetMoneyAppNkDAO) {
		this.budgetMoneyAppNkDAO = budgetMoneyAppNkDAO;
	}

	public void setBudgetNkDAO(BudgetNkDAO budgetNkDAO) {
		this.budgetNkDAO = budgetNkDAO;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.sgepit.pmis.budgetNk.service.BudgetBreakAppNkService#getBdgBreakAppTree(java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	public List<ColumnTreeNode> getBdgBreakAppTree(String parentId,
			String conId, String breid) throws BusinessException {
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "parent = '" + parent + "' and conid = '" + conId
				+ "' and breid = '" + breid + "' order by bdgid";
		List<BudgetBreakAppNk> budgetBreakAppList = budgetBreakAppNkDAO
				.findByWhere(BusinessConstants.BDGNK_PACKAGE
						+ BusinessConstants.BDGNK_BREAK_APP_ENTITY, whereStr);

		for (BudgetBreakAppNk breAppNk : budgetBreakAppList) {
			ColumnTreeNode columnNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			// 查找概算信息，填充违约分摊中的扩展属性
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_ENTITY, breAppNk
							.getBdgid());

			// 若没有找到对应的概算信息，该变更分摊节点不会显示
			if (breAppNk == null)
				continue;

			breAppNk.setBdgNo(budgetNk.getBdgNo());
			breAppNk.setBdgName(budgetNk.getBdgName());

			// 查找分摊信息，填充bdgMoney域
			String appWhere = "conid= '" + conId + "' and bdgid='"
					+ breAppNk.getBdgid() + "'";
			List<BudgetMoneyAppNk> appList = budgetMoneyAppNkDAO.findByWhere(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_MONEY_APP_ENTITY,
					appWhere);
			if (appList.size() == 0)
				continue;
			breAppNk.setRealMoney(appList.get(0).getRealMoney());

			node.setId(breAppNk.getBreappid()); // treenode.id
			node.setText(breAppNk.getBdgName()); // treenode.text

			node.setLeaf(breAppNk.getIsLeaf());
			if (breAppNk.getIsLeaf()) {

				node.setIconCls("task");
			} else {
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			// node.setIfcheck("none");
			columnNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(breAppNk);
			columnNode.setColumns(jo); // columns
			nodeList.add(columnNode);

		}

		return nodeList;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.sgepit.pmis.budgetNk.service.BudgetBreakAppNkService#saveSelectedBudgets(java.lang.String,
	 *      java.lang.String, java.lang.String[])
	 */
	public void saveSelectedBudgets(String conid, String breid, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			BudgetBreakAppNk breakAppNk = new BudgetBreakAppNk();
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							.concat(BusinessConstants.BDGNK_ENTITY), ids[i]);

			if (budgetNk != null) {
				String whereStr = "bdgid = '" + budgetNk.getBdgid()
						+ "' and conid='" + conid + "' and breid='" + breid
						+ "'";
				List list = (List) budgetBreakAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_BREAK_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					// 若在结构维护中增加了节点使原叶子节点变为父节点则做相应更新
					BudgetBreakAppNk curBrkAppNk = (BudgetBreakAppNk) list
							.get(0);
					if ((!budgetNk.getIsLeaf()) && curBrkAppNk.getIsLeaf()) {
						curBrkAppNk.setIsLeaf(false);
						budgetMoneyAppNkDAO.saveOrUpdate(curBrkAppNk);
					}
				} else {
					breakAppNk.setBdgid(budgetNk.getBdgid());
					breakAppNk.setPid(budgetNk.getPid());
					breakAppNk.setConid(conid);
					breakAppNk.setBreAppMoney(0.0);
					breakAppNk.setBreid(breid);
					breakAppNk.setParent(budgetNk.getParent());
					breakAppNk.setIsLeaf(budgetNk.getIsLeaf());

					budgetBreakAppNkDAO.insert(breakAppNk);
				}

			}

		}

	}

	@SuppressWarnings("unchecked")
	private void sumBdgBreakAppMoney(BudgetBreakAppNk breakAppNk) {
		// 到根节点退出
		if (breakAppNk.getParent().equals("0"))
			return;

		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetBreakAppNk.class);
		criteria.add(Restrictions.eq("parent", breakAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", breakAppNk.getConid()));
		criteria.add(Restrictions.eq("breid", breakAppNk.getBreid()));

		criteria.setProjection(Projections.sum("breAppMoney"));

		Double sumBreakMoney = (Double) budgetBreakAppNkDAO
				.getHibernateTemplate().findByCriteria(criteria, 0, 1).get(0);

		// 得到父节点
		String parentNode = "bdgid = '" + breakAppNk.getParent()
				+ "' and conid = '" + breakAppNk.getConid() + "' and breid = '"
				+ breakAppNk.getBreid() + "'";

		List<BudgetBreakAppNk> parentList = budgetBreakAppNkDAO.findByWhere(
				beanName, parentNode);
		if (parentList.size() > 0) {
			BudgetBreakAppNk parent = parentList.get(0);
			parent.setBreAppMoney(sumBreakMoney == null ? 0.0 : sumBreakMoney);

			budgetBreakAppNkDAO.saveOrUpdate(parent);
			sumBdgBreakAppMoney(parent);
		}

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.sgepit.pmis.budgetNk.service.BudgetBreakAppNkService#saveOrUpdate(com.sgepit.pmis.budgetNk.hbm.BudgetBreakAppNk)
	 */
	public void saveOrUpdate(BudgetBreakAppNk breakAppNk) {
		budgetBreakAppNkDAO.saveOrUpdate(breakAppNk);
		sumBdgBreakAppMoney(breakAppNk);

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.sgepit.pmis.budgetNk.service.BudgetBreakAppNkService#delete(com.sgepit.pmis.budgetNk.hbm.BudgetBreakAppNk)
	 */
	@SuppressWarnings("unchecked")
	public void delete(BudgetBreakAppNk breakAppNk) {

		// // 若其下有子项目则级联删除
		// if (!breakAppNk.getIsLeaf()) {
		// // 查找所有子节点
		// DetachedCriteria criteria = DetachedCriteria
		// .forClass(BudgetBreakAppNk.class);
		// criteria.add(Restrictions.eq("parent", breakAppNk.getParent()));
		// criteria.add(Restrictions.eq("conid", breakAppNk.getConid()));
		// criteria.add(Restrictions.eq("breid", breakAppNk.getBreid()));
		// List<BudgetBreakAppNk> list = budgetBreakAppNkDAO
		// .getHibernateTemplate().findByCriteria(criteria);
		// for (BudgetBreakAppNk child : list) {
		// delete(child);
		// }
		//
		// }
		// 删除实体
		budgetBreakAppNkDAO.delete(breakAppNk);
		// 重新统计总分摊金额
		sumBdgBreakAppMoney(breakAppNk);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.sgepit.pmis.budgetNk.service.BudgetBreakAppNkService#delete(java.lang.String)
	 */
	public void delete(String id) throws BusinessException {
		BudgetBreakAppNk breakAppNk = (BudgetBreakAppNk) budgetBreakAppNkDAO
				.findById(beanName, id);
		if (breakAppNk == null) {

			throw new BusinessException("该条目已被删除!");
		}
		delete(breakAppNk);

		clearEmptyParentNode(breakAppNk);

	}

	/**
	 * 清除已无子节点的父节点
	 * 
	 * @param id
	 */
	public void clearEmptyParentNode(BudgetBreakAppNk breakAppNk) {

		if (breakAppNk == null) {
			return;
		}
		// 找到与此节点同级的其他节点count，若为0则可以删除父节点
		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetBreakAppNk.class);
		criteria.add(Restrictions.eq("parent", breakAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", breakAppNk.getConid()));
		criteria.add(Restrictions.eq("breid", breakAppNk.getBreid()));

		// 设置投影，即count
		criteria.setProjection(Projections.countDistinct("breappid"));
		Integer count = (Integer) budgetBreakAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);
		if (count == 0) {

			if (!breakAppNk.getParent().equals("0")) {
				String whereStr = "bdgid = '" + breakAppNk.getParent()
						+ "' and conid='" + breakAppNk.getConid()
						+ "' and breid= '" + breakAppNk.getBreid() + "'";
				List list = (List) budgetBreakAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_BREAK_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					BudgetBreakAppNk parentNode = (BudgetBreakAppNk) list
							.get(0);
					budgetBreakAppNkDAO.delete(parentNode);
					clearEmptyParentNode(parentNode);
				}

			}
		}

	}

	public void setBudgetBreakAppNkDAO(BudgetBreakAppNkDAO budgetBreakAppNkDAO) {
		this.budgetBreakAppNkDAO = budgetBreakAppNkDAO;
	}

}
