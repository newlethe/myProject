package com.sgepit.pmis.budgetNk.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;

/**
 * 负责转发请求获得各个组件中的概算树
 * @author Administrator
 *
 */
public interface BudgetNkService {
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;

}
