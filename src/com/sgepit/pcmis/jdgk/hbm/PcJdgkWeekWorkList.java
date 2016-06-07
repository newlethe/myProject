package com.sgepit.pcmis.jdgk.hbm;

/**
 * PcJdgkWeekWorkList entity. @author MyEclipse Persistence Tools
 */

public class PcJdgkWeekWorkList implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String masterid;
	private String workNum;
	private String workPlan;
	private String workFinish;
	private String workProblem;
	private String memo;
	private String treeid;
	private String parentid;
	private Long isleaf;

	// Constructors

	/** default constructor */
	public PcJdgkWeekWorkList() {
	}

	/** minimal constructor */
	public PcJdgkWeekWorkList(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcJdgkWeekWorkList(String pid, String masterid, String workNum,
			String workPlan, String workFinish, String workProblem,
			String memo, String treeid, String parentid, Long isleaf) {
		this.pid = pid;
		this.masterid = masterid;
		this.workNum = workNum;
		this.workPlan = workPlan;
		this.workFinish = workFinish;
		this.workProblem = workProblem;
		this.memo = memo;
		this.treeid = treeid;
		this.parentid = parentid;
		this.isleaf = isleaf;
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

	public String getWorkNum() {
		return this.workNum;
	}

	public void setWorkNum(String workNum) {
		this.workNum = workNum;
	}

	public String getWorkPlan() {
		return this.workPlan;
	}

	public void setWorkPlan(String workPlan) {
		this.workPlan = workPlan;
	}

	public String getWorkFinish() {
		return this.workFinish;
	}

	public void setWorkFinish(String workFinish) {
		this.workFinish = workFinish;
	}

	public String getWorkProblem() {
		return this.workProblem;
	}

	public void setWorkProblem(String workProblem) {
		this.workProblem = workProblem;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

}