package com.sgepit.pmis.finalAccounts.basicData.hbm;

import java.math.BigDecimal;

/**
 * FaAssetsCat entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FAAssetsSortHBM implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String assetsNo;
	private String parentId;
	private String assetsName;
	private String unit;
	private BigDecimal depreciationRate;
	private Long isleaf;
	private String remark;
	
	// Constructors

	/** default constructor */
	public FAAssetsSortHBM() {
	}

	/** minimal constructor */
	public FAAssetsSortHBM(String uids, String assetsNo, String parentId,
			String assetsName) {
		this.uids = uids;
		this.assetsNo = assetsNo;
		this.parentId = parentId;
		this.assetsName = assetsName;
	}

	/** full constructor */
	public FAAssetsSortHBM(String uids, String pid, String assetsNo, String parentId,
			String assetsName, String unit, BigDecimal depreciationRate,
			 Long isLeaf, String remark) {
		this.uids = uids;
		this.pid = pid;
		this.assetsNo = assetsNo;
		this.parentId = parentId;
		this.assetsName = assetsName;
		this.unit = unit;
		this.depreciationRate = depreciationRate;
		this.isleaf = isLeaf;
		this.remark = remark;
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

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}