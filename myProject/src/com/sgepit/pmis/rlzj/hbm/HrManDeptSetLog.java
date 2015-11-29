package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrManDeptSetLog entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManDeptSetLog implements java.io.Serializable {

	// Fields

	private String lsh;
	private String sjType;
	private String userid;
	private String unitId;
	private String deptId;
	private String postId;
	private String oldDeptId;
	private Date setDate;
	private String memo;

	// Constructors

	/** default constructor */
	public HrManDeptSetLog() {
	}

	/** minimal constructor */
	public HrManDeptSetLog(String lsh, String sjType, String userid,
			String deptId, Date setDate) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.userid = userid;
		this.deptId = deptId;
		this.setDate = setDate;
	}

	/** full constructor */
	public HrManDeptSetLog(String lsh, String sjType, String userid,
			String unitId, String deptId, String postId, String oldDeptId,
			Date setDate, String memo) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.userid = userid;
		this.unitId = unitId;
		this.deptId = deptId;
		this.postId = postId;
		this.oldDeptId = oldDeptId;
		this.setDate = setDate;
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

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
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

	public String getPostId() {
		return this.postId;
	}

	public void setPostId(String postId) {
		this.postId = postId;
	}

	public String getOldDeptId() {
		return this.oldDeptId;
	}

	public void setOldDeptId(String oldDeptId) {
		this.oldDeptId = oldDeptId;
	}

	public Date getSetDate() {
		return this.setDate;
	}

	public void setSetDate(Date setDate) {
		this.setDate = setDate;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}