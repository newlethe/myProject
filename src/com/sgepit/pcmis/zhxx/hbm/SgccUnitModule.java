package com.sgepit.pcmis.zhxx.hbm;

/**
 * SgccUnitModule entity. @author MyEclipse Persistence Tools
 */

public class SgccUnitModule implements java.io.Serializable {

	// Fields

	private String uids;
	private String unitid;
	private String powerpk;

	// Constructors

	/** default constructor */
	public SgccUnitModule() {
	}

	/** full constructor */
	public SgccUnitModule(String unitid, String powerpk) {
		this.unitid = unitid;
		this.powerpk = powerpk;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getUnitid() {
		return this.unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

	public String getPowerpk() {
		return this.powerpk;
	}

	public void setPowerpk(String powerpk) {
		this.powerpk = powerpk;
	}

}