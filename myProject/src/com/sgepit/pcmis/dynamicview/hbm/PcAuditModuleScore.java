package com.sgepit.pcmis.dynamicview.hbm;

/**
 * PcAuditModuleScore entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcAuditModuleScore implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String modName;
	private String state;
	private String sjType;

	// Constructors

	/** default constructor */
	public PcAuditModuleScore() {
	}

	/** minimal constructor */
	public PcAuditModuleScore(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public PcAuditModuleScore(String uids, String pid, String modName,
			String state, String sjType) {
		this.uids = uids;
		this.pid = pid;
		this.modName = modName;
		this.state = state;
		this.sjType = sjType;
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

	public String getModName() {
		return this.modName;
	}

	public void setModName(String modName) {
		this.modName = modName;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

}