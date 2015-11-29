package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WztzWzrkView entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WztzWzrkView implements java.io.Serializable {

	// Fields
	private String uids;
	private String pid;
	private String bh;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Double dj;
	private Date rkrq;
	private String jsr;
	private Double rksl;
	private Double zj;
	private String billState;
	
	// Constructors

	/** default constructor */
	public WztzWzrkView() {
	}

	/** minimal constructor */
	public WztzWzrkView(String uids) {
		this.uids = uids;
	}

	
	/** full constructor */
	public WztzWzrkView(String pid, String bh, String bm, String pm, String gg,
			String dw, Double dj, Date rkrq, String jsr, Double rksl, Double zj,
			String billState) {
		this.pid = pid;
		this.bh = bh;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.dj = dj;
		this.rkrq = rkrq;
		this.jsr = jsr;
		this.rksl = rksl;
		this.zj = zj;
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

	public Date getRkrq() {
		return rkrq;
	}

	public void setRkrq(Date rkrq) {
		this.rkrq = rkrq;
	}

	public String getJsr() {
		return jsr;
	}

	public void setJsr(String jsr) {
		this.jsr = jsr;
	}

	public Double getRksl() {
		return rksl;
	}

	public void setRksl(Double rksl) {
		this.rksl = rksl;
	}

	public Double getZj() {
		return zj;
	}

	public void setZj(Double zj) {
		this.zj = zj;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}
}