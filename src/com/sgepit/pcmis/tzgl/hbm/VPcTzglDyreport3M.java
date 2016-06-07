package com.sgepit.pcmis.tzgl.hbm;

import java.util.Date;

/**
 * PcTzglDyreport1M entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcTzglDyreport3M implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String sjType;
	private String unitId;
	private String title;
	private String userId;
	private Date createDate;
	private String state;
	private String billState;
	private String memo;
	private Double memoNumber1;
	private Double memoNumber2;
	private Double memoNumber3;
	private String memoVarchar1;
	private String memoVarchar2;
	private String memoVarchar3;
	private Date memoDate1;
	private Date memoDate2;
	
	//在实体Java类中加入以下属性
	private String unitTypeId;
	private String unitname;
	private String reason;
	private String createperson;
	private String unitUsername;
	private String countUsername;
	private String createpersonTel;
	private Date reportDate;
	private String flagNull;

	// Constructors

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

	/** default constructor */
	public VPcTzglDyreport3M() {
	}

	/** full constructor */
	public VPcTzglDyreport3M(String pid, String sjType, String unitId,
			String title, String userId, Date createDate, String state,
			String billState, String memo, Double memoNumber1,
			Double memoNumber2, Double memoNumber3, String memoVarchar1,
			String memoVarchar2, String memoVarchar3, Date memoDate1,
			Date memoDate2,String unitTypeId, String unitname, String reason,
			String createperson,String unitUsername,String countUsername,
			String createpersonTel,Date reportDate, String flagNull) {
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.title = title;
		this.userId = userId;
		this.createDate = createDate;
		this.state = state;
		this.billState = billState;
		this.memo = memo;
		this.memoNumber1 = memoNumber1;
		this.memoNumber2 = memoNumber2;
		this.memoNumber3 = memoNumber3;
		this.memoVarchar1 = memoVarchar1;
		this.memoVarchar2 = memoVarchar2;
		this.memoVarchar3 = memoVarchar3;
		this.memoDate1 = memoDate1;
		this.memoDate2 = memoDate2;
		
		this.unitTypeId = unitTypeId;
		this.unitname = unitname;
		this.reason =reason;
		this.createperson=createperson;
		this.countUsername=countUsername;
		this.unitUsername=unitUsername;
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

	public Double getMemoNumber1() {
		return this.memoNumber1;
	}

	public void setMemoNumber1(Double memoNumber1) {
		this.memoNumber1 = memoNumber1;
	}

	public Double getMemoNumber2() {
		return this.memoNumber2;
	}

	public void setMemoNumber2(Double memoNumber2) {
		this.memoNumber2 = memoNumber2;
	}

	public Double getMemoNumber3() {
		return this.memoNumber3;
	}

	public void setMemoNumber3(Double memoNumber3) {
		this.memoNumber3 = memoNumber3;
	}

	public String getMemoVarchar1() {
		return this.memoVarchar1;
	}

	public void setMemoVarchar1(String memoVarchar1) {
		this.memoVarchar1 = memoVarchar1;
	}

	public String getMemoVarchar2() {
		return this.memoVarchar2;
	}

	public void setMemoVarchar2(String memoVarchar2) {
		this.memoVarchar2 = memoVarchar2;
	}

	public String getMemoVarchar3() {
		return this.memoVarchar3;
	}

	public void setMemoVarchar3(String memoVarchar3) {
		this.memoVarchar3 = memoVarchar3;
	}

	public Date getMemoDate1() {
		return this.memoDate1;
	}

	public void setMemoDate1(Date memoDate1) {
		this.memoDate1 = memoDate1;
	}

	public Date getMemoDate2() {
		return this.memoDate2;
	}

	public void setMemoDate2(Date memoDate2) {
		this.memoDate2 = memoDate2;
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

	public String getFlagNull() {
		return flagNull;
	}

	public void setFlagNull(String flagNull) {
		this.flagNull = flagNull;
	}

}