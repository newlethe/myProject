package com.sgepit.pmis.budgetNk.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budgetNk.hbm.BudgetBreakAppNk;

public interface BudgetBreakAppNkService {

	List<ColumnTreeNode> getBdgBreakAppTree(String parentId, String conId,
			String breid) throws BusinessException;

	void saveSelectedBudgets(String conid, String breid, String[] ids);

	void saveOrUpdate(BudgetBreakAppNk breakAppNk);

	@SuppressWarnings("unchecked")
	void delete(BudgetBreakAppNk breakAppNk);

	/**
	 * 删除违约分摊
	 * 
	 * @param id
	 * @throws BusinessException
	 */
	void delete(String id) throws BusinessException;

}