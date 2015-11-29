package com.sgepit.pmis.wzgl.hbm;

/**
 * WzUserCkclb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzUserCkclb implements java.io.Serializable {

	// Fields

	private String uids;
	private String userid;
	private String userrole;
	private String bm;
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public WzUserCkclb() {
	}

	/** full constructor */
	public WzUserCkclb(String userid, String userrole, String bm, String pid) {
		this.userid = userid;
		this.userrole = userrole;
		this.bm = bm;
		this.pid = pid;
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

	public String getUserrole() {
		return this.userrole;
	}

	public void setUserrole(String userrole) {
		this.userrole = userrole;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

}