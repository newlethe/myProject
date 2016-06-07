package com.sgepit.pmis.material.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.material.hbm.MatCodeApply;


/**
 * BdgChangeMgmFacade 合同变更概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface MatCodeAppMgmFacade {
	void insertMcapp(MatCodeApply mcApp) throws SQLException, BusinessException;
	void updateMcapp(MatCodeApply mcApp) throws SQLException, BusinessException;
	void deleteMcapp(MatCodeApply  mcApp) throws SQLException, BusinessException;
	public int applyMatno(String[] appIds) throws SQLException, BusinessException;
	public void approveMatNo(String[] frameIds, String[] appIds) throws SQLException, BusinessException;
	
}
