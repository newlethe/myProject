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
import com.sgepit.pmis.budgetNk.dao.BudgetChangeAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetMoneyAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetNkDAO;
import com.sgepit.pmis.budgetNk.hbm.BudgetChangeAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetNk;
import com.sgepit.pmis.common.BusinessConstants;

public class BudgetChangeAppNkServiceImpl implements BudgetChangeAppNkService {

	private BudgetChangeAppNkDAO budgetChangeAppNkDAO;
	private BudgetNkDAO budgetNkDAO;
	private BudgetMoneyAppNkDAO budgetMoneyAppNkDAO;

	// Bean name
	private String beanName = BusinessConstants.BDGNK_PACKAGE
			+ BusinessConstants.BDGNK_CHANGE_APP_ENTITY;

	public void setBudgetMoneyAppNkDAO(BudgetMoneyAppNkDAO budgetMoneyAppNkDAO) {
		this.budgetMoneyAppNkDAO = budgetMoneyAppNkDAO;
	}

	public void setBudgetNkDAO(BudgetNkDAO budgetNkDAO) {
		this.budgetNkDAO = budgetNkDAO;
	}

	public void setBudgetChangeAppNkDAO(
			BudgetChangeAppNkDAO budgetChangeAppNkDAO) {
		this.budgetChangeAppNkDAO = budgetChangeAppNkDAO;
	}

	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getBdgChangeAppTree(String parentId,
			String conId, String chaid) throws BusinessException {
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "parent = '" + parent + "' and conid = '" + conId
				+ "' and chaid = '" + chaid + "' order by bdgid";
		List<BudgetChangeAppNk> budgetChangeAppList = budgetChangeAppNkDAO
				.findByWhere(BusinessConstants.BDGNK_PACKAGE
						+ BusinessConstants.BDGNK_CHANGE_APP_ENTITY, whereStr);

		for (BudgetChangeAppNk changeAppNk : budgetChangeAppList) {
			ColumnTreeNode columnNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			// 查找概算信息，填充变更分摊中的扩展属性
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_ENTITY, changeAppNk
							.getBdgid());

			// 若没有找到对应的概算信息，该变更分摊节点不会显示
			if (budgetNk == null)
				continue;

			changeAppNk.setBdgNo(budgetNk.getBdgNo());
			changeAppNk.setBdgName(budgetNk.getBdgName());

			// 查找分摊信息，填充bdgMoney域
			String appWhere = "conid= '" + conId + "' and bdgid='"
					+ changeAppNk.getBdgid() + "'";
			List<BudgetMoneyAppNk> appList = budgetMoneyAppNkDAO.findByWhere(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_MONEY_APP_ENTITY,
					appWhere);
			if (appList.size() == 0)
				continue;
			changeAppNk.setRealMoney(appList.get(0).getRealMoney());

			node.setId(changeAppNk.getCaid()); // treenode.id
			node.setText(changeAppNk.getBdgName()); // treenode.text

			node.setLeaf(changeAppNk.getIsLeaf());
			if (changeAppNk.getIsLeaf()) {

				node.setIconCls("task");
			} else {
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			// node.setIfcheck("none");
			columnNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(changeAppNk);
			columnNode.setColumns(jo); // columns
			nodeList.add(columnNode);

		}

		return nodeList;
	}

	/**
	 * Yin 保存选择的子树(概算变更分摊)
	 * 
	 * @param conid
	 * @param ids
	 */
	public void saveSelectedBudgets(String conid, String chaid, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			BudgetChangeAppNk changeAppNk = new BudgetChangeAppNk();
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							.concat(BusinessConstants.BDGNK_ENTITY), ids[i]);

