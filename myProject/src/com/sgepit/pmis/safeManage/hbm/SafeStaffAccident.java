package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafeStaffAccident entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeStaffAccident implements java.io.Serializable {

	// Fields

	private String sgbh;
	private String bblb;
	private Date bbsjd;
	private String tbdw;
	private String bh;
	private String gcmcjgm;
	private Long gcsgpjzrs;
	private String dwfzr;
	private String ckfzr;
	private String zbr;
	private Date bcsj;

	// Constructors

	/** default constructor */
	public SafeStaffAccident() {
	}

	/** minimal constructor */
	public SafeStaffAccident(String sgbh) {
		this.sgbh = sgbh;
	}

	/** full constructor */
	public SafeStaffAccident(String sgbh, String bblb, Date bbsjd, String tbdw,
			String bh, String gcmcjgm, Long gcsgpjzrs, String dwfzr,
			String ckfzr, String zbr, Date bcsj) {
		this.sgbh = sgbh;
		this.bblb = bblb;
		this.bbsjd = bbsjd;
		this.tbdw = tbdw;
		this.bh = bh;
		this.gcmcjgm = gcmcjgm;
		this.gcsgpjzrs = gcsgpjzrs;
		this.dwfzr = dwfzr;
		this.ckfzr = ckfzr;
		this.zbr = zbr;
		this.bcsj = bcsj;
	}

	// Property accessors

	public String getSgbh() {
		return this.sgbh;
	}

	public void setSgbh(String sgbh) {
		this.sgbh = sgbh;
	}

	public String getBblb() {
		return this.bblb;
	}

	public void setBblb(String bblb) {
		this.bblb = bblb;
	}

	public Date getBbsjd() {
		return this.bbsjd;
	}

	public void setBbsjd(Date bbsjd) {
		this.bbsjd = bbsjd;
	}

	public String getTbdw() {
		return this.tbdw;
	}

	public void setTbdw(String tbdw) {
		this.tbdw = tbdw;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getGcmcjgm() {
		return this.gcmcjgm;
	}

	public void setGcmcjgm(String gcmcjgm) {
		this.gcmcjgm = gcmcjgm;
	}

	public Long getGcsgpjzrs() {
		return this.gcsgpjzrs;
	}

	public void setGcsgpjzrs(Long gcsgpjzrs) {
		this.gcsgpjzrs = gcsgpjzrs;
	}

	public String getDwfzr() {
		return this.dwfzr;
	}

	public void setDwfzr(String dwfzr) {
		this.dwfzr = dwfzr;
	}

	public String getCkfzr() {
		return this.ckfzr;
	}

	public void setCkfzr(String ckfzr) {
		this.ckfzr = ckfzr;
	}

	public String getZbr() {
		return this.zbr;
	}

	public void setZbr(String zbr) {
		this.zbr = zbr;
	}

	public Date getBcsj() {
		return this.bcsj;
	}

	public void setBcsj(Date bcsj) {
		this.bcsj = bcsj;
	}

}