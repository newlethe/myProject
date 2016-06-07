package com.sgepit.frame.sysman.hbm;

import java.util.Date;

/**
 * RockUserOperatemoduleLog entity. @author MyEclipse Persistence Tools
 */

public class RockUserOperatemoduleLog implements java.io.Serializable {

	// Fields

	private String uids;
	private String userid;
	private Date operatetime;
	private String userip;
	private String moduleid;

	// Constructors

	/** default constructor */
	public RockUserOperatemoduleLog() {
	}

	/** full constructor */
	public RockUserOperatemoduleLog(String userid, Date operatetime,
			String userip, String moduleid) {
		this.userid = userid;
		this.operatetime = operatetime;
		this.userip = userip;
		this.moduleid = moduleid;
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

	public Date getOperatetime() {
		return this.operatetime;
	}

	public void setOperatetime(Date operatetime) {
		this.operatetime = operatetime;
	}

	public String getUserip() {
		return this.userip;
	}

	public void setUserip(String userip) {
		this.userip = userip;
	}

	public String getModuleid() {
		return this.moduleid;
	}

	public void setModuleid(String moduleid) {
		this.moduleid = moduleid;
	}

}