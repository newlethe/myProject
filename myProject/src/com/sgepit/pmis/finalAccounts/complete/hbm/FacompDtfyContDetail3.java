package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompDtfyContDetail3 entity. @author MyEclipse Persistence Tools
 */

public class FacompDtfyContDetail3 implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bdgid;
	private String financialAccount;
	private Double amount;

	// Constructors

	/** default constructor */
	public FacompDtfyContDetail3() {
	}

	/** full constructor */
	public FacompDtfyContDetail3(String pid, String bdgid,
			String financialAccount,Double amount) {
		this.pid = pid;
		this.bdgid = bdgid;
		this.financialAccount = financialAccount;
		this.amount = amount;
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

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getFinancialAccount() {
		return this.financialAccount;
	}

	public void setFinancialAccount(String financialAccount) {
		this.financialAccount = financialAccount;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

}