package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * ConCompletion entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConCompletion implements java.io.Serializable {

	// Fields

	private String concomid;
	private String conid;
	private Date month;
	private Double summoney;
	private Long billstate;
	private String remark;

	// Constructors

	/** default constructor */
	public ConCompletion() {
	}

	/** minimal constructor */
	public ConCompletion(String conid) {
		this.conid = conid;
	}

	/** full constructor */
	public ConCompletion(String conid, Date month, Double summoney,
			Long billstate, String remark) {
		this.conid = conid;
		this.month = month;
		this.summoney = summoney;
		this.billstate = billstate;
		this.remark = remark;
	}

	// Property accessors

	public String getConcomid() {
		return this.concomid;
	}

	public void setConcomid(String concomid) {
		this.concomid = concomid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Date getMonth() {
		return this.month;
	}

	public void setMonth(Date month) {
		this.month = month;
	}

	public Double getSummoney() {
		return this.summoney;
	}

	public void setSummoney(Double summoney) {
		this.summoney = summoney;
	}

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}