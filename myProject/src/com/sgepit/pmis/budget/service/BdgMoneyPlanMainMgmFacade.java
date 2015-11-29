package com.sgepit.pmis.budget.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.budget.hbm.BdgMoneyPlanMain;



/**
 * 工程量投资计划管理功能主表  -业务逻辑接口
 * @author liuhc10
 *
 */
public interface BdgMoneyPlanMainMgmFacade {
	String insertMoneyPlan(BdgMoneyPlanMain bdgMoney) throws SQLException,BusinessException;
	String updateMoneyPlan(BdgMoneyPlanMain bdgMoney) throws SQLException,BusinessException;
	String deleteMoneyPlan(String bdgMoneyId) throws SQLException,BusinessException;
	String checkPlanMain(int year,int month);
}
