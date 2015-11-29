package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzCjhxb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCjhxb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bh;
	private String lsh;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Date xqrq;
	private Double dj;
	private Double hzsl;
	private Double de;
	private Double ge;
	private Double kcsl;
	private String xz;
	private String cgr;
	private String jhr;
	private String xjdbh;
	private Double sjdj;
	private String csdm;
	private Double ygsl;
	private Double dhsl;
	private Date yjdhrq;
	private Date dhrq;
	private String ccgbh;
	private String rkdbh;
	private String hth;
	private String bz;
	private String isComplete;
	private String sqr;
	private Double taxRate;
	
	private String sqjhbh;
	private String sqjhhzbh;
	private String hzState;
	//TAX_RATE

	// Constructors

	/** default constructor */
	public WzCjhxb() {
	}

	/** full constructor */
	public WzCjhxb(String pid, String bh, String lsh, String bm, String pm,
			String gg, String dw, Date xqrq, Double dj, Double hzsl, Double de,
			Double ge, Double kcsl, String xz, String cgr, String jhr,
			String xjdbh, Double sjdj, String csdm, Double ygsl, Double dhsl,
			Date yjdhrq, Date dhrq, String ccgbh, String rkdbh, String hth,
			String bz, String isComplete, String sqr,
			String sqjhbh, String sqjhhzbh, String hzState) {
		this.pid = pid;
		this.bh = bh;
		this.lsh = lsh;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.xqrq = xqrq;
		this.dj = dj;
		this.hzsl = hzsl;
		this.de = de;
		this.ge = ge;
		this.kcsl = kcsl;
		this.xz = xz;
		this.cgr = cgr;
		this.jhr = jhr;
		this.xjdbh = xjdbh;
		this.sjdj = sjdj;
		this.csdm = csdm;
		this.ygsl = ygsl;
		this.dhsl = dhsl;
		this.yjdhrq = yjdhrq;
		this.dhrq = dhrq;
		this.ccgbh = ccgbh;
		this.rkdbh = rkdbh;
		this.hth = hth;
		this.bz = bz;
		this.isComplete = isComplete;
		this.sqr = sqr;
		this.sqjhbh = sqjhbh;
		this.sqjhhzbh = sqjhhzbh;
		this.hzState = hzState;
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

	public String getLsh() {
		return this.lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getPm() {
		return this.pm;
	}

	public void setPm(String pm) {
		this.pm = pm;
	}

	public String getGg() {
		return this.gg;
	}

	public void setGg(String gg) {
		this.gg = gg;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Date getXqrq() {
		return this.xqrq;
	}

	public void setXqrq(Date xqrq) {
		this.xqrq = xqrq;
	}

	public Double getDj() {
		return this.dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
	}

	public Double getHzsl() {
		return this.hzsl;
	}

	public void setHzsl(Double hzsl) {
		this.hzsl = hzsl;
	}

	public Double getDe() {
		return this.de;
	}

	public void setDe(Double de) {
		this.de = de;
	}

	public Double getGe() {
		return this.ge;
	}

	public void setGe(Double ge) {
		this.ge = ge;
	}

	public Double getKcsl() {
		return this.kcsl;
	}

	public void setKcsl(Double kcsl) {
		this.kcsl = kcsl;
	}

	public String getXz() {
		return this.xz;
	}

	public void setXz(String xz) {
		this.xz = xz;
	}

	public String getCgr() {
		return this.cgr;
	}

	public void setCgr(String cgr) {
		this.cgr = cgr;
	}

	public String getJhr() {
		return this.jhr;
	}

	public void setJhr(String jhr) {
		this.jhr = jhr;
	}

	public String getXjdbh() {
		return this.xjdbh;
	}

	public void setXjdbh(String xjdbh) {
		this.xjdbh = xjdbh;
	}

	public Double getSjdj() {
		return this.sjdj;
	}

	public void setSjdj(Double sjdj) {
		this.sjdj = sjdj;
	}

	public String getCsdm() {
		return this.csdm;
	}

	public void setCsdm(String csdm) {
		this.csdm = csdm;
	}

	public Double getYgsl() {
		return this.ygsl;
	}

	public void setYgsl(Double ygsl) {
		this.ygsl = ygsl;
	}

	public Double getDhsl() {
		return this.dhsl;
	}

	public void setDhsl(Double dhsl) {
		this.dhsl = dhsl;
	}

	public Date getYjdhrq() {
		return this.yjdhrq;
	}

	public void setYjdhrq(Date yjdhrq) {
		this.yjdhrq = yjdhrq;
	}

	public Date getDhrq() {
		return this.dhrq;
	}

	public void setDhrq(Date dhrq) {
		this.dhrq = dhrq;
	}

	public String getCcgbh() {
		return this.ccgbh;
	}

	public void setCcgbh(String ccgbh) {
		this.ccgbh = ccgbh;
	}

	public String getRkdbh() {
		return this.rkdbh;
	}

	public void setRkdbh(String rkdbh) {
		this.rkdbh = rkdbh;
	}

	public String getHth() {
		return this.hth;
	}

	public void setHth(String hth) {
		this.hth = hth;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getIsComplete() {
		return this.isComplete;
	}

	public void setIsComplete(String isComplete) {
		this.isComplete = isComplete;
	}

	public String getSqr() {
		return this.sqr;
	}

	public void setSqr(String sqr) {
		this.sqr = sqr;
	}

	public Double getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(Double taxRate) {
		this.taxRate = taxRate;
	}

	public String getSqjhbh() {
		return sqjhbh;
	}

	public void setSqjhbh(String sqjhbh) {
		this.sqjhbh = sqjhbh;
	}

	public String getSqjhhzbh() {
		return sqjhhzbh;
	}

	public void setSqjhhzbh(String sqjhhzbh) {
		this.sqjhhzbh = sqjhhzbh;
	}

	public String getHzState() {
		return hzState;
	}

	public void setHzState(String hzState) {
		this.hzState = hzState;
	}

}