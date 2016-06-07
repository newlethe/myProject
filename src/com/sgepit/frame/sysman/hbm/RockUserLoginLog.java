package com.sgepit.frame.sysman.hbm;

import java.util.Date;

/**
 * RockUserLoginLog entity. @author MyEclipse Persistence Tools
 */

public class RockUserLoginLog implements java.io.Serializable {

	// Fields

	private String uids;
	private String userid;
	private Date thistime;
	private String thisip;
	private String hasalert;

	// Constructors

	/** default constructor */
	public RockUserLoginLog() {
	}

	/** full constructor */
	public RockUserLoginLog(String userid, Date thistime, String thisip,
			String hasalert) {
		this.userid = userid;
		this.thistime = thistime;
		this.thisip = thisip;
		this.hasalert = hasalert;
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

	public Date getThistime() {
		return this.thistime;
	}

	public void setThistime(Date thistime) {
		this.thistime = thistime;
	}

	public String getThisip() {
		return this.thisip;
	}

	public void setThisip(String thisip) {
		this.thisip = thisip;
	}

	public String getHasalert() {
		return this.hasalert;
	}

	public void setHasalert(String hasalert) {
		this.hasalert = hasalert;
	}

}