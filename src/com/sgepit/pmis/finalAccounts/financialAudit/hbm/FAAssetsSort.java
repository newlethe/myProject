package com.sgepit.pmis.finalAccounts.financialAudit.hbm;

import java.math.BigDecimal;

/**
 * FaAssetsCat entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FAAssetsSort implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String assetsNo;
	private String parentId;
	private String assetsName;
	private String unit;
	private BigDecimal depreciationRate;
	private Boolean isleaf;
	private String remark;
	private Double buildingAmount;
	private Double equAmount;
	private Double installAmount;
	private Double otherApportionAmount;
	private Double otherDirectAmount;
	private Double otherAmount;
	private Double amount;
	
	// Constructors

	/** default constructor */
	public FAAssetsSort() {
	}

	/** minimal constructor */
	public FAAssetsSort(String uids, String assetsNo, String parentId,
			String assetsName) {
		this.uids = uids;
		this.assetsNo = assetsNo;
		this.parentId = parentId;
		this.assetsName = assetsName;
	}

	/** full constructor */
	public FAAssetsSort(String uids, String pid, String assetsNo, String parentId,
			String assetsName, String unit, BigDecimal depreciationRate,
			 Boolean isLeaf, String remark, Double buildingAmount, Double equAmount,Double installAmount, Double otherApportionAmount,
			 Double otherDirectAmount,  Double otherAmount, Double amount) {
		this.uids = uids;
		this.pid = pid;
		this.assetsNo = assetsNo;
		this.parentId = parentId;
		this.assetsName = assetsName;
		this.unit = unit;
		this.depreciationRate = depreciationRate;
		this.isleaf = isLeaf;
		this.remark = remark;
		this.equAmount = equAmount;
		this.otherAmount = otherAmount;
		this.otherApportionAmount = otherApportionAmount;
		this.otherDirectAmount = otherDirectAmount;
		this.amount = amount;
		this.installAmount = installAmount;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getAssetsNo() {
		return this.assetsNo;
	}

	public void setAssetsNo(String assetsNo) {
		this.assetsNo = assetsNo;
	}

	public String getParentId() {
		return this.parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getAssetsName() {
		return this.assetsName;
	}

	public void setAssetsName(String assetsName) {
		this.assetsName = assetsName;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public BigDecimal getDepreciationRate() {
		return this.depreciationRate;
	}

	public void setDepreciationRate(BigDecimal depreciationRate) {
		this.depreciationRate = depreciationRate;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Boolean getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Boolean isleaf) {
		this.isleaf = isleaf;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Double getBuildingAmount() {
		return buildingAmount;
	}

	public void setBuildingAmount(Double buildingAmount) {
		this.buildingAmount = buildingAmount;
	}

	public Double getEquAmount() {
		return equAmount;
	}

	public void setEquAmount(Double equAmount) {
		this.equAmount = equAmount;
	}

	public Double getInstallAmount() {
		return installAmount;
	}

	public void setInstallAmount(Double installAmount) {
		this.installAmount = installAmount;
	}

	public Double getOtherApportionAmount() {
		return otherApportionAmount;
	}

	public void setOtherApportionAmount(Double otherApportionAmount) {
		this.otherApportionAmount = otherApportionAmount;
	}

	public Double getOtherDirectAmount() {
		return otherDirectAmount;
	}

	public void setOtherDirectAmount(Double otherDirectAmount) {
		this.otherDirectAmount = otherDirectAmount;
	}

	public Double getOtherAmount() {
		return otherAmount;
	}

	public void setOtherAmount(Double otherAmount) {
		this.otherAmount = otherAmount;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

}