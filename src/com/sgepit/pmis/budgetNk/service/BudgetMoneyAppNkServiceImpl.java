package com.sgepit.pmis.budgetNk.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.VBdgmoneyapp;
import com.sgepit.pmis.budgetNk.dao.BudgetBreakAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetChangeAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetClaAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetMoneyAppNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetNkDAO;
import com.sgepit.pmis.budgetNk.dao.BudgetPayAppNkDAO;
import com.sgepit.pmis.budgetNk.hbm.BudgetBreakAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetChangeAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetClaAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNkView;
import com.sgepit.pmis.budgetNk.hbm.BudgetNk;
import com.sgepit.pmis.budgetNk.hbm.BudgetPayAppNk;
import com.sgepit.pmis.common.BusinessConstants;

public class BudgetMoneyAppNkServiceImpl implements BudgetMoneyAppNkService {

	private BudgetMoneyAppNkDAO budgetMoneyAppNkDAO;
	private BudgetNkDAO budgetNkDAO;
	private BudgetChangeAppNkDAO budgetChangeAppNkDAO;
	private BudgetPayAppNkDAO budgetPayAppNkDAO;
	private BudgetClaAppNkDAO budgetClaAppNkDAO;
	private BudgetBreakAppNkDAO budgetBreakAppNkDAO;

	private BudgetStructureService budgetStructureService;

	// Bean name
	private String beanName = BusinessConstants.BDGNK_PACKAGE
			+ BusinessConstants.BDGNK_MONEY_APP_ENTITY;

	public BudgetNkDAO getBudgetNkDAO() {
		return budgetNkDAO;
	}

	public void setBudgetNkDAO(BudgetNkDAO budgetNkDAO) {
		this.budgetNkDAO = budgetNkDAO;
	}

	public BudgetMoneyAppNkDAO getBudgetMoneyAppNkDAO() {
		return budgetMoneyAppNkDAO;
	}

	public void setBudgetMoneyAppNkDAO(BudgetMoneyAppNkDAO budgetMoneyAppNkDAO) {
		this.budgetMoneyAppNkDAO = budgetMoneyAppNkDAO;
	}

