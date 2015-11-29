package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafeBasicAccident entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeBasicAccident implements java.io.Serializable {

	// Fields

	private String sgbh;
	private String sgmc;
	private String sglb;
	private String sgyy;
	private Date sgrq;
	private Long zrrnl;
	private String zrrgz;
	private String zrrwhcd;
	private String nr;

	// Constructors

	/** default constructor */
	public SafeBasicAccident() {
	}

	/** minimal constructor */
	public SafeBasicAccident(String sgbh) {
		this.sgbh = sgbh;
	}

	/** full constructor */
	public SafeBasicAccident(String sgbh, String sgmc, String sglb,
			String sgyy, Date sgrq, Long zrrnl, String zrrgz, String zrrwhcd,
			String nr) {
		this.sgbh = sgbh;
		this.sgmc = sgmc;
		this.sglb = sglb;
		this.sgyy = sgyy;
		this.sgrq = sgrq;
		this.zrrnl = zrrnl;
		this.zrrgz = zrrgz;
		this.zrrwhcd = zrrwhcd;
		this.nr = nr;
	}

	// Property accessors

	public String getSgbh() {
		return this.sgbh;
	}

	public void setSgbh(String sgbh) {
		this.sgbh = sgbh;
	}

	public String getSgmc() {
		return this.sgmc;
	}

	public void setSgmc(String sgmc) {
		this.sgmc = sgmc;
	}

	public String getSglb() {
		return this.sglb;
	}

	public void setSglb(String sglb) {
		this.sglb = sglb;
	}

	public String getSgyy() {
		return this.sgyy;
	}

	public void setSgyy(String sgyy) {
		this.sgyy = sgyy;
	}

	public Date getSgrq() {
		return this.sgrq;
	}

	public void setSgrq(Date sgrq) {
		this.sgrq = sgrq;
	}

	public Long getZrrnl() {
		return this.zrrnl;
	}

	public void setZrrnl(Long zrrnl) {
		this.zrrnl = zrrnl;
	}

	public String getZrrgz() {
		return this.zrrgz;
	}

	public void setZrrgz(String zrrgz) {
		this.zrrgz = zrrgz;
	}

	public String getZrrwhcd() {
		return this.zrrwhcd;
	}

	public void setZrrwhcd(String zrrwhcd) {
		this.zrrwhcd = zrrwhcd;
	}

	public String getNr() {
		return this.nr;
	}

	public void setNr(String nr) {
		this.nr = nr;
	}

}