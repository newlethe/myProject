package com.sgepit.frame.sysman.hbm;

/**
 * RockRole2user entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockRole2user implements java.io.Serializable {

	// Fields

	private String uids;
	private String userid;
	private String rolepk;
	private String unitid;

	// Constructors

	/** default constructor */
	public RockRole2user() {
	}

	/** minimal constructor */
	public RockRole2user(String userid, String rolepk) {
		this.userid = userid;
		this.rolepk = rolepk;
	}

	/** full constructor */
	public RockRole2user(String userid, String rolepk, String unitid) {
		this.userid = userid;
		this.rolepk = rolepk;
		this.unitid = unitid;
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

	public String getRolepk() {
		return this.rolepk;
	}

	public void setRolepk(String rolepk) {
		this.rolepk = rolepk;
	}

	public String getUnitid() {
		return this.unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

}