package com.sgepit.pmis.contract.hbm;

import java.util.Date;

/**
 * ConCla entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConCla implements java.io.Serializable {

	// Fields

	private String claid;
	private String pid;
	private String clano;
	private String clatext;
	private String clawork;
	private Double clamoney;
	private String clatype;
	private String filelsh;
	private String conid;
	private Date cladate;
	private long billstate;
	//extend
	private Double claappmoney;
	// Constructors

	public ConCla(String claid, String pid, String clano, String clatext,
			String clawork, Double clamoney, String clatype, String filelsh,
			String conid, Date cladate, long billstate) {
		super();
		this.claid = claid;
		this.pid = pid;
		this.clano = clano;
		this.clatext = clatext;
		this.clawork = clawork;
		this.clamoney = clamoney;
		this.clatype = clatype;
		this.filelsh = filelsh;
		this.conid = conid;
		this.cladate = cladate;
		this.billstate = billstate;
	}

	/** default constructor */
	public ConCla() {
	}

	/** minimal constructor */
	public ConCla(String claid, String pid, String conid) {
		this.claid = claid;
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */

	// Property accessors

	public String getClaid() {
		return this.claid;
	}

	public void setClaid(String claid) {
		this.claid = claid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getClano() {
		return this.clano;
	}

	public void setClano(String clano) {
		this.clano = clano;
	}

	public String getClatext() {
		return this.clatext;
	}

	public void setClatext(String clatext) {
		this.clatext = clatext;
	}

	public String getClawork() {
		return this.clawork;
	}

	public void setClawork(String clawork) {
		this.clawork = clawork;
	}

	public Double getClamoney() {
		return this.clamoney;
	}

	public void setClamoney(Double clamoney) {
		this.clamoney = clamoney;
	}

	public String getClatype() {
		return this.clatype;
	}

	public void setClatype(String clatype) {
		this.clatype = clatype;
	}

	public String getFilelsh() {
		return this.filelsh;
	}

	public void setFilelsh(String filelsh) {
		this.filelsh = filelsh;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Date getCladate() {
		return cladate;
	}

	public void setCladate(Date cladate) {
		this.cladate = cladate;
	}

	public long getBillstate() {
		return billstate;
	}

	public void setBillstate(long billstate) {
		this.billstate = billstate;
	}

	public Double getClaappmoney() {
		return claappmoney;
	}

	public void setClaappmoney(Double claappmoney) {
		this.claappmoney = claappmoney;
	}
}