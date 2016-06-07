package com.sgepit.pcmis.zhxx.hbm;

import java.util.Date;

/**
 * PcProBaseInfoM entity. @author MyEclipse Persistence Tools
 */

public class PcProBaseInfoM implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private Date createdate;
	private String createperson;
	private String sjType;
	private String reportname;
	private Long reportStatus;
	private String memo;
	private String dutyPerson;

	// Constructors

	/** default constructor */
	public PcProBaseInfoM() {
	}

	/** minimal constructor */
	public PcProBaseInfoM(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcProBaseInfoM(String pid, Date createdate, String createperson,
			String sjType, String reportname, Long reportStatus,
			String memo, String dutyPerson) {
		this.pid = pid;
		this.createdate = createdate;
		this.createperson = createperson;
		this.sjType = sjType;
		this.reportname = reportname;
		this.reportStatus = reportStatus;
		this.memo = memo;
		this.dutyPerson = dutyPerson;
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

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getReportname() {
		return this.reportname;
	}

	public void setReportname(String reportname) {
		this.reportname = reportname;
	}

	public Long getReportStatus() {
		return this.reportStatus;
	}

	public void setReportStatus(Long reportStatus) {
		this.reportStatus = reportStatus;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getDutyPerson() {
		return this.dutyPerson;
	}

	public void setDutyPerson(String dutyPerson) {
		this.dutyPerson = dutyPerson;
	}

}