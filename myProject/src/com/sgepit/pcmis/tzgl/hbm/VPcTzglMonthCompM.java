package com.sgepit.pcmis.tzgl.hbm;

import java.util.Date;

/**
 * PcTzglMonthCompM entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcTzglMonthCompM implements java.io.Serializable {

	// Fields

	private String pid;
	private String uids;
	private String createperson;
	private Date createDate;
	private String title;
	private String memo;
	private Long reportStatus;
	private Long billState;
	private String sjType;
	private String userId;
	private String unitTypeId;
	private String unitname;
	private String reason;
	private String backUser;
	private Date backDate;
	private String unitUsername;
	private String countUsername;
	private String createpersonTel;

	// Constructors

	/** default constructor */
	public VPcTzglMonthCompM() {
	}

	/** full constructor */
	public VPcTzglMonthCompM(String pid, String uids, String createperson,String userId,
			Date createDate, String title, String memo, Long reportStatus, 
			Long billState, String sjType, String unitTypeId, String unitname,
			String reason,Date backDate,String unitUsername,String countUsername,String createpersonTel) {
		this.pid = pid;
		this.uids = uids;
		this.createperson = createperson;
		this.createDate = createDate;
		this.title = title;
		this.memo = memo;
		this.reportStatus = reportStatus;
		this.billState = billState;
		this.sjType = sjType;
		this.userId = userId;
		this.unitTypeId = unitTypeId;
		this.unitname = unitname;
		this.reason = reason;
		this.backDate=backDate;
		this.unitUsername=unitUsername;
		this.countUsername=countUsername;
		this.createpersonTel=createpersonTel;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCreateperson() {
		return createperson;
	}

	public void setCreateperson(String createperson) {
		this.createperson = createperson;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Long getReportStatus() {
		return reportStatus;
	}

	public void setReportStatus(Long reportStatus) {
		this.reportStatus = reportStatus;
	}

	public Long getBillState() {
		return billState;
	}

	public void setBillState(Long billState) {
		this.billState = billState;
	}

	public String getSjType() {
		return sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
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

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
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
	
}