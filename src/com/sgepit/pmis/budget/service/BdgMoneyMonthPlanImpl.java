package com.sgepit.pmis.budget.service;

import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budget.dao.BdgMoneyMonthPlanDAO;

public class BdgMoneyMonthPlanImpl implements BdgMoneyMonthPlanFacade {
	private BdgMoneyMonthPlanDAO bdgMoneyMonthPlanConDAO;
	
	public BdgMoneyMonthPlanDAO getBdgMoneyMonthPlanConDAO() {
		return bdgMoneyMonthPlanConDAO;
	}

	public void setBdgMoneyMonthPlanConDAO(
			BdgMoneyMonthPlanDAO bdgMoneyMonthPlanConDAO) {
		this.bdgMoneyMonthPlanConDAO = bdgMoneyMonthPlanConDAO;
	}
    
	
	/* 上报，更新计划状态
	 * @see com.sgepit.pmis.budget.service.BdgMoneyMonthPlanFacade#sbPlan(java.lang.String)
	 */
	public boolean sbPlan(String uids){
		try{
			String  sql="update bdg_month_money_plan set jhzt='6' where uids in("+uids+")";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			jdbc.update(sql);
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	
	/* 汇总，更新计划状态
	 * @see com.sgepit.pmis.budget.service.BdgMoneyMonthPlanFacade#sbPlan(java.lang.String)
	 */
	public boolean hzPlan(String uids,String hzbh_flow){
		try{
			String  sql="update bdg_month_money_plan set jhzt='2',hzbh='"+hzbh_flow+"' where uids in("+uids+")";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			jdbc.update(sql);
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	/* 下达，更新计划状态
	 * @see com.sgepit.pmis.budget.service.BdgMoneyMonthPlanFacade#sbPlan(java.lang.String)
	 */
	public boolean downPlan(String uids){
		try{
			String  sql="update bdg_month_money_plan set jhzt='5' where uids in("+uids+")";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			jdbc.update(sql);
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	/* 资金计划补录，更新计划状态
	 * @see com.sgepit.pmis.budget.service.BdgMoneyMonthPlanFacade#sbPlan(java.lang.String)
	 */
	public boolean sbPlanbl(String uids){
		try{
			String  sql="update bdg_month_money_plan set jhzt='1' where uids in("+uids+")";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			jdbc.update(sql);
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	/* 资金计划补录审批，更新计划状态
	 * @see com.sgepit.pmis.budget.service.BdgMoneyMonthPlanFacade#sbPlan(java.lang.String)
	 */
	public boolean sbPlanblhz(String uids){
		try{
			String  sql="update bdg_month_money_plan set jhzt='5' where uids in("+uids+")";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			jdbc.update(sql);
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
}
