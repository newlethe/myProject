package com.sgepit.pmis.INFManage.hbm;

/**
 * TreeInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class TreeInfo implements java.io.Serializable {

	// Fields

	private String tid;//主键
	private String treename;//节点树中文名
	private String treeno;//节点树编号
	private String seq;//节点树排序
	private String parent;//父节点
	private Long isleaf;//是否子节点
	private String label;//分类

	// Constructors

	/** default constructor */
	public TreeInfo() {
	}

	/** full constructor */
	public TreeInfo(String treename, String treeno, String seq, String parent,
			Long isleaf, String label) {
		this.treename = treename;
		this.treeno = treeno;
		this.seq = seq;
		this.parent = parent;
		this.isleaf = isleaf;
		this.label = label;
	}

	// Property accessors

	public String getTid() {
		return this.tid;
	}

	public void setTid(String tid) {
		this.tid = tid;
	}

	public String getTreename() {
		return this.treename;
	}

	public void setTreename(String treename) {
		this.treename = treename;
	}

	public String getTreeno() {
		return this.treeno;
	}

	public void setTreeno(String treeno) {
		this.treeno = treeno;
	}

	public String getSeq() {
		return this.seq;
	}

	public void setSeq(String seq) {
		this.seq = seq;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getLabel() {
		return this.label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

}