	public void setBudgetChangeAppNkDAO(
			BudgetChangeAppNkDAO budgetChangeAppNkDAO) {
		this.budgetChangeAppNkDAO = budgetChangeAppNkDAO;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.sgepit.pmis.budgetNk.service.BudgetMoneyAppNkService#bdgMoneyTree
	 *      (java.lang.String, java.lang.String, java.lang.String)
	 */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getBdgMoneyTree(String parentId, String conId)
			throws BusinessException {
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "parent = '" + parent + "' and conid = '" + conId
				+ "' order by bdgid";
		List<BudgetMoneyAppNkView> moneyAppList = this.budgetMoneyAppNkDAO
				.findByWhere(BusinessConstants.BDGNK_PACKAGE
						.concat("BudgetMoneyAppNkView"), whereStr);

		for (BudgetMoneyAppNkView appV : moneyAppList) {
			ColumnTreeNode columnNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			node.setId(appV.getBdgid()); // treenode.id
			node.setText(appV.getBdgName()); // treenode.text

			node.setLeaf(appV.getIsLeaf());
			if (appV.getIsLeaf()) {

				node.setIconCls("task");
			} else {
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			node.setIfcheck("none");
			columnNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(appV);
			columnNode.setColumns(jo); // columns
			nodeList.add(columnNode);

		}

		return nodeList;
	}

	/**
	 * @author zhugx 获得金额概算树 用来被 变更分摊 违约分摊 索赔分摊 来选择
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getBudgetMoneyAppSelectTree(String parentId,
			String conid, String typeName, String typeId)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "parent='" + parent + "' and conid='" + conid
				+ "' order by bdgid ";

		List<BudgetMoneyAppNk> objects = budgetMoneyAppNkDAO.findByWhere(
				BusinessConstants.BDGNK_MONEY_APP_ENTITY, whereStr);

		for (BudgetMoneyAppNk appNk : objects) {
			ColumnTreeNode columnTreeNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			// temp.setRemainder((temp.getBdgMoney()==null?0:temp.getBdgMoney())
			// - (temp.getTotalMoney() == null?0: temp.getTotalMoney()));

			// 查找概算信息，填充分摊中的扩展属性
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_ENTITY, appNk.getBdgid());
			if (budgetNk == null)
				continue;
			appNk.setBdgMoney(budgetNk.getBdgMoney());
			appNk.setBdgNo(budgetNk.getBdgNo());
			appNk.setBdgName(budgetNk.getBdgName());

			boolean leaf = appNk.getIsLeaf();
			node.setId(appNk.getBdgid()); // treenode.id
			node.setText(appNk.getBdgName()); // treenode.text
			if (leaf) {
				node.setLeaf(true);
				node.setIconCls("task");
			} else {
				node.setLeaf(false); // treenode.leaf
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}
			// node.setIfcheck("none");

			columnTreeNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(appNk);

			// UIProvider
			String uiProvider = "col";
			// 根据当前树的类型将对应已选中的概算过滤
			if (leaf) {
				if (checkSelected(conid, appNk.getBdgid(), typeName, typeId)) {
					jo.accumulate("disabled", true);
					uiProvider = "plain";
				}

			}

			jo.accumulate("uiProvider", uiProvider);
			columnTreeNode.setColumns(jo); // columns
			list.add(columnTreeNode);
		}
		return list;
	}

	/**
	 * 判断在当前分摊下该节点是否应禁用（已被选中）
	 * 
	 * @param conid
	 * @param bdgid
	 * @param typeName
	 * @param typeId
	 * @return
	 */
	private boolean checkSelected(String conid, String bdgid, String typeName,
			String typeId) {
		List tempList = null;
		if (typeName.equals("change")) {
			tempList = budgetChangeAppNkDAO.findByWhere(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_CHANGE_APP_ENTITY,
					"conid = '" + conid + "' and bdgid = '" + bdgid
							+ "' and chaid='" + typeId + "'");
			if (tempList.size() > 0) {
				return true;
			}

		} else if (typeName.equals("pay")) {
			tempList = budgetPayAppNkDAO.findByWhere(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_PAY_APP_ENTITY,
					"conid = '" + conid + "' and bdgid = '" + bdgid
							+ "' and payappno='" + typeId + "'");
			if (tempList.size() > 0) {
				return true;
			}

		} else if (typeName.equals("cla")) {
			tempList = budgetClaAppNkDAO.findByWhere(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_CLA_APP_ENTITY,
					"conid = '" + conid + "' and bdgid = '" + bdgid
							+ "' and claid='" + typeId + "'");
			if (tempList.size() > 0) {
				return true;
			}

		} else if (typeName.equals("break")) {
			tempList = budgetBreakAppNkDAO.findByWhere(
					BusinessConstants.BDGNK_PACKAGE
							+ BusinessConstants.BDGNK_BREAK_APP_ENTITY,
					"conid = '" + conid + "' and bdgid = '" + bdgid
							+ "' and breid='" + typeId + "'");
			if (tempList.size() > 0) {
				return true;
			}

		}

		return false;
	}

	/**
	 * 获得概算树的节点集合(在为合同选择概算的界面下)
	 * 
	 * @param parentId
	 *            所属父节点ID
	 * @return
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getBudgetNkSelectTree(String parentId, String pid,
			String contId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "parent='%s' and pid='%s' order by bdgid";
		whereStr = String.format(whereStr, parent, pid);

		List<BudgetNk> objects = budgetNkDAO.findByWhere(
				BusinessConstants.BDGNK_ENTITY, whereStr);

		for (BudgetNk budgetNk : objects) {
			ColumnTreeNode columnTreeNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

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


			columnTreeNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(budgetNk);

			// UIProvider
			String uiProvider = "col";

			// 已选择的概算则不显示checkbox
			if (leaf) {
				List bdgMoneyAppList = budgetMoneyAppNkDAO.findByWhere(
						beanName, "conid = '" + contId + "' and bdgid = '"
								+ budgetNk.getBdgid() + "'");
				if (bdgMoneyAppList != null) {
					if (bdgMoneyAppList.size() > 0) {
						jo.accumulate("disabled", true);
						uiProvider = "plain";
					}

				}
			}
			jo.accumulate("uiProvider", uiProvider);
			columnTreeNode.setColumns(jo); // columns
			list.add(columnTreeNode);
		}

		return list;
	}

	/**
	 * 保存合同分摊，同时更新所有父节点的分摊数值
	 */
	public void saveOrUpdate(Object transientInstance) throws BusinessException {
		BudgetMoneyAppNk budgetMoneyAppNk = (BudgetMoneyAppNk) transientInstance;

		budgetMoneyAppNkDAO.saveOrUpdate(budgetMoneyAppNk);
		// 重新统计“本合同分摊”
		sumMoneyAppRealMoney(budgetMoneyAppNk);
		// 统计概算结构中的“合同总分摊”
		if (budgetStructureService == null) {
			budgetStructureService = (BudgetStructureService) Constant.wact
					.getBean("budgetStructureService");
		}
		budgetStructureService.sumTotalMoney(budgetMoneyAppNk.getBdgid());
	}

	/**
	 * 清除已无子节点的父节点
	 * 
	 * @param id
	 */
	public void clearEmptyParentNode(BudgetMoneyAppNk moneyAppNk) {

		if (moneyAppNk == null) {
			return;
		}
		// 找到与此节点同级的其他节点count，若为0则可以删除父节点
		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetMoneyAppNk.class);
		criteria.add(Restrictions.eq("parent", moneyAppNk.getParent()));
		criteria.add(Restrictions.eq("conid", moneyAppNk.getConid()));

		// 设置投影，即count
		criteria.setProjection(Projections.rowCount());
		Integer count = (Integer) budgetMoneyAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);
		if (count == 0) {

			if (!moneyAppNk.getParent().equals("0")) {
				String whereStr = "bdgid = '" + moneyAppNk.getParent()
						+ "' and conid='" + moneyAppNk.getConid() + "'";
				List list = (List) budgetMoneyAppNkDAO
						.findByWhere(
								BusinessConstants.BDGNK_PACKAGE
										.concat(BusinessConstants.BDGNK_MONEY_APP_ENTITY),
								whereStr);
				if (list.size() > 0) {
					BudgetMoneyAppNk parentNode = (BudgetMoneyAppNk) list
							.get(0);
					budgetMoneyAppNkDAO.delete(parentNode);
					clearEmptyParentNode(parentNode);
				}
			}
		}

	}

