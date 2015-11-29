package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.material.hbm.MatFrame;


/**
 * BdgChangeMgmFacade 合同变更概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface MatFrameMgmFacade {
	void insertMatFrame(MatFrame matFrame) throws SQLException, BusinessException;
	void updateMatFrame(MatFrame matFrame) throws SQLException, BusinessException;
	void deleteMatFrame(String  id) throws SQLException, BusinessException;
	public String getIndexId(String frameId) throws SQLException, BusinessException;
	
	List<ColumnTreeNode> matFrameTree(String parentId) throws BusinessException ;
	List<ColumnTreeNode> matContractTree(String parentId, String conid) throws BusinessException;
	List<ColumnTreeNode> getMatFrameTree(String parentId,String appid) throws BusinessException;
	List<ColumnTreeNode> getMatConTree(String parentId,String appid) throws BusinessException ;
	List<ColumnTreeNode> contractMatTree(String parentId,String conid, String type) throws BusinessException;
	public void saveMatContractTree(String conid, String[] ids) throws SQLException, BusinessException;
}
