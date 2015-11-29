package com.sgepit.pmis.budgetNk.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budgetNk.hbm.BudgetPayAppNk;

public interface BudgetPayAppNkService {

	/**
	 * 合同付款分摊树
	 */
	@SuppressWarnings("unchecked")
	List<ColumnTreeNode> getBdgPayTree(String parentId, String conId, String payAppNo)
			throws BusinessException;



	/**
	 * 更新付款分摊信息
	 * 
	 * @param transientInstance
	 * @throws BusinessException
	 */
	void saveOrUpdate(Object transientInstance) throws BusinessException;

	/**
	 * 删除付款分摊信息
	 * @param id
	 * @throws BusinessException
	 */
	void delete(String id) throws BusinessException;
	/**
	 * 删除付款分摊信息
	 * @param id
	 * @throws BusinessException
	 */
	void delete(BudgetPayAppNk payAppNk) throws BusinessException;
	
	
	
	/**
	 * 保存在树中选择的概算节点
	 * 
	 * @param conid
	 * @param ids
	 */
	void saveSelectedBudgets(String conid, String payappno, String[] ids );
}