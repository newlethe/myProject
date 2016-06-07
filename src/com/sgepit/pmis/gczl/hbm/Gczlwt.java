package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

/**
 * Gczlwt entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class Gczlwt implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String xmbh;
	private String bh;
	private Date rq;
	private Date fssj;
	private String zcss;
	private String dd;
	private String yyfl;
	private String zrfl;
	private String sgdw;
	private Date rq1;
	private Date rq2;
	private String gcms;
	private String cljg;
	private String zgcs;
	private String bzxmbh;

	// Constructors

	/** default constructor */
	public Gczlwt() {
	}

	/** minimal constructor */
	public Gczlwt(String bzxmbh) {
		this.bzxmbh = bzxmbh;
	}

	/** full constructor */
	public Gczlwt(String pid, String xmbh, String bh, Date rq, Date fssj,
			String zcss, String dd, String yyfl, String zrfl, String sgdw,
			Date rq1, Date rq2, String gcms, String cljg, String zgcs,
			String bzxmbh) {
		this.pid = pid;
		this.xmbh = xmbh;
		this.bh = bh;
		this.rq = rq;
		this.fssj = fssj;
		this.zcss = zcss;
		this.dd = dd;
		this.yyfl = yyfl;
		this.zrfl = zrfl;
		this.sgdw = sgdw;
		this.rq1 = rq1;
		this.rq2 = rq2;
		this.gcms = gcms;
		this.cljg = cljg;
		this.zgcs = zgcs;
		this.bzxmbh = bzxmbh;
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

	public String getXmbh() {
		return this.xmbh;
	}

	public void setXmbh(String xmbh) {
		this.xmbh = xmbh;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public Date getRq() {
		return this.rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public Date getFssj() {
		return this.fssj;
	}

	public void setFssj(Date fssj) {
		this.fssj = fssj;
	}

	public String getZcss() {
		return this.zcss;
	}

	public void setZcss(String zcss) {
		this.zcss = zcss;
	}

	public String getDd() {
		return this.dd;
	}

	public void setDd(String dd) {
		this.dd = dd;
	}

	public String getYyfl() {
		return this.yyfl;
	}

	public void setYyfl(String yyfl) {
		this.yyfl = yyfl;
	}

	public String getZrfl() {
		return this.zrfl;
	}

	public void setZrfl(String zrfl) {
		this.zrfl = zrfl;
	}

	public String getSgdw() {
		return this.sgdw;
	}

	public void setSgdw(String sgdw) {
		this.sgdw = sgdw;
	}

	public Date getRq1() {
		return this.rq1;
	}

	public void setRq1(Date rq1) {
		this.rq1 = rq1;
	}

	public Date getRq2() {
		return this.rq2;
	}

	public void setRq2(Date rq2) {
		this.rq2 = rq2;
	}

	public String getGcms() {
		return this.gcms;
	}

	public void setGcms(String gcms) {
		this.gcms = gcms;
	}

	public String getCljg() {
		return this.cljg;
	}

	public void setCljg(String cljg) {
		this.cljg = cljg;
	}

	public String getZgcs() {
		return this.zgcs;
	}

	public void setZgcs(String zgcs) {
		this.zgcs = zgcs;
	}

	public String getBzxmbh() {
		return this.bzxmbh;
	}

	public void setBzxmbh(String bzxmbh) {
		this.bzxmbh = bzxmbh;
	}

}