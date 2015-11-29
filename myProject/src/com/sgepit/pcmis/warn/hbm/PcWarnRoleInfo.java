package com.sgepit.pcmis.warn.hbm;

/**
 * PcWarnRoleInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcWarnRoleInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String roletype;
	private String rolelevel;
	private String warnrulesid;

	// Constructors

	/** default constructor */
	public PcWarnRoleInfo() {
	}

	/** full constructor */
	public PcWarnRoleInfo(String pid, String roletype, String rolelevel,
			String warnrulesid) {
		this.pid = pid;
		this.roletype = roletype;
		this.rolelevel = rolelevel;
		this.warnrulesid = warnrulesid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getRoletype() {
		return this.roletype;
	}

	public void setRoletype(String roletype) {
		this.roletype = roletype;
	}

	public String getRolelevel() {
		return this.rolelevel;
	}

	public void setRolelevel(String rolelevel) {
		this.rolelevel = rolelevel;
	}

	public String getWarnrulesid() {
		return this.warnrulesid;
	}

	public void setWarnrulesid(String warnrulesid) {
		this.warnrulesid = warnrulesid;
	}

}