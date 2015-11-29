package com.sgepit.pmis.finalAccounts.bdgStructure.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType;

public interface FAGcTypeService {
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	String saveOrUpdateNode(FAGcType node);
	void deleteNode(String id);
	List<Object[] > getGcTypeList();

}
