package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WztzCgjhView entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WztzCgjhView implements java.io.Serializable {

	// Fields
	private String uids;
	private String pid;
	private String bh;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Double dj;
	private Date rq;
	private String jhr;
	private Double kykc;
	private Double zj;
	private Double cgsl;
	private String billState;
	
	// Constructors

	/** default constructor */
	public WztzCgjhView() {
	}

	/** minimal constructor */
	public WztzCgjhView(String uids) {
		this.uids = uids;
	}

	
	/** full constructor */
	public WztzCgjhView(String pid, String bh, String bm, String pm, String gg,
			String dw, Double dj, Date rq, String jhr, Double kykc, Double zj,
			Double cgsl, String billState) {
		super();
		this.pid = pid;
		this.bh = bh;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.dj = dj;
		this.rq = rq;
		this.jhr = jhr;
		this.kykc = kykc;
		this.zj = zj;
		this.cgsl = cgsl;
		this.billState = billState;
	}

	// Property accessors
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBh() {
		return bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getBm() {
		return bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getPm() {
		return pm;
	}

	public void setPm(String pm) {
		this.pm = pm;
	}

	public String getGg() {
		return gg;
	}

	public void setGg(String gg) {
		this.gg = gg;
	}

	public String getDw() {
		return dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getDj() {
		return dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
	}

	public Date getRq() {
		return rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public String getJhr() {
		return jhr;
	}

	public void setJhr(String jhr) {
		this.jhr = jhr;
	}

	public Double getKykc() {
		return kykc;
	}

	public void setKykc(Double kykc) {
		this.kykc = kykc;
	}

	public Double getZj() {
		return zj;
	}

	public void setZj(Double zj) {
		this.zj = zj;
	}

	public Double getCgsl() {
		return cgsl;
	}

	public void setCgsl(Double cgsl) {
		this.cgsl = cgsl;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}
	
}