package com.sgepit.pmis.document.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.base.BusinessException;

public interface ZlDAMgmFacade {
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
}
