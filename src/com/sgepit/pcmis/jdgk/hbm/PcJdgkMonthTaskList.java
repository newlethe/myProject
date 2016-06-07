package com.sgepit.pcmis.jdgk.hbm;

import java.util.Date;

/**
 * PcJdgkMonthTaskList entity. @author MyEclipse Persistence Tools
 */

public class PcJdgkMonthTaskList implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String masterid;
	private String edoTaskUid;
	private String edoProjectUid;
	private String taskName;
	private Date planStartTime;
	private Date planCompTime;
	private Date realStartTime;
	private Date realCompTime;
	private String memo;
	private String treeid;
	private String parentid;
	private Long isleaf;
	private String sjType;

	// Constructors

	/** default constructor */
	public PcJdgkMonthTaskList() {
	}

	/** minimal constructor */
	public PcJdgkMonthTaskList(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcJdgkMonthTaskList(String pid, String masterid, String edoTaskUid,
			String edoProjectUid, Date planStartTime, Date planCompTime,
			Date realStartTime, Date realCompTime, String memo,String sjType,
			String treeid, String parentid, Long isleaf, String taskName) {
		this.pid = pid;
		this.masterid = masterid;
		this.edoTaskUid = edoTaskUid;
		this.edoProjectUid = edoProjectUid;
		this.planStartTime = planStartTime;
		this.planCompTime = planCompTime;
		this.realStartTime = realStartTime;
		this.realCompTime = realCompTime;
		this.memo = memo;
		this.treeid = treeid;
		this.parentid = parentid;
		this.isleaf = isleaf;
		this.taskName = taskName;
		this.sjType = sjType;
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

	public String getMasterid() {
		return this.masterid;
	}

	public void setMasterid(String masterid) {
		this.masterid = masterid;
	}

	public String getEdoTaskUid() {
		return this.edoTaskUid;
	}

	public void setEdoTaskUid(String edoTaskUid) {
		this.edoTaskUid = edoTaskUid;
	}

	public String getEdoProjectUid() {
		return this.edoProjectUid;
	}

	public void setEdoProjectUid(String edoProjectUid) {
		this.edoProjectUid = edoProjectUid;
	}

	public Date getPlanStartTime() {
		return this.planStartTime;
	}

	public void setPlanStartTime(Date planStartTime) {
		this.planStartTime = planStartTime;
	}

	public Date getPlanCompTime() {
		return this.planCompTime;
	}

	public void setPlanCompTime(Date planCompTime) {
		this.planCompTime = planCompTime;
	}

	public Date getRealStartTime() {
		return this.realStartTime;
	}

	public void setRealStartTime(Date realStartTime) {
		this.realStartTime = realStartTime;
	}

	public Date getRealCompTime() {
		return this.realCompTime;
	}

	public void setRealCompTime(Date realCompTime) {
		this.realCompTime = realCompTime;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getTreeid() {
		return treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getSjType() {
		return sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

}