package com.sgepit.frame.sysman.hbm;

/**
 * RockUnitpos entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockUnitpos implements java.io.Serializable {

	// Fields

	private String uids;
	private String posid;
	private String orgid;

	// Constructors

	/** default constructor */
	public RockUnitpos() {
	}

	/** full constructor */
	public RockUnitpos(String posid, String orgid) {
		this.posid = posid;
		this.orgid = orgid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPosid() {
		return this.posid;
	}

	public void setPosid(String posid) {
		this.posid = posid;
	}

	public String getOrgid() {
		return this.orgid;
	}

	public void setOrgid(String orgid) {
		this.orgid = orgid;
	}

}