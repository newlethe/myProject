package com.sgepit.pmis.routine.hbm;

/**
 * ZdTree entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ZdTree implements java.io.Serializable {

	// Fields

	private String treeid;
	private String pid;
	private String mc;
	private String bm;
	private String indexid;
	private Long isleaf;//是否有子结点
	private String parent;


	// Constructors

	/** default constructor */
	public ZdTree() {
	}

	/** minimal constructor */
	public ZdTree(String treeid) {
		this.treeid = treeid;
	}

	/** full constructor */
	public ZdTree(String treeid, String pid, String mc, String bm,
			String indexid, Long isleaf, String parent) {
		this.treeid = treeid;
		this.pid = pid;
		this.mc = mc;
		this.bm = bm;
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

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getMc() {
		return this.mc;
	}

	public void setMc(String mc) {
		this.mc = mc;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getIndexid() {
		return this.indexid;
	}

	public void setIndexid(String indexid) {
		this.indexid = indexid;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}



}