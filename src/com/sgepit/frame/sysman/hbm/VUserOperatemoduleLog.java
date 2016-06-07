package com.sgepit.frame.sysman.hbm;

import java.util.Date;

/**
 * VUserOperatemoduleLog entity. @author MyEclipse Persistence Tools
 */

public class VUserOperatemoduleLog implements java.io.Serializable {

	// Fields

	private String uids;
	private String username;
	private Date thistime;
	private String thisip;
	private Date operatetime;
	private String modilename;
	public VUserOperatemoduleLog() {
		super();
		// TODO Auto-generated constructor stub
	}
	public VUserOperatemoduleLog(String uids, String username, Date thistime,
			String thisip, Date operatetime, String modilename) {
		super();
		this.uids = uids;
		this.username = username;
		this.thistime = thistime;
		this.thisip = thisip;
		this.operatetime = operatetime;
		this.modilename = modilename;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Date getThistime() {
		return thistime;
	}
	public void setThistime(Date thistime) {
		this.thistime = thistime;
	}
	public String getThisip() {
		return thisip;
	}
	public void setThisip(String thisip) {
		this.thisip = thisip;
	}
	public Date getOperatetime() {
		return operatetime;
	}
	public void setOperatetime(Date operatetime) {
		this.operatetime = operatetime;
	}
	public String getModilename() {
		return modilename;
	}
	public void setModilename(String modilename) {
		this.modilename = modilename;
	}
	

}