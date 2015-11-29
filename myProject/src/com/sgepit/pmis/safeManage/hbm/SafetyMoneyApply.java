package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafetyMoneyApply entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafetyMoneyApply implements java.io.Serializable {

	// Fields

	private String uuid;
	private String flowid;
	private Date applytime;
	private String applydept;
	private String applyuser;
	private Double applymoney;
	private String using;
	private String billstate;
	private String pid;

	// Constructors

	/** default constructor */
	public SafetyMoneyApply() {
	}

	/** full constructor */
	public SafetyMoneyApply(String flowid, Date applytime, String applydept,
			String applyuser, Double applymoney, String using, String billstate) {
		this.flowid = flowid;
		this.applytime = applytime;
		this.applydept = applydept;
		this.applyuser = applyuser;
		this.applymoney = applymoney;
		this.using = using;
		this.billstate = billstate;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getFlowid() {
		return this.flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public Date getApplytime() {
		return this.applytime;
	}

	public void setApplytime(Date applytime) {
		this.applytime = applytime;
	}

	public String getApplydept() {
		return this.applydept;
	}

	public void setApplydept(String applydept) {
		this.applydept = applydept;
	}

	public String getApplyuser() {
		return this.applyuser;
	}

	public void setApplyuser(String applyuser) {
		this.applyuser = applyuser;
	}

	public Double getApplymoney() {
		return this.applymoney;
	}

	public void setApplymoney(Double applymoney) {
		this.applymoney = applymoney;
	}

	public String getUsing() {
		return this.using;
	}

	public void setUsing(String using) {
		this.using = using;
	}

	public String getBillstate() {
		return this.billstate;
	}

	public void setBillstate(String billstate) {
		this.billstate = billstate;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}