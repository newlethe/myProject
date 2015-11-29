package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.contract.hbm.ConExp;
import com.sgepit.pmis.contract.hbm.ConExpkid;

/**
 * @ConExpMgmFacade 合同公式设置 - 业务逻辑接口
 * @author Xiaosa
 */
public interface ConExpMgmFacade {
	
    void insertConExp(ConExp conexp) throws SQLException, BusinessException;
	void updateConexp(ConExp conexp) throws SQLException, BusinessException;
	
	void insertConExpkid(ConExpkid conExpkid) throws SQLException, BusinessException;
	void updateConExpkid(ConExpkid conExpkid) throws SQLException, BusinessException;

	/**
	 * 获得公式名称
	 * @param conModel
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	List getExpression(String conModel) throws SQLException, BusinessException;
	
	/**
	 * 获得累计付款信息
	 * @param conModel
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */	
	Object[][] getCountInfo(String conmodel, String conid, String payid) throws SQLException, BusinessException;
}
