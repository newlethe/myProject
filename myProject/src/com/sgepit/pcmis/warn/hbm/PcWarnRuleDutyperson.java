package com.sgepit.pcmis.warn.hbm;

/**
 * PcWarnRuleDutyperson entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcWarnRuleDutyperson implements java.io.Serializable {

	// Fields

	private String uids;
	private String moduleid;
	private String dutyperson;

	// Constructors

	/** default constructor */
	public PcWarnRuleDutyperson() {
	}

	/** full constructor */
	public PcWarnRuleDutyperson(String moduleid, String dutyperson) {
		this.moduleid = moduleid;
		this.dutyperson = dutyperson;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getModuleid() {
		return this.moduleid;
	}

	public void setModuleid(String moduleid) {
		this.moduleid = moduleid;
	}

	public String getDutyperson() {
		return this.dutyperson;
	}

	public void setDutyperson(String dutyperson) {
		this.dutyperson = dutyperson;
	}

}