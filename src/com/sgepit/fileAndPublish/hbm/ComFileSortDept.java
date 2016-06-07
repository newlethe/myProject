package com.sgepit.fileAndPublish.hbm;

/**
 * ComFileSortDept entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ComFileSortDept implements java.io.Serializable {

	// Fields

	private String uids;
	private String fileSortId;
	private String deptId;
	private String rightLvl;

	// Constructors

	/** default constructor */
	public ComFileSortDept() {
	}

	/** minimal constructor */
	public ComFileSortDept(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public ComFileSortDept(String uids, String fileSortId, String deptId,
			String rightLvl) {
		this.uids = uids;
		this.fileSortId = fileSortId;
		this.deptId = deptId;
		this.rightLvl = rightLvl;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getFileSortId() {
		return this.fileSortId;
	}

	public void setFileSortId(String fileSortId) {
		this.fileSortId = fileSortId;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getRightLvl() {
		return this.rightLvl;
	}

	public void setRightLvl(String rightLvl) {
		this.rightLvl = rightLvl;
	}

}