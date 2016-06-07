package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafeEducationCard entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeEducationCard implements java.io.Serializable {

	// Fields

	private String bh;
	private String xm;
	private String bm;
	private String bz;
	private String sex;
	private String tjjg;
	private String jg;
	private String ygxs;
	private String gsJynr;
	private Date gsRq;
	private String gsKscj;
	private String gsAqfzr;
	private String bmJynr;
	private Date bmRq;
	private String bmKscj;
	private String bmAqfzr;
	private String bzJynr;
	private Date bzRq;
	private String bzKscj;
	private String bzFzr;
	private String comm;
	private String gcmc;
	private Date kssj;
	private Date wgsj;
	private String sgrs;

	// Constructors

	/** default constructor */
	public SafeEducationCard() {
	}

	/** minimal constructor */
	public SafeEducationCard(String bh) {
		this.bh = bh;
	}

	/** full constructor */
	public SafeEducationCard(String bh, String xm, String bm, String bz,
			String sex, String tjjg, String jg, String ygxs, String gsJynr,
			Date gsRq, String gsKscj, String gsAqfzr, String bmJynr, Date bmRq,
			String bmKscj, String bmAqfzr, String bzJynr, Date bzRq,
			String bzKscj, String bzFzr, String comm, String gcmc, Date kssj,
			Date wgsj, String sgrs) {
		this.bh = bh;
		this.xm = xm;
		this.bm = bm;
		this.bz = bz;
		this.sex = sex;
		this.tjjg = tjjg;
		this.jg = jg;
		this.ygxs = ygxs;
		this.gsJynr = gsJynr;
		this.gsRq = gsRq;
		this.gsKscj = gsKscj;
		this.gsAqfzr = gsAqfzr;
		this.bmJynr = bmJynr;
		this.bmRq = bmRq;
		this.bmKscj = bmKscj;
		this.bmAqfzr = bmAqfzr;
		this.bzJynr = bzJynr;
		this.bzRq = bzRq;
		this.bzKscj = bzKscj;
		this.bzFzr = bzFzr;
		this.comm = comm;
		this.gcmc = gcmc;
		this.kssj = kssj;
		this.wgsj = wgsj;
		this.sgrs = sgrs;
	}

	// Property accessors

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getXm() {
		return this.xm;
	}

	public void setXm(String xm) {
		this.xm = xm;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getTjjg() {
		return this.tjjg;
	}

	public void setTjjg(String tjjg) {
		this.tjjg = tjjg;
	}

	public String getJg() {
		return this.jg;
	}

	public void setJg(String jg) {
		this.jg = jg;
	}

	public String getYgxs() {
		return this.ygxs;
	}

	public void setYgxs(String ygxs) {
		this.ygxs = ygxs;
	}

	public String getGsJynr() {
		return this.gsJynr;
	}

	public void setGsJynr(String gsJynr) {
		this.gsJynr = gsJynr;
	}

	public Date getGsRq() {
		return this.gsRq;
	}

	public void setGsRq(Date gsRq) {
		this.gsRq = gsRq;
	}

	public String getGsKscj() {
		return this.gsKscj;
	}

	public void setGsKscj(String gsKscj) {
		this.gsKscj = gsKscj;
	}

	public String getGsAqfzr() {
		return this.gsAqfzr;
	}

	public void setGsAqfzr(String gsAqfzr) {
		this.gsAqfzr = gsAqfzr;
	}

	public String getBmJynr() {
		return this.bmJynr;
	}

	public void setBmJynr(String bmJynr) {
		this.bmJynr = bmJynr;
	}

	public Date getBmRq() {
		return this.bmRq;
	}

	public void setBmRq(Date bmRq) {
		this.bmRq = bmRq;
	}

	public String getBmKscj() {
		return this.bmKscj;
	}

	public void setBmKscj(String bmKscj) {
		this.bmKscj = bmKscj;
	}

	public String getBmAqfzr() {
		return this.bmAqfzr;
	}

	public void setBmAqfzr(String bmAqfzr) {
		this.bmAqfzr = bmAqfzr;
	}

	public String getBzJynr() {
		return this.bzJynr;
	}

	public void setBzJynr(String bzJynr) {
		this.bzJynr = bzJynr;
	}

	public Date getBzRq() {
		return this.bzRq;
	}

	public void setBzRq(Date bzRq) {
		this.bzRq = bzRq;
	}

	public String getBzKscj() {
		return this.bzKscj;
	}

	public void setBzKscj(String bzKscj) {
		this.bzKscj = bzKscj;
	}

	public String getBzFzr() {
		return this.bzFzr;
	}

	public void setBzFzr(String bzFzr) {
		this.bzFzr = bzFzr;
	}

	public String getComm() {
		return this.comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	public String getGcmc() {
		return this.gcmc;
	}

	public void setGcmc(String gcmc) {
		this.gcmc = gcmc;
	}

	public Date getKssj() {
		return this.kssj;
	}

	public void setKssj(Date kssj) {
		this.kssj = kssj;
	}

	public Date getWgsj() {
		return this.wgsj;
	}

	public void setWgsj(Date wgsj) {
		this.wgsj = wgsj;
	}

	public String getSgrs() {
		return this.sgrs;
	}

	public void setSgrs(String sgrs) {
		this.sgrs = sgrs;
	}

}