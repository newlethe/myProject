package com.sgepit.pmis.budgetNk.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNk;

public interface BudgetMoneyAppNkService {

	/**
	 * 合同金额分摊树
	 */
	@SuppressWarnings("unchecked")
	List<ColumnTreeNode> getBdgMoneyTree(String parentId, String conId)
			throws BusinessException;

	/**
	 * 选择分摊树
	 * 
	 * @param parentId
	 * @param contId
	 * @return
	 * @throws BusinessException
	 */
	List<ColumnTreeNode> getBudgetNkSelectTree(String parentId, String pid,String contId)
			throws BusinessException;

	List<ColumnTreeNode> getBudgetMoneyAppSelectTree(String parentId, String conid,
			String typeName, String typeId) throws BusinessException;

	/**
	 * 更新分摊信息
	 * 
	 * @param transientInstance
	 * @throws BusinessException
	 */
	void saveOrUpdate(Object transientInstance) throws BusinessException;

	/**
	 * 删除分摊信息
	 * @param id
	 * @throws BusinessException
	 */
	void delete(String id) throws BusinessException;
	/**
	 * 删除分摊信息
	 * @param id
	 * @throws BusinessException
	 */
	void delete(BudgetMoneyAppNk moneyApp) throws BusinessException;
	
	
	
	/**
	 * 保存在树中选择的概算节点
	 * 
	 * @param conid
	 * @param ids
	 */
	void saveSelectedBudgets(String conid, String[] ids);
}