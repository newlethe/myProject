package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.material.hbm.MatAppbuyMaterial;


/**
 * BdgChangeMgmFacade 合同变更概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface MatAppbuyMgmFacade {
	void insertMaterial(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	void updateMaterialp(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	void deleteMaterial(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	
	void insertBuy(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	void updateBuy(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	void deleteBuy(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	
	void insertForm(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	void updateForm(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	void deleteForm(MatAppbuyMaterial mcApp) throws SQLException, BusinessException;
	
	
	public List<ColumnTreeNode> getMatFrameTree(String parentId, String contId) throws BusinessException ;
	
	public void selectFormMat(String formId, String[] matIds) throws SQLException, BusinessException;
	public void selectBuyMat(String buyId, String[] matIds) throws SQLException, BusinessException;
	public void saveMatFrameTree(String appid, String[] ids) throws SQLException, BusinessException;
}
