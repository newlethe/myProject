package com.sgepit.pmis.contract.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.contract.hbm.ConBal;
import com.sgepit.pmis.contract.hbm.ConBalNew;

/**
 * @ConBalMgmFacade 合同结算 - 业务逻辑接口
 * @author Xiaosa
 */
public interface ConBalMgmFacade {
	String insertConbal(ConBal conbal) throws SQLException, BusinessException;
	String updateConbal(ConBal conbal) throws SQLException, BusinessException;
	/**
	 * 新增合同结算信息（新）
	 * @param conbal
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public String insertConbalNew(ConBalNew conbal) throws SQLException, BusinessException ;
	/**
	 * 修改合同结算信息（新）
	 * @param conbal
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public String updateConbalNew(ConBalNew conbal) throws SQLException, BusinessException ;
	/**
	 * 删除合同结算信息（新）
	 * @param conbal
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public String deleteConbalNew(String uids) throws SQLException, BusinessException;
	
}
