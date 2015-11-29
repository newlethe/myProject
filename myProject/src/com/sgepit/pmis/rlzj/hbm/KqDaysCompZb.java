package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * KqDaysCompZb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class KqDaysCompZb implements java.io.Serializable {

	// Fields

	private String lsh;
	private String sjType;
	private String unitId;
	private String deptId;
	private String title;
	private String userId;
	private Date createDate;
	private Date latestDate;
	private String status;
	private String billStatus;
	private String memo;

	// Constructors

	/** default constructor */
	public KqDaysCompZb() {
	}

	/** minimal constructor */
	public KqDaysCompZb(String lsh, String sjType, String unitId, String deptId) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.deptId = deptId;
	}

	/** full constructor */
	public KqDaysCompZb(String lsh, String sjType, String unitId,
			String deptId, String title, String userId, String status,
			String billStatus, String memo) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.deptId = deptId;
		this.title = title;
		this.userId = userId;
		this.status = status;
		this.billStatus = billStatus;
		this.memo = memo;
	}

	// Property accessors

	public String getLsh() {
		return this.lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
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

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
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
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getLatestDate() {
		return latestDate;
	}

	public void setLatestDate(Date latestDate) {
		this.latestDate = latestDate;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getBillStatus() {
		return this.billStatus;
	}

	public void setBillStatus(String billStatus) {
		this.billStatus = billStatus;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}