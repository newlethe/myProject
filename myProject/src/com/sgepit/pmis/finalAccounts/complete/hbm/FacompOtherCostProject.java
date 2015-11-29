package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompOtherCostProject entity. @author MyEclipse Persistence Tools
 */

public class FacompOtherCostProject implements java.io.Serializable {

	// Fields

	private String uids;
	private String conid;
	private String pid;
	private String bdgid;
	private String treeid;
	private String proid;
	private String masterid;
	private Double investmentFinishMoney;
	private String remark;
	private Long ischeck;//treeGrid是否勾选上的标识

	// Constructors

	/** default constructor */
	public FacompOtherCostProject() {
	}

	/** full constructor */
	public FacompOtherCostProject(String conid, String pid, String bdgid,
			String treeid, String proid, String masterid,
			Double investmentFinishMoney, String remark) {
		this.conid = conid;
		this.pid = pid;
		this.bdgid = bdgid;
		this.treeid = treeid;
		this.proid = proid;
		this.masterid = masterid;
		this.investmentFinishMoney = investmentFinishMoney;
		this.remark = remark;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
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

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getProid() {
		return this.proid;
	}

	public void setProid(String proid) {
		this.proid = proid;
	}

	public String getMasterid() {
		return this.masterid;
	}

	public void setMasterid(String masterid) {
		this.masterid = masterid;
	}

	public Double getInvestmentFinishMoney() {
		return this.investmentFinishMoney;
	}

	public void setInvestmentFinishMoney(Double investmentFinishMoney) {
		this.investmentFinishMoney = investmentFinishMoney;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getIscheck() {
		return ischeck;
	}

	public void setIscheck(Long ischeck) {
		this.ischeck = ischeck;
	}

}