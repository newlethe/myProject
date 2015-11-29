package com.sgepit.pmis.finalAccounts.financialAudit.hbm;

import java.math.BigDecimal;

/**
 * FaAssetsViewId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FaAssetsView implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String assetsNo;
	private Double buildingAmount;
	private Double equAmount;
	private Double installAmount;
	private Double otherApportionAmount;
	private Double otherDirectAmount;
	private Double otherAmount;
	private Double amount;
	private String remark;
	private String assetsName;
	private Long isleaf;
	private String parentId;
	private BigDecimal depreciationRate;
	
	public FaAssetsView(){
		
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public FaAssetsView(String uids, String pid, String assetsNo,
			Double buildingAmount, Double equAmount, Double installAmount,
			Double otherApportionAmount, Double otherDirectAmount,
			Double otherAmount, Double amount, String remark, String assetsName, String parentId, Long isleaf, BigDecimal depreciationRate) {
		this.uids = uids;
		this.pid = pid;
		this.assetsNo = assetsNo;
		this.buildingAmount = buildingAmount;
		this.equAmount = equAmount;
		this.installAmount = installAmount;
		this.otherApportionAmount = otherApportionAmount;
		this.otherDirectAmount = otherDirectAmount;
		this.otherAmount = otherAmount;
		this.amount = amount;
		this.remark = remark;
		this.assetsName = assetsName;
		this.parentId = parentId;
		this.isleaf = isleaf;
		this.depreciationRate = depreciationRate;
	}
	public String getAssetsNo() {
		return assetsNo;
	}
	public void setAssetsNo(String assetsNo) {
		this.assetsNo = assetsNo;
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
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getAssetsName() {
		return assetsName;
	}
	public void setAssetsName(String assetsName) {
		this.assetsName = assetsName;
	}
	public Long getIsleaf() {
		return isleaf;
	}
	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public BigDecimal getDepreciationRate() {
		return depreciationRate;
	}
	public void setDepreciationRate(BigDecimal depreciationRate) {
		this.depreciationRate = depreciationRate;
	}



	// Constructors

	/** default constructor */
	
}