			if (budgetNk != null) {
				String whereStr = "bdgid = '" + budgetNk.getBdgid()
						+ "' and conid='" + conid + "' and chaid='" + chaid
						+ "'";
				List list = (List) budgetChangeAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_CHANGE_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					// 若在结构维护中增加了节点使原叶子节点变为父节点则做相应更新
					BudgetChangeAppNk curChgAppNk = (BudgetChangeAppNk) list
							.get(0);
					if ((!budgetNk.getIsLeaf()) && curChgAppNk.getIsLeaf()) {
						curChgAppNk.setIsLeaf(false);
						budgetChangeAppNkDAO.saveOrUpdate(curChgAppNk);
					}
				} else {

					changeAppNk.setBdgid(budgetNk.getBdgid());
					changeAppNk.setPid(budgetNk.getPid());
					changeAppNk.setConid(conid);
					changeAppNk.setChgMoney(0.0);
					changeAppNk.setChaid(chaid);
					changeAppNk.setParent(budgetNk.getParent());
					changeAppNk.setIsLeaf(budgetNk.getIsLeaf());

					budgetChangeAppNkDAO.insert(changeAppNk);
				}

			}

		}
	}

	@SuppressWarnings("unchecked")
	private void sumBdgChangeAppMoney(BudgetChangeAppNk changeAppNk) {
		// 到根节点退出
		if (changeAppNk.getParent().equals("0"))
			return;

		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetChangeAppNk.class);
		criteria.add(Restrictions.eq("parent", changeAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", changeAppNk.getConid()));
		criteria.add(Restrictions.eq("chaid", changeAppNk.getChaid()));

		criteria.setProjection(Projections.sum("chgMoney"));

		Double sumChgMoney = (Double) budgetChangeAppNkDAO
				.getHibernateTemplate().findByCriteria(criteria, 0, 1).get(0);

		// 得到父节点
		String parentNode = "bdgid = '" + changeAppNk.getParent()
				+ "' and conid = '" + changeAppNk.getConid()
				+ "' and chaid = '" + changeAppNk.getChaid() + "'";

		List<BudgetChangeAppNk> parentList = budgetChangeAppNkDAO.findByWhere(
				beanName, parentNode);
		if (parentList.size() > 0) {
			BudgetChangeAppNk parent = parentList.get(0);
			parent.setChgMoney(sumChgMoney == null ? 0.0 : sumChgMoney);

			budgetChangeAppNkDAO.saveOrUpdate(parent);
			sumBdgChangeAppMoney(parent);
		}

	}

	public void saveOrUpdate(BudgetChangeAppNk changeAppNk) {
		budgetChangeAppNkDAO.saveOrUpdate(changeAppNk);
		sumBdgChangeAppMoney(changeAppNk);

	}

	@SuppressWarnings("unchecked")
	public void delete(BudgetChangeAppNk changeAppNk) {

		// 若其下有子项目则级联删除
		// if (!changeAppNk.getIsLeaf()) {
		// // 查找所有子节点
		// DetachedCriteria criteria = DetachedCriteria
		// .forClass(BudgetChangeAppNk.class);
		// criteria.add(Restrictions.eq("parent", changeAppNk.getParent()));
		// criteria.add(Restrictions.eq("conid", changeAppNk.getConid()));
		// criteria.add(Restrictions.eq("chaid", changeAppNk.getChaid()));
		// List<BudgetChangeAppNk> list = budgetChangeAppNkDAO
		// .getHibernateTemplate().findByCriteria(criteria);
		// for (BudgetChangeAppNk child : list) {
		// delete(child);
		// }
		//
		// }

		// 删除实体
		budgetChangeAppNkDAO.delete(changeAppNk);
		// 重新统计总分摊金额
		sumBdgChangeAppMoney(changeAppNk);
	}

	/**
	 * 删除变更分摊
	 * 
	 * @param id
	 * @throws BusinessException
	 */
	public void delete(String id) throws BusinessException {
		BudgetChangeAppNk changeAppNk = (BudgetChangeAppNk) budgetChangeAppNkDAO
				.findById(beanName, id);
		if (changeAppNk == null) {

			throw new BusinessException("该条目已被删除!");
		}

		delete(changeAppNk);
		clearEmptyParentNode(changeAppNk);

	}

	/**
	 * 清除已无子节点的父节点
	 * 
	 * @param id
	 */
	public void clearEmptyParentNode(BudgetChangeAppNk changeAppNk) {

		if (changeAppNk == null) {
			return;
		}
		// 找到与此节点同级的其他节点count，若为0则可以删除父节点
		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetChangeAppNk.class);
		criteria.add(Restrictions.eq("parent", changeAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", changeAppNk.getConid()));
		criteria.add(Restrictions.eq("chaid", changeAppNk.getChaid()));

		// 设置投影，即count
		criteria.setProjection(Projections.rowCount());
		Integer count = (Integer) budgetChangeAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);
		if (count == 0) {

			if (!changeAppNk.getParent().equals("0")) {
				String whereStr = "bdgid = '" + changeAppNk.getParent()
						+ "' and conid='" + changeAppNk.getConid()
						+ "' and chaid= '" + changeAppNk.getChaid() + "'";
				List list = (List) budgetChangeAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_CHANGE_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					BudgetChangeAppNk parentNode = (BudgetChangeAppNk) list
							.get(0);
					budgetChangeAppNkDAO.delete(parentNode);
					clearEmptyParentNode(parentNode);
				}
			}
		}

	}

}
