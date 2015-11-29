package com.sgepit.pmis.budgetNk.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;

/**
 * 内控概算结构维护业务
 * 
 * @author Yin
 * 
 */
public interface BudgetStructureService {

	/**
	 * 获得概算树的节点集合
	 * 
	 * @param parentId
	 *            所属父节点ID
	 * @return
	 * @throws BusinessException
	 */
	List<ColumnTreeNode> getbudgetNkTree(String parentId, String pid);

	/**
	 * 删除节点
	 * 
	 * @param bdgid
	 */
	void delete(String bdgid) throws BusinessException;

	/**
	 * 添加节点
	 * 
	 * @param transientInstance
	 * @return
	 */
	// public String insert(Object transientInstance);
	/**
	 * 添加或保存节点
	 * 
	 * @param transientInstance
	 */
	void saveOrUpdate(Object transientInstance) throws BusinessException;
	
	/**
	 * 统计在MoneyAppNk分摊表中对应概算的所有分摊金额总和
	 * @param bdgid 概算id
	 * @throws BusinessException
	 */
	void sumTotalMoney(String bdgid) throws BusinessException;

	/**
	 * 计算所有合同分摊总金额
	 * @return
	 */
	Double sumAllAppTotal(String pid);
	
	/**
	 * 用于在概算维护界面下查看概算所有的合同相关信息
	 * @param bdgid
	 * @return
	 */
	List queryBdgid(String bdgid);
}
