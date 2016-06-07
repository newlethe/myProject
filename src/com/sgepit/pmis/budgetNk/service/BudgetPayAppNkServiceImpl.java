package com.sgepit.pmis.budgetNk.service;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.budgetNk.dao.BudgetNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetPayAppNkDAO;
import com.sgepit.pmis.budgetNk.hbm.BudgetNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetPayAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetPayAppNkView;
import com.sgepit.pmis.common.BusinessConstants;

public class BudgetPayAppNkServiceImpl implements BudgetPayAppNkService {

	private BudgetPayAppNkDAO budgetPayAppNkDAO;
	private BudgetNkDAO budgetNkDAO;

	private String beanName = BusinessConstants.BDGNK_PACKAGE
			+ BusinessConstants.BDGNK_PAY_APP_ENTITY;

	public void setBudgetNkDAO(BudgetNkDAO budgetNkDAO) {
		this.budgetNkDAO = budgetNkDAO;
	}

	public void setBudgetPayAppNkDAO(BudgetPayAppNkDAO budgetPayAppNkDAO) {
		this.budgetPayAppNkDAO = budgetPayAppNkDAO;
	}

	public void delete(String id) throws BusinessException {
		BudgetPayAppNk payAppNk = (BudgetPayAppNk) budgetPayAppNkDAO.findById(
				beanName, id);
		if (payAppNk == null) {
			throw new BusinessException("该条目已被删除!");
		}

		delete(payAppNk);
		clearEmptyParentNode(payAppNk);
	}

	public void delete(BudgetPayAppNk payAppNk) throws BusinessException {
		// 删除实体
		budgetPayAppNkDAO.delete(payAppNk);
		// 统计申请，实际付款金额
		sumBdgPayAppMoney(payAppNk);

	}

	/**
	 * 清除已无子节点的父节点
	 * 
	 * @param id
	 */
	public void clearEmptyParentNode(BudgetPayAppNk payAppNk) {

		if (payAppNk == null) {
			return;
		}

		// 找到与此节点同级的其他节点count，若为0则可以删除父节点
		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetPayAppNk.class);
		criteria.add(Restrictions.eq("parent", payAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", payAppNk.getConid()));
		criteria.add(Restrictions.eq("payappno", payAppNk.getPayappno()));

		// 设置投影，即count
		criteria.setProjection(Projections.rowCount());
		Integer count = (Integer) budgetPayAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);
		if (count == 0) {

			if (!payAppNk.getParent().equals("0")) {
				String whereStr = "bdgid = '" + payAppNk.getParent()
						+ "' and conid='" + payAppNk.getConid()
						+ "' and payappno= '" + payAppNk.getPayappno() + "'";
				List list = (List) budgetPayAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_PAY_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					BudgetPayAppNk parentNode = (BudgetPayAppNk) list.get(0);
					budgetPayAppNkDAO.delete(parentNode);
					clearEmptyParentNode(parentNode);
				}

			}
		}

	}

	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getBdgPayTree(String parentId, String conId,
			String payAppNo) throws BusinessException {
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "parent = '" + parent + "' and conid = '" + conId
				+ "' and payappno ='" + payAppNo + "' order by bdgid";
		List<BudgetPayAppNkView> payList = this.budgetPayAppNkDAO.findByWhere(
				BusinessConstants.BDGNK_PACKAGE.concat("BudgetPayAppNkView"),
				whereStr);

		for (BudgetPayAppNkView payNk : payList) {
			ColumnTreeNode columnNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			node.setId(payNk.getBdgid()); // treenode.id
			node.setText(payNk.getBdgName()); // treenode.text

			node.setLeaf(payNk.getIsLeaf());
			if (payNk.getIsLeaf()) {

				node.setIconCls("task");
			} else {
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			node.setIfcheck("none");
			columnNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(payNk);
			columnNode.setColumns(jo); // columns
			nodeList.add(columnNode);

		}

		return nodeList;
	}

	/**
	 * Yin 保存选择的子树(概算付款分摊)
	 * 
	 * @param conid
	 * @param ids
	 */
	public void saveSelectedBudgets(String conid, String payappno, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			BudgetPayAppNk payAppNk = new BudgetPayAppNk();
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							.concat(BusinessConstants.BDGNK_ENTITY), ids[i]);

			if (budgetNk != null) {
				String whereStr = "bdgid = '" + budgetNk.getBdgid()
						+ "' and conid='" + conid + "' and payappno='"
						+ payappno + "'";
				List list = (List) budgetPayAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_PAY_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					// 若在结构维护中增加了节点使原叶子节点变为父节点则做相应更新
					BudgetPayAppNk curPayAppNk = (BudgetPayAppNk) list.get(0);
					if ((!budgetNk.getIsLeaf()) && curPayAppNk.getIsLeaf()) {
						curPayAppNk.setIsLeaf(false);
						budgetPayAppNkDAO.saveOrUpdate(curPayAppNk);
					}
				} else {

					payAppNk.setBdgid(budgetNk.getBdgid());
					payAppNk.setPid(budgetNk.getPid());
					payAppNk.setConid(conid);
					payAppNk.setPayappno(payappno);
					payAppNk.setParent(budgetNk.getParent());
					payAppNk.setIsLeaf(budgetNk.getIsLeaf());

					budgetPayAppNkDAO.insert(payAppNk);
				}

			}

		}
	}

	@SuppressWarnings("unchecked")
	private void sumBdgPayAppMoney(BudgetPayAppNk payAppNk) {
		// 到根节点退出
		if (payAppNk.getParent().equals("0"))
			return;

		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetPayAppNk.class);
		criteria.add(Restrictions.eq("parent", payAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", payAppNk.getConid()));
		criteria.add(Restrictions.eq("payappno", payAppNk.getPayappno()));

		// 相当于 select sum(c1), sum(c2) from ... where ...
		criteria.setProjection(Projections.projectionList().add(
				Projections.sum("applypay")).add(Projections.sum("factpay")));

		Object[] sumPayMoneyArr = (Object[]) budgetPayAppNkDAO
				.getHibernateTemplate().findByCriteria(criteria, 0, 1).get(0);

		// 得到父节点
		String parentNode = "bdgid = '" + payAppNk.getParent()
				+ "' and conid = '" + payAppNk.getConid()
				+ "' and payappno = '" + payAppNk.getPayappno() + "'";

		List<BudgetPayAppNk> parentList = budgetPayAppNkDAO.findByWhere(
				beanName, parentNode);
		if (parentList.size() > 0) {
			BudgetPayAppNk parent = parentList.get(0);
			parent.setApplypay((Double) sumPayMoneyArr[0]);
			parent.setFactpay((Double) sumPayMoneyArr[1]);

			budgetPayAppNkDAO.saveOrUpdate(parent);
			sumBdgPayAppMoney(parent);
		}

	}

	public void saveOrUpdate(Object transientInstance) throws BusinessException {
		BudgetPayAppNk budgetPayAppNk = (BudgetPayAppNk) transientInstance;

		budgetPayAppNkDAO.saveOrUpdate(budgetPayAppNk);
		sumBdgPayAppMoney(budgetPayAppNk);

	}

}
