package com.sgepit.pcmis.tzgl.hbm;

import java.util.Date;

/**
 * PcTzglYearPlanM entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcTzglYearPlanM implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String sjType;
	private String unitId;
	private String title;
	private Long billState;
	private Long issueStatus;
	private String memo;
	private String userId;
	private Date createDate;
	private Date lastModifyDate;
	private String unitTypeId;
	private String unitname;
	private String reason;
	private String backUser;
	private Date backDate;
	private String flagNull;

	// Constructors

	/** default constructor */
	public VPcTzglYearPlanM() {
	}

	/** full constructor */
	public VPcTzglYearPlanM(String pid, String sjType, String unitId,
			String title, Long billState, Long issueStatus, String memo,
			String userId, Date createDate, Date lastModifyDate, 
			String unitTypeId, String unitname, String reason, String backUser,
			Date backDate, String flagNull) {
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.title = title;
		this.billState = billState;
		this.issueStatus = issueStatus;
		this.memo = memo;
		this.userId = userId;
		this.createDate = createDate;
		this.lastModifyDate = lastModifyDate;
		this.unitTypeId = unitTypeId;
		this.unitname = unitname;
		this.reason = reason;
		this.backDate=backDate;
		this.backUser=backUser;
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

	public Long getIssueStatus() {
		return this.issueStatus;
	}

	public void setIssueStatus(Long issueStatus) {
		this.issueStatus = issueStatus;
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

	public String getUnitTypeId() {
		return unitTypeId;
	}

	public void setUnitTypeId(String unitTypeId) {
		this.unitTypeId = unitTypeId;
	}

	public String getUnitname() {
		return unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getBackUser() {
		return backUser;
	}

	public void setBackUser(String backUser) {
		this.backUser = backUser;
	}

	public Date getBackDate() {
		return backDate;
	}

	public void setBackDate(Date backDate) {
		this.backDate = backDate;
	}

	public String getFlagNull() {
		return flagNull;
	}

	public void setFlagNull(String flagNull) {
		this.flagNull = flagNull;
	}
	
}