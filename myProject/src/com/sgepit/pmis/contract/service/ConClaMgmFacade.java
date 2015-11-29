package com.sgepit.pmis.contract.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.contract.hbm.ConCla;

/**
 * @ConClaMgmFacade 合同索赔 - 业务逻辑接口
 * @author Xiaosa
 */
public interface ConClaMgmFacade {
	int insertConCla(ConCla conCla) throws SQLException, BusinessException;
    int updateConCla(ConCla conCla) throws SQLException, BusinessException;
    String deleteConCla(String claid,String modId) throws SQLException, BusinessException;
    public Double getClaappmoney(String conid,String parent,String claid) throws SQLException, BusinessException;

}
