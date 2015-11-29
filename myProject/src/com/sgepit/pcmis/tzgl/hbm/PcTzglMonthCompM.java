package com.sgepit.pcmis.tzgl.hbm;

import java.util.Date;

/**
 * PcTzglMonthCompM entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcTzglMonthCompM implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String sjType;
	private String unitId;
	private String title;
	private Long billState;
	private Long reportStatus;
	private String memo;
	private String createperson;
	private Date createDate;
	private Date lastModifyDate;
	private String userId;
	private String unitUsername;
	private String countUsername;
	private String createpersonTel;
	private Date reportDate;
	private String flagNull;

	// Constructors

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	/** default constructor */
	public PcTzglMonthCompM() {
	}

	/** full constructor */
	public PcTzglMonthCompM(String pid, String sjType, String unitId,
			String title, Long billState, Long reportStatus, String memo,
			String createperson, Date createDate, Date lastModifyDate, 
			String userId,String unitUsername,String countUsername,
			String createpersonTel,Date reportDate,String flagNull) {
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.title = title;
		this.billState = billState;
		this.reportStatus = reportStatus;
		this.memo = memo;
		this.createperson = createperson;
		this.createDate = createDate;
		this.lastModifyDate = lastModifyDate;
		this.userId = userId;
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

	public Long getBillState() {
		return this.billState;
	}

	public void setBillState(Long billState) {
		this.billState = billState;
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
		return createperson;
	}

	public void setCreateperson(String createperson) {
		this.createperson = createperson;
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

	public String getflagNull() {
		return flagNull;
	}

	public void setflagNull(String flagNull) {
		this.flagNull = flagNull;
	}
	
	

}