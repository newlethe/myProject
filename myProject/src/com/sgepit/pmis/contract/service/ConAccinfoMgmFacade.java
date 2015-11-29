package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.List;

//import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.BusinessException;
//import com.hdkj.webpmis.domain.contract.ConAccinfo;
import com.sgepit.pmis.contract.hbm.ConAccinfo;

/**
 * @ConAccinfoMgmFacade 合同帐目信息-业务逻辑接口
 * @author Xiaosa
 */
public interface ConAccinfoMgmFacade {
	void insertConAccinfo(ConAccinfo conAccinfo) throws SQLException, BusinessException;	
	void updateConAccinfo(ConAccinfo conAccinfo) throws SQLException, BusinessException;
	public void addOrUpdate(List<ConAccinfo> list);
	public void deleteAccinfoBeans(List ids);
	public List getConAccinfoBeans(String payid) throws SQLException, BusinessException;
}
