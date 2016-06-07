package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * BdgMoneyPlanMain entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgMoneyPlanMain implements java.io.Serializable {

	// Fields

	private String planmainid;
	private String pid;
	private Long planYear;
	private Long planMonth;
	private String planMaker;
	private Double planTotal;
	private String planRemark;
	private Date makeDate;
	private String planType;

	// Constructors

	/** default constructor */
	public BdgMoneyPlanMain() {
	}

	/** minimal constructor */
	public BdgMoneyPlanMain(Long planYear, Long planMonth) {
		this.planYear = planYear;
		this.planMonth = planMonth;
	}

	/** full constructor */
	public BdgMoneyPlanMain(Long planYear, Long planMonth, String planMaker,String pid,
			Double planTotal, String planRemark, Date makeDate, String planType) {
		this.planYear = planYear;
		this.planMonth = planMonth;
		this.planMaker = planMaker;
		this.planTotal = planTotal;
		this.planRemark = planRemark;
		this.makeDate = makeDate;
		this.planType = planType;
		this.pid = pid;
	}

	// Property accessors

	public String getPlanmainid() {
		return this.planmainid;
	}

	public void setPlanmainid(String planmainid) {
		this.planmainid = planmainid;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Long getPlanYear() {
		return this.planYear;
	}

	public void setPlanYear(Long planYear) {
		this.planYear = planYear;
	}

	public Long getPlanMonth() {
		return this.planMonth;
	}

	public void setPlanMonth(Long planMonth) {
		this.planMonth = planMonth;
	}

	public String getPlanMaker() {
		return this.planMaker;
	}

	public void setPlanMaker(String planMaker) {
		this.planMaker = planMaker;
	}

	public Double getPlanTotal() {
		return this.planTotal;
	}

	public void setPlanTotal(Double planTotal) {
		this.planTotal = planTotal;
	}

	public String getPlanRemark() {
		return this.planRemark;
	}

	public void setPlanRemark(String planRemark) {
		this.planRemark = planRemark;
	}

	public Date getMakeDate() {
		return this.makeDate;
	}

	public void setMakeDate(Date makeDate) {
		this.makeDate = makeDate;
	}

	public String getPlanType() {
		return this.planType;
	}

	public void setPlanType(String planType) {
		this.planType = planType;
	}

}