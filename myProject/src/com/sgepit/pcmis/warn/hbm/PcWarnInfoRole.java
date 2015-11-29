package com.sgepit.pcmis.warn.hbm;

import java.util.Date;

/**
 * PcWarnInfoRole entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcWarnInfoRole implements java.io.Serializable {

	// Fields

	private String uids;
	private String warninfoid;
	private String pid;
	private Date roletime;
	private String warnrole;
	private String doperson;

	// Constructors

	/** default constructor */
	public PcWarnInfoRole() {
	}

	/** full constructor */
	public PcWarnInfoRole(String warninfoid, String pid, Date roletime,
			String warnrole, String doperson) {
		this.warninfoid = warninfoid;
		this.pid = pid;
		this.roletime = roletime;
		this.warnrole = warnrole;
		this.doperson = doperson;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getWarninfoid() {
		return this.warninfoid;
	}

	public void setWarninfoid(String warninfoid) {
		this.warninfoid = warninfoid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Date getRoletime() {
		return this.roletime;
	}

	public void setRoletime(Date roletime) {
		this.roletime = roletime;
	}

	public String getWarnrole() {
		return this.warnrole;
	}

	public void setWarnrole(String warnrole) {
		this.warnrole = warnrole;
	}

	public String getDoperson() {
		return this.doperson;
	}

	public void setDoperson(String doperson) {
		this.doperson = doperson;
	}

}