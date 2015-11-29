package com.sgepit.frame.sysman.hbm;

/**
 * RockUser2dept entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockUser2dept implements java.io.Serializable {

	// Fields

	private String uids;
	private String userid;
	private String deptId;
	private String gwId;

	// Constructors

	/** default constructor */
	public RockUser2dept() {
	}

	/** full constructor */
	public RockUser2dept(String userid, String deptId, String gwId) {
		this.userid = userid;
		this.deptId = deptId;
		this.gwId = gwId;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getGwId() {
		return this.gwId;
	}

	public void setGwId(String gwId) {
		this.gwId = gwId;
	}

}