package com.sgepit.pmis.budgetNk.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budgetNk.hbm.BudgetClaAppNk;

public interface BudgetClaAppNkService {

	/**
	 * 变更分摊树
	 */
	@SuppressWarnings("unchecked")
	List<ColumnTreeNode> getBdgClaAppTree(String parentId, String conId,
			String claid) throws BusinessException;

	/**
	 * 保存从树中选择的索赔分摊节点
	 * @param conid 合同id
	 * @param claid 索赔单id
	 * @param ids 选择的分摊节点数组
	 */
	void saveSelectedBudgets(String conid, String claid, String[] ids);
	void delete(String claappid) throws BusinessException;
	void saveOrUpdate(BudgetClaAppNk claAppNk );

}