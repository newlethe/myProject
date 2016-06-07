package com.sgepit.pmis.wzgl.hbm;

/**
 * WzUser entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzUser implements java.io.Serializable {

	// Fields

	private String uids;
	private String userid;
	private String userrole;
	private String username;
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public WzUser() {
	}

	/** full constructor */
	public WzUser(String userid, String userrole) {
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

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}