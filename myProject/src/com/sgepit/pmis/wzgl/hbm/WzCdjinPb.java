package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzCdjinPb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCdjinPb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bh;
	private String hth;
	private String cgbh;
	private String ghdw;
	private Date rq;
	private Double yzf;
	private Double zj;
	private Date dhrq;
	private String fph;
	private Double sv;
	private String cgr;
	private String ysr;
	private String bgr;
	private String jhr;
	private String bz;
	private String billState;
	private String billType;

	// Constructors

	/** default constructor */
	public WzCdjinPb() {
	}

	/** minimal constructor */
	public WzCdjinPb(String bh) {
		this.bh = bh;
	}

	/** full constructor */
	public WzCdjinPb(String pid, String bh, String hth, String cgbh,
			String ghdw, Date rq, Double yzf, Double zj, Date dhrq, String fph,
			Double sv, String cgr, String ysr, String bgr, String jhr,
			String bz, String billState, String billType) {
		this.pid = pid;
		this.bh = bh;
		this.hth = hth;
		this.cgbh = cgbh;
		this.ghdw = ghdw;
		this.rq = rq;
		this.yzf = yzf;
		this.zj = zj;
		this.dhrq = dhrq;
		this.fph = fph;
		this.sv = sv;
		this.cgr = cgr;
		this.ysr = ysr;
		this.bgr = bgr;
		this.jhr = jhr;
		this.bz = bz;
		this.billState = billState;
		this.billType = billType;
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

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getHth() {
		return this.hth;
	}

	public void setHth(String hth) {
		this.hth = hth;
	}

	public String getCgbh() {
		return this.cgbh;
	}

	public void setCgbh(String cgbh) {
		this.cgbh = cgbh;
	}

	public String getGhdw() {
		return this.ghdw;
	}

	public void setGhdw(String ghdw) {
		this.ghdw = ghdw;
	}

	public Date getRq() {
		return this.rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public Double getYzf() {
		return this.yzf;
	}

	public void setYzf(Double yzf) {
		this.yzf = yzf;
	}

	public Double getZj() {
		return this.zj;
	}

	public void setZj(Double zj) {
		this.zj = zj;
	}

	public Date getDhrq() {
		return this.dhrq;
	}

	public void setDhrq(Date dhrq) {
		this.dhrq = dhrq;
	}

	public String getFph() {
		return this.fph;
	}

	public void setFph(String fph) {
		this.fph = fph;
	}

	public Double getSv() {
		return this.sv;
	}

	public void setSv(Double sv) {
		this.sv = sv;
	}

	public String getCgr() {
		return this.cgr;
	}

	public void setCgr(String cgr) {
		this.cgr = cgr;
	}

	public String getYsr() {
		return this.ysr;
	}

	public void setYsr(String ysr) {
		this.ysr = ysr;
	}

	public String getBgr() {
		return this.bgr;
	}

	public void setBgr(String bgr) {
		this.bgr = bgr;
	}

	public String getJhr() {
		return this.jhr;
	}

	public void setJhr(String jhr) {
		this.jhr = jhr;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getBillType() {
		return this.billType;
	}

	public void setBillType(String billType) {
		this.billType = billType;
	}

}