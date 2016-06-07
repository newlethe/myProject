package com.sgepit.pmis.planMgm.hbm;

import java.util.Date;

/**
 * FundMonthPlanM entity. @author MyEclipse Persistence Tools
 */

public class FundMonthPlanM implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String sjType;
	private String reportName;
	private String remark;
	private String userId;
	private Date createDate;
	private String createperson;
	private String isInit;

	// Constructors

	/** default constructor */
	public FundMonthPlanM() {
	}

	/** full constructor */
	public FundMonthPlanM(String pid, String sjType, String reportName,
			String remark, String userId, Date createDate, String createperson,String isInit) {
		this.pid = pid;
		this.sjType = sjType;
		this.reportName = reportName;
		this.remark = remark;
		this.userId = userId;
		this.createDate = createDate;
		this.createperson = createperson;
		this.isInit = isInit;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getReportName() {
		return this.reportName;
	}

	public void setReportName(String reportName) {
		this.reportName = reportName;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateperson() {
		return this.createperson;
	}

	public void setCreateperson(String createperson) {
		this.createperson = createperson;
	}

	public String getIsInit() {
		return isInit;
	}

	public void setIsInit(String isInit) {
		this.isInit = isInit;
	}

}