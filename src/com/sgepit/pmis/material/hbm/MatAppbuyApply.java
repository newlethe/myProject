package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatAppbuyApply entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatAppbuyApply implements java.io.Serializable {

	// Fields

	private String uuid;
	private String appNo;
	private String appDept;
	private Date appDate;
	private String conid;
	private String bdgid;
	private Double appMoney;
	private Double proveMoney;
	private String appType;
	private String action;
	private String appMan;
	private String billSate;

	// Constructors

	/** default constructor */
	public MatAppbuyApply() {
	}

	/** full constructor */
	public MatAppbuyApply(String appNo, String appDept, Date appDate,
			String conid, String bdgid, Double appMoney, Double proveMoney,
			String appType, String action, String appMan, String billSate) {
		this.appNo = appNo;
		this.appDept = appDept;
		this.appDate = appDate;
		this.conid = conid;
		this.bdgid = bdgid;
		this.appMoney = appMoney;
		this.proveMoney = proveMoney;
		this.appType = appType;
		this.action = action;
		this.appMan = appMan;
		this.billSate = billSate;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getAppNo() {
		return this.appNo;
	}

	public void setAppNo(String appNo) {
		this.appNo = appNo;
	}

	public String getAppDept() {
		return this.appDept;
	}

	public void setAppDept(String appDept) {
		this.appDept = appDept;
	}

	public Date getAppDate() {
		return this.appDate;
	}

	public void setAppDate(Date appDate) {
		this.appDate = appDate;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public Double getAppMoney() {
		return this.appMoney;
	}

	public void setAppMoney(Double appMoney) {
		this.appMoney = appMoney;
	}

	public Double getProveMoney() {
		return this.proveMoney;
	}

	public void setProveMoney(Double proveMoney) {
		this.proveMoney = proveMoney;
	}

	public String getAppType() {
		return this.appType;
	}

	public void setAppType(String appType) {
		this.appType = appType;
	}

	public String getAction() {
		return this.action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getAppMan() {
		return this.appMan;
	}

	public void setAppMan(String appMan) {
		this.appMan = appMan;
	}

	public String getBillSate() {
		return this.billSate;
	}

	public void setBillSate(String billSate) {
		this.billSate = billSate;
	}

}