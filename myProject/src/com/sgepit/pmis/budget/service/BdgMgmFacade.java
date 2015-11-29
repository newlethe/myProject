package com.sgepit.pmis.budget.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;


/**
 * 获取概算相关的所有树s
 *
 */
public interface BdgMgmFacade {
	/**
	 * 创建ColumnTree树结构
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 */
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
}
