package com.sgepit.pmis.finalAccounts.complete.hbm;


/**
 * FacompOtherCostProjectView entity. @author MyEclipse Persistence Tools
 */

public class FacompOtherCostProjectView implements java.io.Serializable {

	// Fields

	private String proappid;
	private String conid;
	private String bdgid;
	private String prono;
	private String proname;
	private String pid;
	private String constructionUnit;
	private String financialAccount;
	private String uids;
	private String masterid;
	private Double investmentFinishMoney;
	private String remark;
	private Long ischeck;//treeGrid是否勾选上的标识
	// Constructors

	/** default constructor */
	public FacompOtherCostProjectView() {
	}

	/** full constructor */
	public FacompOtherCostProjectView(String conid, String bdgid, String prono,
			String proname, String pid, String constructionUnit,
			String financialAccount, String uids, String masterid,
			Double investmentFinishMoney, String remark) {
		this.conid = conid;
		this.bdgid = bdgid;
		this.prono = prono;
		this.proname = proname;
		this.pid = pid;
		this.constructionUnit = constructionUnit;
		this.financialAccount = financialAccount;
		this.uids = uids;
		this.masterid = masterid;
		this.investmentFinishMoney = investmentFinishMoney;
		this.remark = remark;
	}

	// Property accessors

	public String getProappid() {
		return this.proappid;
	}

	public void setProappid(String proappid) {
		this.proappid = proappid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getProno() {
		return this.prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

	public String getProname() {
		return this.proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}



	public String getConstructionUnit() {
		return this.constructionUnit;
	}

	public void setConstructionUnit(String constructionUnit) {
		this.constructionUnit = constructionUnit;
	}

	public String getFinancialAccount() {
		return this.financialAccount;
	}

	public void setFinancialAccount(String financialAccount) {
		this.financialAccount = financialAccount;
	}

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getMasterid() {
		return this.masterid;
	}

	public void setMasterid(String masterid) {
		this.masterid = masterid;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}


	public Double getInvestmentFinishMoney() {
		return investmentFinishMoney;
	}

	public void setInvestmentFinishMoney(Double investmentFinishMoney) {
		this.investmentFinishMoney = investmentFinishMoney;
	}

	public Long getIscheck() {
		return ischeck;
	}

	public void setIscheck(Long ischeck) {
		this.ischeck = ischeck;
	}

}