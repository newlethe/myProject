package com.sgepit.pmis.document.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.document.hbm.SafSort;
import com.sgepit.pmis.document.hbm.SafetySortIniti;




public interface SafetyMgmFacade {

	
	/*
	 * 新增结点
	 */
	int addOrUpdate(SafSort treeinfo);
	/*
	 * 删除结点
	 */
	int deleteChildNode(String bdgId);
	/*
	 * 新增安全分类施工初始树
	 */
	int addOrUpdateInit(SafetySortIniti safeInit);
	/*
	 * 删除安全分类施工初始树结点
	 */
	int deleteChildNodeInit(String nodeid);
	
	/*
	 * 安全分类树
	 */
	List<ColumnTreeNode> SafeTree(String parentId) throws BusinessException ;
	/*
	 * 安全分类初始树
	 */
	List<ColumnTreeNode> InitSafeTree(String parentId,String safeexamin) throws BusinessException;
	void insertSafSort(SafSort safsort) throws SQLException, BusinessException;
	void updateSafSort(SafSort safsort) throws SQLException, BusinessException;
	void deleteSafSort(SafSort safsort) throws SQLException, BusinessException;
	void insertSafSortInit(SafetySortIniti safsortinit) throws SQLException, BusinessException;
	void updateSafSortInit(SafetySortIniti safsortinit) throws SQLException, BusinessException;
	void deleteSafSortInit(SafetySortIniti safsortinit) throws SQLException, BusinessException;
	void sumSafeHandler(String parentId) throws SQLException, BusinessException;
	void sumForDelete(SafSort safsort) throws SQLException, BusinessException;
	void sumfinalscore(String parentId,String str) throws SQLException, BusinessException;
}
