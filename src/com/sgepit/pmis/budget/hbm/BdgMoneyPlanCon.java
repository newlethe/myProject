package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * BdgMoneyPlanCon entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgMoneyPlanCon implements java.io.Serializable {

	// Fields

	private String planconid;
	private String conid;
	private Date plantime;
	private Double plainmoney;
	private String planRemark;
	private String pid;

	// Constructors

	/** default constructor */
	public BdgMoneyPlanCon() {
	}

	/** minimal constructor */
	public BdgMoneyPlanCon(String conid) {
		this.conid = conid;
	}

	/** full constructor */
	public BdgMoneyPlanCon(String conid, Date plantime, Double plainmoney,String planRemark,String pid) {
		this.conid = conid;
		this.plantime = plantime;
		this.plainmoney = plainmoney;
		this.planRemark = planRemark;
		this.pid = pid;
	}

	// Property accessors

	public String getPlanconid() {
		return this.planconid;
	}

	public void setPlanconid(String planconid) {
		this.planconid = planconid;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Date getPlantime() {
		return this.plantime;
	}

	public void setPlantime(Date plantime) {
		this.plantime = plantime;
	}

	public Double getPlainmoney() {
		return this.plainmoney;
	}

	public void setPlainmoney(Double plainmoney) {
		this.plainmoney = plainmoney;
	}

	public String getPlanRemark() {
		return planRemark;
	}

	public void setPlanRemark(String planRemark) {
		this.planRemark = planRemark;
	}

}