	@SuppressWarnings("unchecked")
	public void delete(BudgetMoneyAppNk moneyAppNk) {

		// 若其下有子项目则级联删除
		// if (!moneyAppNk.getIsLeaf()) {
		// // 查找所有子节点
		// DetachedCriteria criteria = DetachedCriteria
		// .forClass(BudgetMoneyAppNk.class);
		// criteria.add(Restrictions.eq("parent", moneyAppNk.getBdgid()));
		// criteria.add(Restrictions.eq("conid", moneyAppNk.getConid()));
		// List<BudgetMoneyAppNk> list = budgetMoneyAppNkDAO
		// .getHibernateTemplate().findByCriteria(criteria);
		// for (BudgetMoneyAppNk child : list) {
		// delete(child);
		// }
		//
		// }
		// 删除实体
		budgetMoneyAppNkDAO.delete(moneyAppNk);

		// 重新统计分摊金额
		sumMoneyAppRealMoney(moneyAppNk);
		// 重新统计概算结构中总分摊金额
		if (budgetStructureService == null) {
			budgetStructureService = (BudgetStructureService) Constant.wact
					.getBean("budgetStructureService");
		}

		budgetStructureService.sumTotalMoney(moneyAppNk.getBdgid());

	}

	/**
	 * 删除分摊
	 * 
	 * @param id
	 * @throws BusinessException
	 */
	public void delete(String id) throws BusinessException {
		BudgetMoneyAppNk moneyAppNk = (BudgetMoneyAppNk) budgetMoneyAppNkDAO
				.findById(beanName, id);
		if (moneyAppNk == null) {

			throw new BusinessException("该条目已被删除!");
		}

		if (!moneyAppNk.getIsLeaf()) {
			// 找到该分摊所有子节点id
			DetachedCriteria criteria = DetachedCriteria
					.forClass(BudgetMoneyAppNk.class);
			criteria.add(Restrictions.eq("parent", moneyAppNk.getBdgid()));
			criteria.add(Restrictions.eq("conid", moneyAppNk.getConid()));
			criteria.setProjection(Projections.property("appid"));
			List<String> idList = budgetMoneyAppNkDAO.getHibernateTemplate()
					.findByCriteria(criteria);
			for (String childId : idList) {
				delete(childId);
			}

		} else {

			if (hasRelatedAppRecord(moneyAppNk.getBdgid(), moneyAppNk
					.getConid())) {
				throw new BusinessException("该条目存在变更分摊，付款分摊，索赔分摊或违约分摊，无法删除!");
			}

			delete(moneyAppNk);
			clearEmptyParentNode(moneyAppNk);
		}

	}

