package com.sgepit.pmis.budget.service;

public interface BdgMoneyMonthPlanFacade {
	public boolean sbPlan(String uids);
	public boolean hzPlan(String uids,String hzbh_flow);
	public boolean downPlan(String uids);
	public boolean sbPlanbl(String uids);
	public boolean sbPlanblhz(String uids);
}
