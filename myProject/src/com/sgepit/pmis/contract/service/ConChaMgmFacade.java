package com.sgepit.pmis.contract.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.contract.hbm.ConCha;

/**
 * @ConChaMgmFacade 合同变更 - 业务逻辑接口
 * @author Xiaosa
 */
public interface ConChaMgmFacade {
	void insertConcha(ConCha concha) throws SQLException, BusinessException;
	void updateConcha(ConCha concha) throws SQLException, BusinessException;
	void deleteConcha(ConCha concha) throws SQLException, BusinessException;
	public ConCha getConCha(String beanId) throws SQLException, BusinessException;
	public int instConCha(ConCha concha);
	public int instorupdConcha(ConCha concha);
	public int updConCha(ConCha concha);
	public String delConcha(String beanId,String modId);
	public Double getChangeappmoney(String conid,String parent,String chaid) throws SQLException, BusinessException;

}
