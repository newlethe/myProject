package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * RzglKqglKqAdjust entity. @author MyEclipse Persistence Tools
 */

public class RzglKqglKqAdjust implements java.io.Serializable {

	// Fields

	private String uids;
	private String userId;
	private String deptId;
	private Date kqDate;
	private String adjustType;
	private Date startTime;
	private Date endTime;
	private String proveMan;
	private String billState;
	private String pid;

	// Constructors

	/** default constructor */
	public RzglKqglKqAdjust() {
	}

	/** full constructor */
	public RzglKqglKqAdjust(String userId, String deptId, Date kqDate,
			String adjustType, Date startTime, Date endTime, String proveMan,
			String billState, String pid) {
		this.userId = userId;
		this.deptId = deptId;
		this.kqDate = kqDate;
		this.adjustType = adjustType;
		this.startTime = startTime;
		this.endTime = endTime;
		this.proveMan = proveMan;
		this.billState = billState;
		this.pid = pid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public Date getKqDate() {
		return this.kqDate;
	}

	public void setKqDate(Date kqDate) {
		this.kqDate = kqDate;
	}

	public String getAdjustType() {
		return this.adjustType;
	}

	public void setAdjustType(String adjustType) {
		this.adjustType = adjustType;
	}

	public Date getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return this.endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getProveMan() {
		return this.proveMan;
	}

	public void setProveMan(String proveMan) {
		this.proveMan = proveMan;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}