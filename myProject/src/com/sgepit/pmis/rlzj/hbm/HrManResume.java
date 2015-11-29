package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrManResume entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManResume implements java.io.Serializable {

	// Fields

	private String seqnum;
	private String personnum;
	private String lx;
	private Date kssj;
	private Date jssj;
	private String dw;
	private String csgz;
	private String drzw;
	private String zmr;
	private String bz;
	private String istop;

	// Constructors

	/** default constructor */
	public HrManResume() {
	}

	/** minimal constructor */
	public HrManResume(String seqnum, String personnum, String lx, Date kssj,
			Date jssj) {
		this.seqnum = seqnum;
		this.personnum = personnum;
		this.lx = lx;
		this.kssj = kssj;
		this.jssj = jssj;
	}

	/** full constructor */
	public HrManResume(String seqnum, String personnum, String lx, Date kssj,
			Date jssj, String dw, String csgz, String drzw, String zmr,
			String bz, String istop) {
		this.seqnum = seqnum;
		this.personnum = personnum;
		this.lx = lx;
		this.kssj = kssj;
		this.jssj = jssj;
		this.dw = dw;
		this.csgz = csgz;
		this.drzw = drzw;
		this.zmr = zmr;
		this.bz = bz;
		this.istop = istop;
	}

	// Property accessors

	public String getSeqnum() {
		return this.seqnum;
	}

	public void setSeqnum(String seqnum) {
		this.seqnum = seqnum;
	}

	public String getPersonnum() {
		return this.personnum;
	}

	public void setPersonnum(String personnum) {
		this.personnum = personnum;
	}

	public String getLx() {
		return this.lx;
	}

	public void setLx(String lx) {
		this.lx = lx;
	}

	public Date getKssj() {
		return this.kssj;
	}

	public void setKssj(Date kssj) {
		this.kssj = kssj;
	}

	public Date getJssj() {
		return this.jssj;
	}

	public void setJssj(Date jssj) {
		this.jssj = jssj;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public String getCsgz() {
		return this.csgz;
	}

	public void setCsgz(String csgz) {
		this.csgz = csgz;
	}

	public String getDrzw() {
		return this.drzw;
	}

	public void setDrzw(String drzw) {
		this.drzw = drzw;
	}

	public String getZmr() {
		return this.zmr;
	}

	public void setZmr(String zmr) {
		this.zmr = zmr;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getIstop() {
		return this.istop;
	}

	public void setIstop(String istop) {
		this.istop = istop;
	}

}