	/**
	 * Yin 保存选择的子树(概算金额分摊)
	 * 
	 * @param conid
	 * @param ids
	 */
	public void saveSelectedBudgets(String conid, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			BudgetMoneyAppNk appNk = new BudgetMoneyAppNk();
			BudgetNk budgetNk = (BudgetNk) budgetNkDAO.findById(
					BusinessConstants.BDGNK_PACKAGE
							.concat(BusinessConstants.BDGNK_ENTITY), ids[i]);

			String whereStr = "bdgid = '" + budgetNk.getBdgid()
					+ "' and conid='" + conid + "'";
			List list = (List) budgetMoneyAppNkDAO.findByWhere(
					BusinessConstants.BDGNK_PACKAGE
							.concat(BusinessConstants.BDGNK_MONEY_APP_ENTITY),
					whereStr);
			if (list.size() > 0) {

				// 若在结构维护中增加了节点使原叶子节点变为父节点则做相应更新
				BudgetMoneyAppNk moneyAppNk = (BudgetMoneyAppNk) list.get(0);
				if ((!budgetNk.getIsLeaf()) && moneyAppNk.getIsLeaf()) {
					moneyAppNk.setIsLeaf(false);
					budgetMoneyAppNkDAO.saveOrUpdate(moneyAppNk);
				}

			} else {
				appNk.setPid(budgetNk.getPid());
				appNk.setBdgid(budgetNk.getBdgid());
				appNk.setConid(conid);
				appNk.setIsLeaf(budgetNk.getIsLeaf());
				appNk.setParent(budgetNk.getParent());
				appNk.setRealMoney(0.0);
				budgetMoneyAppNkDAO.insert(appNk);
			}

		}
	}

	/**
	 * 计算单个合同的“本合同分摊”金额 每个bdgid和conid的组合只有一条记录
	 * 
	 * @param bdgid
	 *            概算id
	 * @param conid
	 *            合同id
	 */
	@SuppressWarnings("unchecked")
	private void sumMoneyAppRealMoney(BudgetMoneyAppNk appNk) {
		// 到根节点退出
		if (appNk.getParent().equals("0"))
			return;

		// 计算该分摊父节点所属的子节点的分摊金额之和
		DetachedCriteria criteria = DetachedCriteria
				.forClass(BudgetMoneyAppNk.class);
		criteria.add(Restrictions.eq("parent", appNk.getParent()));
		criteria.add(Restrictions.eq("conid", appNk.getConid()));

		// 设置投影，即sum
		criteria.setProjection(Projections.sum("realMoney"));

		Double totalRealMoney = (Double) budgetMoneyAppNkDAO
				.getHibernateTemplate().findByCriteria(criteria, 0, 1).get(0);
		// 得到父节点
		String parentNode = "bdgid = '" + appNk.getParent() + "' and conid= '"
				+ appNk.getConid() + "'";

		List<BudgetMoneyAppNk> parentList = budgetMoneyAppNkDAO.findByWhere(
				beanName, parentNode);
		if (parentList.size() > 0) {
			BudgetMoneyAppNk parentAppNk = parentList.get(0);
			parentAppNk.setRealMoney(totalRealMoney == null ? 0.0
					: totalRealMoney);
			budgetMoneyAppNkDAO.saveOrUpdate(parentAppNk);
			if (budgetStructureService == null) {
				budgetStructureService = (BudgetStructureService) Constant.wact
						.getBean("budgetStructureService");
			}
			budgetStructureService.sumTotalMoney(parentAppNk.getBdgid());

			// 继续统计父节点的合同分摊金额
			sumMoneyAppRealMoney(parentAppNk);

		}

	}

	/**
	 * 判断概算信息是否有变更分摊，付款分摊，索赔分摊，违约分摊记录
	 * 
	 * @param bdgid
	 * @param conid
	 * @return
	 */
	private boolean hasRelatedAppRecord(String bdgid, String conid) {

		DetachedCriteria criteria;

		// 变更分摊
		criteria = DetachedCriteria.forClass(BudgetChangeAppNk.class);
		criteria.add(Restrictions.eq("bdgid", bdgid));
		criteria.add(Restrictions.eq("conid", conid));
		criteria.setProjection(Projections.count("caid"));
		if ((Integer) budgetMoneyAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0) > 0) {
			return true;
		}

		// 付款分摊
		criteria = DetachedCriteria.forClass(BudgetPayAppNk.class);
		criteria.add(Restrictions.eq("bdgid", bdgid));
		criteria.add(Restrictions.eq("conid", conid));
		criteria.setProjection(Projections.count("payappid"));
		if ((Integer) budgetMoneyAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0) > 0) {
			return true;
		}

		// 索赔分摊
		criteria = DetachedCriteria.forClass(BudgetClaAppNk.class);
		criteria.add(Restrictions.eq("bdgid", bdgid));
		criteria.add(Restrictions.eq("conid", conid));
		criteria.setProjection(Projections.count("claappid"));
		if ((Integer) budgetMoneyAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0) > 0) {
			return true;
		}

		// 违约分摊
		criteria = DetachedCriteria.forClass(BudgetBreakAppNk.class);
		criteria.add(Restrictions.eq("bdgid", bdgid));
		criteria.add(Restrictions.eq("conid", conid));
		criteria.setProjection(Projections.count("breappid"));
		if ((Integer) budgetMoneyAppNkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0) > 0) {
			return true;
		}

		return false;

	}

	public void setBudgetPayAppNkDAO(BudgetPayAppNkDAO budgetPayAppNkDAO) {
		this.budgetPayAppNkDAO = budgetPayAppNkDAO;
	}

	public void setBudgetClaAppNkDAO(BudgetClaAppNkDAO budgetClaAppNkDAO) {
		this.budgetClaAppNkDAO = budgetClaAppNkDAO;
	}

	public void setBudgetBreakAppNkDAO(BudgetBreakAppNkDAO budgetBreakAppNkDAO) {
		this.budgetBreakAppNkDAO = budgetBreakAppNkDAO;
	}

}
