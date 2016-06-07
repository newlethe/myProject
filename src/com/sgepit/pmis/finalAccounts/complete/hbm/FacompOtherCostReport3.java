package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompOtherCostReport3 entity. @author MyEclipse Persistence Tools
 */

public class FacompOtherCostReport3 implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String treeid;
	private String parentid;
	private Long isleaf;
	private String subjectName;
	private String subjectBm;
	private String remark;
	private Double bdgMoney;
	private Double deferredExpensesMoney;
	private Double fixedAssetsMoney;
	private Double currentAssetsMoney;
	private Double intangibleAssetsMoney;
	private Double longTermUnamortizedMoney;
	private Double realTotalMoney;

	// Constructors

	/** default constructor */
	public FacompOtherCostReport3() {
	}

	/** full constructor */
	public FacompOtherCostReport3(String pid, String treeid, String parentid,
			Long isleaf, String subjectName, String subjectBm,
			String remark, Double bdgMoney, Double deferredExpensesMoney,
			Double fixedAssetsMoney, Double currentAssetsMoney,
			Double intangibleAssetsMoney, Double longTermUnamortizedMoney,
			Double realTotalMoney) {
		this.pid = pid;
		this.treeid = treeid;
		this.parentid = parentid;
		this.isleaf = isleaf;
		this.subjectName = subjectName;
		this.subjectBm = subjectBm;
		this.remark = remark;
		this.bdgMoney = bdgMoney;
		this.deferredExpensesMoney = deferredExpensesMoney;
		this.fixedAssetsMoney = fixedAssetsMoney;
		this.currentAssetsMoney = currentAssetsMoney;
		this.intangibleAssetsMoney = intangibleAssetsMoney;
		this.longTermUnamortizedMoney = longTermUnamortizedMoney;
		this.realTotalMoney = realTotalMoney;
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

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getSubjectName() {
		return this.subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	public String getSubjectBm() {
		return this.subjectBm;
	}

	public void setSubjectBm(String subjectBm) {
		this.subjectBm = subjectBm;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Double getBdgMoney() {
		return this.bdgMoney;
	}

	public void setBdgMoney(Double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}

	public Double getDeferredExpensesMoney() {
		return this.deferredExpensesMoney;
	}

	public void setDeferredExpensesMoney(Double deferredExpensesMoney) {
		this.deferredExpensesMoney = deferredExpensesMoney;
	}

	public Double getFixedAssetsMoney() {
		return this.fixedAssetsMoney;
	}

	public void setFixedAssetsMoney(Double fixedAssetsMoney) {
		this.fixedAssetsMoney = fixedAssetsMoney;
	}

	public Double getCurrentAssetsMoney() {
		return this.currentAssetsMoney;
	}

	public void setCurrentAssetsMoney(Double currentAssetsMoney) {
		this.currentAssetsMoney = currentAssetsMoney;
	}

	public Double getIntangibleAssetsMoney() {
		return this.intangibleAssetsMoney;
	}

	public void setIntangibleAssetsMoney(Double intangibleAssetsMoney) {
		this.intangibleAssetsMoney = intangibleAssetsMoney;
	}

	public Double getLongTermUnamortizedMoney() {
		return this.longTermUnamortizedMoney;
	}

	public void setLongTermUnamortizedMoney(Double longTermUnamortizedMoney) {
		this.longTermUnamortizedMoney = longTermUnamortizedMoney;
	}

	public Double getRealTotalMoney() {
		return this.realTotalMoney;
	}

	public void setRealTotalMoney(Double realTotalMoney) {
		this.realTotalMoney = realTotalMoney;
	}

}