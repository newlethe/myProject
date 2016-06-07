package com.sgepit.pmis.equipment.hbm;

/**
 * EquTypeTree entity. @author MyEclipse Persistence Tools
 */

public class EquTypeTree implements java.io.Serializable {

	// Fields

	private String uuid;
	private String parentid;
	private Long isleaf;
	private String treeid;
	private String treename;
	private String conid;
	private String memo;
	private String jzid;
	private String pid;

	// Constructors

	/** default constructor */
	public EquTypeTree() {
	}

	/** minimal constructor */
	public EquTypeTree(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public EquTypeTree(String parentid, Long isleaf, String treeid,
			String treename, String conid, String memo, String jzid, String pid) {
		this.parentid = parentid;
		this.isleaf = isleaf;
		this.treeid = treeid;
		this.treename = treename;
		this.conid = conid;
		this.memo = memo;
		this.jzid = jzid;
		this.pid = pid;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
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

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getTreename() {
		return this.treename;
	}

	public void setTreename(String treename) {
		this.treename = treename;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getJzid() {
		return this.jzid;
	}

	public void setJzid(String jzid) {
		this.jzid = jzid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
}