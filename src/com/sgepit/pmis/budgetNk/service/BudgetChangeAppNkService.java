package com.sgepit.pmis.budgetNk.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budgetNk.hbm.BudgetChangeAppNk;

public interface BudgetChangeAppNkService {

	/**
	 * 变更分摊树
	 */
	@SuppressWarnings("unchecked")
	List<ColumnTreeNode> getBdgChangeAppTree(String parentId, String conId,
			String cano) throws BusinessException;

	/**
	 * 保存从树中选择的变更分摊节点
	 * @param conid 合同id
	 * @param chaid 变更单id
	 * @param ids 选择的分摊节点数组
	 */
	void saveSelectedBudgets(String conid, String chaid, String[] ids);
	
	void saveOrUpdate(BudgetChangeAppNk changeAppNk );
	
	void delete(String id) throws BusinessException;
		

}