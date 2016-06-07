package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FACompFixedAssetTree entity. @author MyEclipse Persistence Tools
 */

public class FACompFixedAssetList implements java.io.Serializable {

	// Fields

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String uids;
	private String pid;
	private String treeid;
	private String parentid;
	private Long isleaf;
	private String fixedno;
	private String fixedname;

	// Constructors

	/** default constructor */
	public FACompFixedAssetList() {
	}

	/** full constructor */
	public FACompFixedAssetList(String pid, String treeid, String parentid,
			Long isleaf, String fixedno, String fixedname) {
		this.pid = pid;
		this.treeid = treeid;
		this.parentid = parentid;
		this.isleaf = isleaf;
		this.fixedno = fixedno;
		this.fixedname = fixedname;
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

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getFixedno() {
		return this.fixedno;
	}

	public void setFixedno(String fixedno) {
		this.fixedno = fixedno;
	}

	public String getFixedname() {
		return this.fixedname;
	}

	public void setFixedname(String fixedname) {
		this.fixedname = fixedname;
	}

}