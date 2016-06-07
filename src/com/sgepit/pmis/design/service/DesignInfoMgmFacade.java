package com.sgepit.pmis.design.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.base.BusinessException;

public interface DesignInfoMgmFacade {
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
}
