package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SevereAccidentRegister entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SevereAccidentRegister implements java.io.Serializable {

	// Fields

	private String bh;
	private String sgdw;
	private String sgbh;
	private Date sgsj;
	private String sgdd;
	private String dsr;
	private String fileLsh;
	private String zgcs;
	private String zgdw;
	private String fzr;
	private Date wgq;
	private String ajkyj;
	private String ldps;

	// Constructors

	/** default constructor */
	public SevereAccidentRegister() {
	}

	/** minimal constructor */
	public SevereAccidentRegister(String bh) {
		this.bh = bh;
	}

	/** full constructor */
	public SevereAccidentRegister(String bh, String sgdw, String sgbh,
			Date sgsj, String sgdd, String dsr, String fileLsh, String zgcs,
			String zgdw, String fzr, Date wgq, String ajkyj, String ldps) {
		this.bh = bh;
		this.sgdw = sgdw;
		this.sgbh = sgbh;
		this.sgsj = sgsj;
		this.sgdd = sgdd;
		this.dsr = dsr;
		this.fileLsh = fileLsh;
		this.zgcs = zgcs;
		this.zgdw = zgdw;
		this.fzr = fzr;
		this.wgq = wgq;
		this.ajkyj = ajkyj;
		this.ldps = ldps;
	}

	// Property accessors

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getSgdw() {
		return this.sgdw;
	}

	public void setSgdw(String sgdw) {
		this.sgdw = sgdw;
	}

	public String getSgbh() {
		return this.sgbh;
	}

	public void setSgbh(String sgbh) {
		this.sgbh = sgbh;
	}

	public Date getSgsj() {
		return this.sgsj;
	}

	public void setSgsj(Date sgsj) {
		this.sgsj = sgsj;
	}

	public String getSgdd() {
		return this.sgdd;
	}

	public void setSgdd(String sgdd) {
		this.sgdd = sgdd;
	}

	public String getDsr() {
		return this.dsr;
	}

	public void setDsr(String dsr) {
		this.dsr = dsr;
	}

	public String getFileLsh() {
		return this.fileLsh;
	}

	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}

	public String getZgcs() {
		return this.zgcs;
	}

	public void setZgcs(String zgcs) {
		this.zgcs = zgcs;
	}

	public String getZgdw() {
		return this.zgdw;
	}

	public void setZgdw(String zgdw) {
		this.zgdw = zgdw;
	}

	public String getFzr() {
		return this.fzr;
	}

	public void setFzr(String fzr) {
		this.fzr = fzr;
	}

	public Date getWgq() {
		return this.wgq;
	}

	public void setWgq(Date wgq) {
		this.wgq = wgq;
	}

	public String getAjkyj() {
		return this.ajkyj;
	}

	public void setAjkyj(String ajkyj) {
		this.ajkyj = ajkyj;
	}

	public String getLdps() {
		return this.ldps;
	}

	public void setLdps(String ldps) {
		this.ldps = ldps;
	}

}