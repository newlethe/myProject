package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrXcBonusM entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrXcBonusM implements java.io.Serializable {

	// Fields

	private String lsh;
	private String sjType;
	private String unitId;
	private Long count;
	private String title;
	private String status;
	private String billStatus;
	private String userId;
	private Date createDate;
	private Date latestDate;
	private String memo;

	// Constructors

	/** default constructor */
	public HrXcBonusM() {
	}

	/** minimal constructor */
	public HrXcBonusM(String lsh, String sjType, String unitId) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
	}

	/** full constructor */
	public HrXcBonusM(String lsh, String sjType, String unitId, Long count,
			String title, String status, String billStatus, String memo) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.count = count;
		this.title = title;
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

	public Long getCount() {
		return this.count;
	}

	public void setCount(Long count) {
		this.count = count;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	public String getUserId() {
		return userId;
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

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}