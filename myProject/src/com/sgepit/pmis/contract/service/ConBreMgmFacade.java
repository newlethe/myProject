package com.sgepit.pmis.contract.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.contract.hbm.ConBre;

/**
 * @ConBreMgmFacade 合同违约 - 业务逻辑接口
 * @author Xiaosa
 */
public interface ConBreMgmFacade {
	void insertConbre(ConBre conbre) throws SQLException, BusinessException;
	void updateConbre(ConBre conbre) throws SQLException, BusinessException;
	String deleteConbre(String breid,String modId) throws SQLException, BusinessException;
	public Double getBreachappmoney(String conid,String parent,String breid) throws SQLException, BusinessException;

}
