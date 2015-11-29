package com.sgepit.pmis.document.hbm;

/**
 * DaTree entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class DaTree implements java.io.Serializable {

	// Fields

	private String treeid;//分类主键，uuid
	private String pid;//项目别
	private String mc;//分类名称
	private String bm;//分类编码
	private String indexid;//分类过滤条件
	private Long isleaf;//是否有子结点
	private String parent;//父节点id
	

	// Constructors

	/** default constructor */
	public DaTree() {
	}

	/** full constructor */
	public DaTree(String pid, String mc, String bm, String indexid,
			Long isleaf, String parent) {
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

}