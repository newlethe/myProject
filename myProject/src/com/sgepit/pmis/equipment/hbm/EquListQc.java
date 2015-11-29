package com.sgepit.pmis.equipment.hbm;

/**
 * EquListQc entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquListQc implements java.io.Serializable {

	// Fields

	private String sbid;
	private String parent;
	private Long isleaf;
	private String kks;
	private String sbMc;
	private String sx;
	private String ggxh;
	private String dw;
	private Double jhsl;
	private String sccj;
	private String memo;
	private String jzh;
	
	private String pid;
	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public EquListQc() {
	}

	/** minimal constructor */
	public EquListQc(String sbid) {
		this.sbid = sbid;
	}

	/** full constructor */
	public EquListQc(String sbid, String parent, Long isleaf, String kks,
			String sbMc, String sx, String ggxh, String dw, Double jhsl,
			String sccj, String memo, String jzh) {
		this.sbid = sbid;
		this.parent = parent;
		this.isleaf = isleaf;
		this.kks = kks;
		this.sbMc = sbMc;
		this.sx = sx;
		this.ggxh = ggxh;
		this.dw = dw;
		this.jhsl = jhsl;
		this.sccj = sccj;
		this.memo = memo;
		this.jzh = jzh;
	}

	// Property accessors

	public String getSbid() {
		return this.sbid;
	}

	public void setSbid(String sbid) {
		this.sbid = sbid;
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

	public String getKks() {
		return this.kks;
	}

	public void setKks(String kks) {
		this.kks = kks;
	}

	public String getSbMc() {
		return this.sbMc;
	}

	public void setSbMc(String sbMc) {
		this.sbMc = sbMc;
	}

	public String getSx() {
		return this.sx;
	}

	public void setSx(String sx) {
		this.sx = sx;
	}

	public String getGgxh() {
		return this.ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getJhsl() {
		return this.jhsl;
	}

	public void setJhsl(Double jhsl) {
		this.jhsl = jhsl;
	}

	public String getSccj() {
		return this.sccj;
	}

	public void setSccj(String sccj) {
		this.sccj = sccj;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getJzh() {
		return jzh;
	}

	public void setJzh(String jzh) {
		this.jzh = jzh;
	}

}