package com.sgepit.pcmis.jdgk.hbm;

import java.util.Date;

/**
 * PcEdoReportInput entity.
 * @author MyEclipse Persistence Tools
 */

public class PcEdoReportInput implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private Date createdate;
	private String createperson;
	private String reportname;
	private String memo;
	private String state;
	private String projectId;
	private String billState;
	private String sjType;
	private String unitUsername;
	private String countUsername;
	private String createpersonTel;
	private Date reportDate;
	private String flagNull;

	// Constructors

	/** default constructor */
	public PcEdoReportInput() {
	}

	/** minimal constructor */
	public PcEdoReportInput(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public PcEdoReportInput(String uids, String pid, Date createdate,
			String createperson, String reportname, String memo, String state,
			String projectId, String billState, String sjType,String unitUsername,
			String countUsername,String createpersonTel,Date reportDate,String flagNull) {
		this.uids = uids;
		this.pid = pid;
		this.createdate = createdate;
		this.createperson = createperson;
		this.reportname = reportname;
		this.memo = memo;
		this.state = state;
		this.projectId = projectId;
		this.billState = billState;
		this.sjType = sjType;
		this.unitUsername=unitUsername;
		this.countUsername=countUsername;
		this.createpersonTel=createpersonTel;
		this.reportDate=reportDate;
		this.flagNull = flagNull;
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

	public Date getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}

	public String getCreateperson() {
		return this.createperson;
	}

	public void setCreateperson(String createperson) {
		this.createperson = createperson;
	}

	public String getReportname() {
		return this.reportname;
	}

	public void setReportname(String reportname) {
		this.reportname = reportname;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getProjectId() {
		return this.projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getBillState() {
		return this.billState;
	}
	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getUnitUsername() {
		return unitUsername;
	}

	public void setUnitUsername(String unitUsername) {
		this.unitUsername = unitUsername;
	}

	public String getCountUsername() {
		return countUsername;
	}

	public void setCountUsername(String countUsername) {
		this.countUsername = countUsername;
	}

	public String getCreatepersonTel() {
		return createpersonTel;
	}

	public void setCreatepersonTel(String createpersonTel) {
		this.createpersonTel = createpersonTel;
	}

	public Date getReportDate() {
		return reportDate;
	}

	public void setReportDate(Date reportDate) {
		this.reportDate = reportDate;
	}

	public String getFlagNull() {
		return flagNull;
	}

	public void setFlagNull(String flagNull) {
		this.flagNull = flagNull;
	}
	
	

}