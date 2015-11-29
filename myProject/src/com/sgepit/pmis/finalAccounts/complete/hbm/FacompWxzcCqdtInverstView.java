package com.sgepit.pmis.finalAccounts.complete.hbm;


/**
 * FacompWxzcCqdtInverstView entity. @author MyEclipse Persistence Tools
 */

public class FacompWxzcCqdtInverstView implements java.io.Serializable {

	// Fields

	private String conid;
	private String pid;
	private String conno;
	private String conname;
	private Double conmoney;
	private Double convaluemoney;
	private Double investmentFinishMoney;

	// Constructors

	/** default constructor */
	public FacompWxzcCqdtInverstView() {
	}

	/** full constructor */
	public FacompWxzcCqdtInverstView(String pid, String conno,
			String conname, Double conmoney, Double convaluemoney,
			Double investmentFinishMoney) {
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.conmoney = conmoney;
		this.convaluemoney = convaluemoney;
		this.investmentFinishMoney = investmentFinishMoney;
	}

	// Property accessors

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}


	public String getConno() {
		return this.conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return this.conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public Double getConmoney() {
		return this.conmoney;
	}

	public void setConmoney(Double conmoney) {
		this.conmoney = conmoney;
	}

	public Double getConvaluemoney() {
		return this.convaluemoney;
	}

	public void setConvaluemoney(Double convaluemoney) {
		this.convaluemoney = convaluemoney;
	}

	public Double getInvestmentFinishMoney() {
		return this.investmentFinishMoney;
	}

	public void setInvestmentFinishMoney(Double investmentFinishMoney) {
		this.investmentFinishMoney = investmentFinishMoney;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}