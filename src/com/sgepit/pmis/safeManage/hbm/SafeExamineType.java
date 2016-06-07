package com.sgepit.pmis.safeManage.hbm;

/**
 * SafeExamineType entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeExamineType implements java.io.Serializable {

	// Fields

	private String treeid;
	private String mc;
	private String indexid;
	private Long isleaf;
	private String parent;
	private String bm;

	// Constructors

	/** default constructor */
	public SafeExamineType() {
	}

	/** minimal constructor */
	public SafeExamineType(String treeid) {
		this.treeid = treeid;
	}

	/** full constructor */
	public SafeExamineType(String treeid, String mc, String indexid,
			Long isleaf, String parent) {
		this.treeid = treeid;
		this.mc = mc;
		this.indexid = indexid;
		this.isleaf = isleaf;
		this.parent = parent;
	}

	// Property accessors

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getMc() {
		return this.mc;
	}

	public void setMc(String mc) {
		this.mc = mc;
	}

	public String getIndexid() {
		return this.indexid;
	}

	public void setIndexid(String indexid) {
		this.indexid = indexid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getBm() {
		return bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

}