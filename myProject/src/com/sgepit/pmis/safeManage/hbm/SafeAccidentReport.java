package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafeAccidentReport entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeAccidentReport implements java.io.Serializable {

	// Fields

	private String bh;
	private String sgbh;
	private String xm;
	private String xb;
	private Long nl;
	private String zw;
	private String zb;
	private String gz;
	private Long gl;
	private String whcd;
	private Long bgzgl;
	private String shcd;
	private String zrhf;
	private String jyqk;
	private String jaqk;
	private String jawh;
	private Date jasj;
	private String sgclyj;
	private String tbdw;
	private String tbrxm;
	private Date tbrq;
	private String fileLsh;

	// Constructors

	/** default constructor */
	public SafeAccidentReport() {
	}

	/** minimal constructor */
	public SafeAccidentReport(String bh, String sgbh) {
		this.bh = bh;
		this.sgbh = sgbh;
	}

	/** full constructor */
	public SafeAccidentReport(String bh, String sgbh, String xm, String xb,
			Long nl, String zw, String zb, String gz, Long gl, String whcd,
			Long bgzgl, String shcd, String zrhf, String jyqk, String jaqk,
			String jawh, Date jasj, String sgclyj, String tbdw, String tbrxm,
			Date tbrq, String fileLsh) {
		this.bh = bh;
		this.sgbh = sgbh;
		this.xm = xm;
		this.xb = xb;
		this.nl = nl;
		this.zw = zw;
		this.zb = zb;
		this.gz = gz;
		this.gl = gl;
		this.whcd = whcd;
		this.bgzgl = bgzgl;
		this.shcd = shcd;
		this.zrhf = zrhf;
		this.jyqk = jyqk;
		this.jaqk = jaqk;
		this.jawh = jawh;
		this.jasj = jasj;
		this.sgclyj = sgclyj;
		this.tbdw = tbdw;
		this.tbrxm = tbrxm;
		this.tbrq = tbrq;
		this.fileLsh = fileLsh;
	}

	// Property accessors

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getSgbh() {
		return this.sgbh;
	}

	public void setSgbh(String sgbh) {
		this.sgbh = sgbh;
	}

	public String getXm() {
		return this.xm;
	}

	public void setXm(String xm) {
		this.xm = xm;
	}

	public String getXb() {
		return this.xb;
	}

	public void setXb(String xb) {
		this.xb = xb;
	}

	public Long getNl() {
		return this.nl;
	}

	public void setNl(Long nl) {
		this.nl = nl;
	}

	public String getZw() {
		return this.zw;
	}

	public void setZw(String zw) {
		this.zw = zw;
	}

	public String getZb() {
		return this.zb;
	}

	public void setZb(String zb) {
		this.zb = zb;
	}

	public String getGz() {
		return this.gz;
	}

	public void setGz(String gz) {
		this.gz = gz;
	}

	public Long getGl() {
		return this.gl;
	}

	public void setGl(Long gl) {
		this.gl = gl;
	}

	public String getWhcd() {
		return this.whcd;
	}

	public void setWhcd(String whcd) {
		this.whcd = whcd;
	}

	public Long getBgzgl() {
		return this.bgzgl;
	}

	public void setBgzgl(Long bgzgl) {
		this.bgzgl = bgzgl;
	}

	public String getShcd() {
		return this.shcd;
	}

	public void setShcd(String shcd) {
		this.shcd = shcd;
	}

	public String getZrhf() {
		return this.zrhf;
	}

	public void setZrhf(String zrhf) {
		this.zrhf = zrhf;
	}

	public String getJyqk() {
		return this.jyqk;
	}

	public void setJyqk(String jyqk) {
		this.jyqk = jyqk;
	}

	public String getJaqk() {
		return this.jaqk;
	}

	public void setJaqk(String jaqk) {
		this.jaqk = jaqk;
	}

	public String getJawh() {
		return this.jawh;
	}

	public void setJawh(String jawh) {
		this.jawh = jawh;
	}

	public Date getJasj() {
		return this.jasj;
	}

	public void setJasj(Date jasj) {
		this.jasj = jasj;
	}

	public String getSgclyj() {
		return this.sgclyj;
	}

	public void setSgclyj(String sgclyj) {
		this.sgclyj = sgclyj;
	}

	public String getTbdw() {
		return this.tbdw;
	}

	public void setTbdw(String tbdw) {
		this.tbdw = tbdw;
	}

	public String getTbrxm() {
		return this.tbrxm;
	}

	public void setTbrxm(String tbrxm) {
		this.tbrxm = tbrxm;
	}

	public Date getTbrq() {
		return this.tbrq;
	}

	public void setTbrq(Date tbrq) {
		this.tbrq = tbrq;
	}

	public String getFileLsh() {
		return this.fileLsh;
	}

	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}

}