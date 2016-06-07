package com.sgepit.pmis.wzgl.hbm;

/**
 * WzCkhUser entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCkhUser implements java.io.Serializable {

	// Fields

	private String uids;
	private String ckh;
	private String userid;
	private String userrole;
	
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
	// Constructors

	/** default constructor */
	public WzCkhUser() {
	}

	/** full constructor */
	public WzCkhUser(String ckh, String userid, String userrole) {
		this.ckh = ckh;
		this.userid = userid;
		this.userrole = userrole;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCkh() {
		return this.ckh;
	}

	public void setCkh(String ckh) {
		this.ckh = ckh;
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

}