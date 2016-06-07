package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

/**
 * GczlJl entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlJl implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bh;
	private String jlsm;
	private String xmbh;
	private String bzxmbh;
	private String itype;
	private Date rq;
	private String sgdw;
	private String jsdw;
	private String zjz;
	private String lsh;
	private Long billState;
	private String filename;
	private Long zls;

	// Constructors

	/** default constructor */
	public GczlJl() {
	}

	/** minimal constructor */
	public GczlJl(String xmbh, String itype) {
		this.xmbh = xmbh;
		this.itype = itype;
	}

	/** full constructor */
	public GczlJl(String pid, String bh, String jlsm, String xmbh,
			String bzxmbh, String itype, Date rq, String sgdw, String jsdw,
			String zjz, String lsh, Long billState, String filename, Long zls) {
		this.pid = pid;
		this.bh = bh;
		this.jlsm = jlsm;
		this.xmbh = xmbh;
		this.bzxmbh = bzxmbh;
		this.itype = itype;
		this.rq = rq;
		this.sgdw = sgdw;
		this.jsdw = jsdw;
		this.zjz = zjz;
		this.lsh = lsh;
		this.billState = billState;
		this.filename = filename;
		this.zls = zls;
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

	public String getJlsm() {
		return this.jlsm;
	}

	public void setJlsm(String jlsm) {
		this.jlsm = jlsm;
	}

	public String getXmbh() {
		return this.xmbh;
	}

	public void setXmbh(String xmbh) {
		this.xmbh = xmbh;
	}

	public String getBzxmbh() {
		return this.bzxmbh;
	}

	public void setBzxmbh(String bzxmbh) {
		this.bzxmbh = bzxmbh;
	}

	public String getItype() {
		return this.itype;
	}

	public void setItype(String itype) {
		this.itype = itype;
	}

	public Date getRq() {
		return this.rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public String getSgdw() {
		return this.sgdw;
	}

	public void setSgdw(String sgdw) {
		this.sgdw = sgdw;
	}

	public String getJsdw() {
		return this.jsdw;
	}

	public void setJsdw(String jsdw) {
		this.jsdw = jsdw;
	}

	public String getZjz() {
		return this.zjz;
	}

	public void setZjz(String zjz) {
		this.zjz = zjz;
	}

	public String getLsh() {
		return this.lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
	}

	public Long getBillState() {
		return this.billState;
	}

	public void setBillState(Long billState) {
		this.billState = billState;
	}

	public String getFilename() {
		return this.filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public Long getZls() {
		return this.zls;
	}

	public void setZls(Long zls) {
		this.zls = zls;
	}

}