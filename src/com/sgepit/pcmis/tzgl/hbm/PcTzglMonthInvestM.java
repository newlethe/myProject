package com.sgepit.pcmis.tzgl.hbm;

import java.util.Date;

/**
 * PcTzglMonthInvestM entity. @author MyEclipse Persistence Tools
 */

public class PcTzglMonthInvestM implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String sjType;
	private String unitId;
	private String title;
	private Long reportStatus;
	private String memo;
	private String userId;
	private Date createDate;
	private Date lastModifyDate;
	private String createperson;
	private String unitUsername;
	private String countUsername;
	private String createpersonTel;
	private Date reportDate;
	private String flagNull;

	// Constructors

	/** default constructor */
	public PcTzglMonthInvestM() {
	}

	/** full constructor */
	public PcTzglMonthInvestM(String pid, String sjType, String unitId,
			String title, Long reportStatus, String memo, String userId,
			Date createDate, Date lastModifyDate, String createperson,
			String unitUsername, String countUsername, String createpersonTel,
			Date reportDate, String flagNull) {
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.title = title;
		this.reportStatus = reportStatus;
		this.memo = memo;
		this.userId = userId;
		this.createDate = createDate;
		this.lastModifyDate = lastModifyDate;
		this.createperson = createperson;
		this.unitUsername = unitUsername;
		this.countUsername = countUsername;
		this.createpersonTel = createpersonTel;
		this.reportDate = reportDate;
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

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	public Date getLastModifyDate() {
		return this.lastModifyDate;
	}

	public void setLastModifyDate(Date lastModifyDate) {
		this.lastModifyDate = lastModifyDate;
	}

	public String getCreateperson() {
		return this.createperson;
	}

	public void setCreateperson(String createperson) {
		this.createperson = createperson;
	}

	public String getUnitUsername() {
		return this.unitUsername;
	}

	public void setUnitUsername(String unitUsername) {
		this.unitUsername = unitUsername;
	}

	public String getCountUsername() {
		return this.countUsername;
	}

	public void setCountUsername(String countUsername) {
		this.countUsername = countUsername;
	}

	public String getCreatepersonTel() {
		return this.createpersonTel;
	}

	public void setCreatepersonTel(String createpersonTel) {
		this.createpersonTel = createpersonTel;
	}

	public Date getReportDate() {
		return this.reportDate;
	}

	public void setReportDate(Date reportDate) {
		this.reportDate = reportDate;
	}

	public String getFlagNull() {
		return this.flagNull;
	}

	public void setFlagNull(String flagNull) {
		this.flagNull = flagNull;
	}

}