package com.sgepit.pcmis.aqgk.hbm;

import java.util.Date;

/**
 * PcAqgkSafetyChange entity. @author MyEclipse Persistence Tools
 */

public class PcAqgkSafetyChange implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String addtype;
	private String bh;
	private String yhnr;
	private String yhms;
	private String yhxz;
	private String zgdw;
	private String lrr;
	private Date lrsj;
	private String zgr;
	private Date zgwcsj;
	private String zgsm;
	private String zgms;
	private String ysr;
	private Date yssj;
	private String ysqk;
	private String bz;

	// Constructors

	/** default constructor */
	public PcAqgkSafetyChange() {
	}

	/** minimal constructor */
	public PcAqgkSafetyChange(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcAqgkSafetyChange(String pid, String addtype, String bh,
			String yhnr, String yhms, String yhxz, String zgdw, String lrr,
			Date lrsj, String zgr, Date zgwcsj, String zgsm, String zgms,
			String ysr, Date yssj, String ysqk, String bz) {
		this.pid = pid;
		this.addtype = addtype;
		this.bh = bh;
		this.yhnr = yhnr;
		this.yhms = yhms;
		this.yhxz = yhxz;
		this.zgdw = zgdw;
		this.lrr = lrr;
		this.lrsj = lrsj;
		this.zgr = zgr;
		this.zgwcsj = zgwcsj;
		this.zgsm = zgsm;
		this.zgms = zgms;
		this.ysr = ysr;
		this.yssj = yssj;
		this.ysqk = ysqk;
		this.bz = bz;
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

	public String getAddtype() {
		return this.addtype;
	}

	public void setAddtype(String addtype) {
		this.addtype = addtype;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getYhnr() {
		return this.yhnr;
	}

	public void setYhnr(String yhnr) {
		this.yhnr = yhnr;
	}

	public String getYhms() {
		return this.yhms;
	}

	public void setYhms(String yhms) {
		this.yhms = yhms;
	}

	public String getYhxz() {
		return this.yhxz;
	}

	public void setYhxz(String yhxz) {
		this.yhxz = yhxz;
	}

	public String getZgdw() {
		return this.zgdw;
	}

	public void setZgdw(String zgdw) {
		this.zgdw = zgdw;
	}

	public String getLrr() {
		return this.lrr;
	}

	public void setLrr(String lrr) {
		this.lrr = lrr;
	}

	public Date getLrsj() {
		return this.lrsj;
	}

	public void setLrsj(Date lrsj) {
		this.lrsj = lrsj;
	}

	public String getZgr() {
		return this.zgr;
	}

	public void setZgr(String zgr) {
		this.zgr = zgr;
	}

	public Date getZgwcsj() {
		return this.zgwcsj;
	}

	public void setZgwcsj(Date zgwcsj) {
		this.zgwcsj = zgwcsj;
	}

	public String getZgsm() {
		return this.zgsm;
	}

	public void setZgsm(String zgsm) {
		this.zgsm = zgsm;
	}

	public String getZgms() {
		return this.zgms;
	}

	public void setZgms(String zgms) {
		this.zgms = zgms;
	}

	public String getYsr() {
		return this.ysr;
	}

	public void setYsr(String ysr) {
		this.ysr = ysr;
	}

	public Date getYssj() {
		return this.yssj;
	}

	public void setYssj(Date yssj) {
		this.yssj = yssj;
	}

	public String getYsqk() {
		return this.ysqk;
	}

	public void setYsqk(String ysqk) {
		this.ysqk = ysqk;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

}