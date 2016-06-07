package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzCjhpb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCjhpb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bh;
	private String billState;
	private String userid;
	private String jhr;
	private String cgr;
	private Date rq;
	private String xz;
	private String wcf;
	private String cgdbh;
	private String lb;
	private String cgyy;
	private String cgmm;
	private String qrf;
	private Double jhje;
	private Double sjje;
	private String stage;

	// Constructors

	/** default constructor */
	public WzCjhpb() {
	}

	/** full constructor */
	public WzCjhpb(String pid, String bh, String billState, String userid,
			String jhr, String cgr, Date rq, String xz, String wcf,
			String cgdbh, String lb, String cgyy, String cgmm, String qrf,
			Double jhje, Double sjje, String stage) {
		this.pid = pid;
		this.bh = bh;
		this.billState = billState;
		this.userid = userid;
		this.jhr = jhr;
		this.cgr = cgr;
		this.rq = rq;
		this.xz = xz;
		this.wcf = wcf;
		this.cgdbh = cgdbh;
		this.lb = lb;
		this.cgyy = cgyy;
		this.cgmm = cgmm;
		this.qrf = qrf;
		this.jhje = jhje;
		this.sjje = sjje;
		this.stage = stage;
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

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getJhr() {
		return this.jhr;
	}

	public void setJhr(String jhr) {
		this.jhr = jhr;
	}

	public String getCgr() {
		return this.cgr;
	}

	public void setCgr(String cgr) {
		this.cgr = cgr;
	}

	public Date getRq() {
		return this.rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public String getXz() {
		return this.xz;
	}

	public void setXz(String xz) {
		this.xz = xz;
	}

	public String getWcf() {
		return this.wcf;
	}

	public void setWcf(String wcf) {
		this.wcf = wcf;
	}

	public String getCgdbh() {
		return this.cgdbh;
	}

	public void setCgdbh(String cgdbh) {
		this.cgdbh = cgdbh;
	}

	public String getLb() {
		return this.lb;
	}

	public void setLb(String lb) {
		this.lb = lb;
	}

	public String getCgyy() {
		return this.cgyy;
	}

	public void setCgyy(String cgyy) {
		this.cgyy = cgyy;
	}

	public String getCgmm() {
		return this.cgmm;
	}

	public void setCgmm(String cgmm) {
		this.cgmm = cgmm;
	}

	public String getQrf() {
		return this.qrf;
	}

	public void setQrf(String qrf) {
		this.qrf = qrf;
	}

	public Double getJhje() {
		return this.jhje;
	}

	public void setJhje(Double jhje) {
		this.jhje = jhje;
	}

	public Double getSjje() {
		return this.sjje;
	}

	public void setSjje(Double sjje) {
		this.sjje = sjje;
	}

	public String getStage() {
		return this.stage;
	}

	public void setStage(String stage) {
		this.stage = stage;
	}

}