package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * VPcBidSupervisereportM1 entity. @author MyEclipse Persistence Tools
 */

public class VPcBidSupervisereportM implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String sjType;
	private String unitId;
	private String title;
	private String userId;
	private String state;
	private String billState;
	private String memo;
	private Date createDate;
	private Date lastModifyDate;
	private String memoVar1;
	private String memoVar2;
	private String memoVar3;
	private String upUnitId;
	private String verifyState;
	private String unitTypeId;
	private String unitname;
	private String reason;
	private String backUser;
	private Date backDate;
	private String upUnitname;
	private Date reportDate;

	// Constructors

	/** default constructor */
	public VPcBidSupervisereportM() {
	}

	/** minimal constructor */
	public VPcBidSupervisereportM(String unitname) {
		this.unitname = unitname;
	}

	/** full constructor */
	public VPcBidSupervisereportM(String pid, String sjType, String unitId,
			String title, String userId, String state, String billState,
			String memo, Date createDate, Date lastModifyDate, String memoVar1,
			String memoVar2, String memoVar3, String upUnitId,
			String verifyState, String unitTypeId, String unitname,
			String reason, String backUser, Date backDate, String upUnitname,Date reportDate) {
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.title = title;
		this.userId = userId;
		this.state = state;
		this.billState = billState;
		this.memo = memo;
		this.createDate = createDate;
		this.lastModifyDate = lastModifyDate;
		this.memoVar1 = memoVar1;
		this.memoVar2 = memoVar2;
		this.memoVar3 = memoVar3;
		this.upUnitId = upUnitId;
		this.verifyState = verifyState;
		this.unitTypeId = unitTypeId;
		this.unitname = unitname;
		this.reason = reason;
		this.backUser = backUser;
		this.backDate=backDate;
		this.upUnitname=upUnitname;
		this.reportDate=reportDate;
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

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
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

	public String getMemoVar1() {
		return this.memoVar1;
	}

	public void setMemoVar1(String memoVar1) {
		this.memoVar1 = memoVar1;
	}

	public String getMemoVar2() {
		return this.memoVar2;
	}

	public void setMemoVar2(String memoVar2) {
		this.memoVar2 = memoVar2;
	}

	public String getMemoVar3() {
		return this.memoVar3;
	}

	public void setMemoVar3(String memoVar3) {
		this.memoVar3 = memoVar3;
	}

	public String getUpUnitId() {
		return this.upUnitId;
	}

	public void setUpUnitId(String upUnitId) {
		this.upUnitId = upUnitId;
	}

	public String getVerifyState() {
		return this.verifyState;
	}

	public void setVerifyState(String verifyState) {
		this.verifyState = verifyState;
	}

	public String getUnitTypeId() {
		return this.unitTypeId;
	}

	public void setUnitTypeId(String unitTypeId) {
		this.unitTypeId = unitTypeId;
	}

	public String getUnitname() {
		return this.unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getReason() {
		return this.reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getBackUser() {
		return this.backUser;
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

	public String getUpUnitname() {
		return upUnitname;
	}

	public void setUpUnitname(String upUnitname) {
		this.upUnitname = upUnitname;
	}

	public Date getReportDate() {
		return reportDate;
	}

	public void setReportDate(Date reportDate) {
		this.reportDate = reportDate;
	}
	
	
}