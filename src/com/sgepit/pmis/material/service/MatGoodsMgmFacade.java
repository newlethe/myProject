package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.material.hbm.MatGoodsChecksub;
import com.sgepit.pmis.material.hbm.MatGoodsInvoicesub;

/**
 * BdgChangeMgmFacade 合同变更概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface MatGoodsMgmFacade {
	void insertMatGoods(MatGoodsChecksub matGoods) throws SQLException, BusinessException;
	void updateMatGoods(MatGoodsChecksub matGoods) throws SQLException, BusinessException;
	void deleteMatGoods(MatGoodsChecksub matGoods) throws SQLException, BusinessException;
	public List<ColumnTreeNode> getMatFrameTree(String parentId, String contId) throws BusinessException ;
	
	void insertMatInvoice(MatGoodsInvoicesub matGoods) throws SQLException, BusinessException ;
	void updateMatInvoice(MatGoodsInvoicesub matGoods) throws SQLException, BusinessException ;
	void deleteMatInvoice(MatGoodsInvoicesub matGoods) throws SQLException, BusinessException ;

	public void selectStoreMat(String invoiceId, String[] matIds, String inId) throws SQLException, BusinessException ;
	public void selectGoodsMat(String checkId, String[] matIds, String formId) throws SQLException, BusinessException ;
	public void saveMatFrameTree(String checkId, String[] ids) throws SQLException, BusinessException ;
}
