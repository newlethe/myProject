package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budget.dao.BdgMoneyPlanMainDAO;
import com.sgepit.pmis.budget.hbm.BdgMoneyPlanMain;

public class BdgMoneyPlanMainMgmImpl extends BaseMgmImpl implements
		BdgMoneyPlanMainMgmFacade {
	
	private BdgMoneyPlanMainDAO bdgMoneyPlanMainDAO;

	//setters
	public void setBdgMoneyPlanMainDAO(BdgMoneyPlanMainDAO bdgMoneyPlanMainDAO) {
		this.bdgMoneyPlanMainDAO = bdgMoneyPlanMainDAO;
	}

	//interface functions
	public String deleteMoneyPlan(String bdgMoneyId) throws SQLException,
			BusinessException {
		// TODO Auto-generated method stub
		return null;
	}

	public String insertMoneyPlan(BdgMoneyPlanMain bdgMoney)
			throws SQLException, BusinessException {
		// TODO Auto-generated method stub
		return null;
	}

	public String updateMoneyPlan(BdgMoneyPlanMain bdgMoney)
			throws SQLException, BusinessException {
		// TODO Auto-generated method stub
		return null;
	}
	
	//user functions
	public String checkPlanMain(int year,int month){
		String flag = "0";
		String sql = "select * from bdg_money_plan_main " +
				"where plan_year ="+year+" and plan_month ="+month+"";
		JdbcTemplate jdbc =JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		if(list.size()>0)
			flag = "1";
		return flag;
	}

}
