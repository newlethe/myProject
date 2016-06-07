package com.sgepit.pmis.wzgl.hbm;

/**
 * WzCkclb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCkclb implements java.io.Serializable {

	// Fields

	private String uids;
	private String bm;
	private String pm;
	private Long lvl;
	private String isleaf;
	private String parent;
	
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
	public WzCkclb() {
	}

	/** minimal constructor */
	public WzCkclb(String id) {
		this.bm = id;
	}

	/** full constructor */
	public WzCkclb(String bm, String pm, Long lvl, String leaf, String parentbm) {
		this.bm = bm;
		this.pm = pm;
		this.lvl = lvl;
		this.isleaf = leaf;
		this.parent = parentbm;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}



	public String getBm() {
		return bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getPm() {
		return this.pm;
	}

	public void setPm(String pm) {
		this.pm = pm;
	}

	public Long getLvl() {
		return this.lvl;
	}

	public void setLvl(Long lvl) {
		this.lvl = lvl;
	}

	public String getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(String isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}


}