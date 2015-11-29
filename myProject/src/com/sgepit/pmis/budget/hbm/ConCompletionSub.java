package com.sgepit.pmis.budget.hbm;

/**
 * ConCompletionSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConCompletionSub implements java.io.Serializable {

	// Fields

	private String concomsubid;
	private String concomid;
	private String bdgid;
	private String bdgname;
	private Double bdgmoney;
	private Double totalmoney;
	private Double totalpercent;
	private Double currentmoney;

	// Constructors

	/** default constructor */
	public ConCompletionSub() {
	}

	/** minimal constructor */
	public ConCompletionSub(String concomid, String bdgid) {
		this.concomid = concomid;
		this.bdgid = bdgid;
	}

	/** full constructor */
	public ConCompletionSub(String concomid, String bdgid, String bdgname,
			Double bdgmoney, Double totalmoney, Double totalpercent,
			Double currentmoney) {
		this.concomid = concomid;
		this.bdgid = bdgid;
		this.bdgname = bdgname;
		this.bdgmoney = bdgmoney;
		this.totalmoney = totalmoney;
		this.totalpercent = totalpercent;
		this.currentmoney = currentmoney;
	}

	// Property accessors

	public String getConcomsubid() {
		return this.concomsubid;
	}

	public void setConcomsubid(String concomsubid) {
		this.concomsubid = concomsubid;
	}

	public String getConcomid() {
		return this.concomid;
	}

	public void setConcomid(String concomid) {
		this.concomid = concomid;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgname() {
		return this.bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public Double getBdgmoney() {
		return this.bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public Double getTotalmoney() {
		return this.totalmoney;
	}

	public void setTotalmoney(Double totalmoney) {
		this.totalmoney = totalmoney;
	}

	public Double getTotalpercent() {
		return this.totalpercent;
	}

	public void setTotalpercent(Double totalpercent) {
		this.totalpercent = totalpercent;
	}

	public Double getCurrentmoney() {
		return this.currentmoney;
	}

	public void setCurrentmoney(Double currentmoney) {
		this.currentmoney = currentmoney;
	}

}