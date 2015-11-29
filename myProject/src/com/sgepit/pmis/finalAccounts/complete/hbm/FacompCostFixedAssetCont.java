package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompCostFixedAssetCont entity. @author MyEclipse Persistence Tools
 */

public class FacompCostFixedAssetCont implements java.io.Serializable {

	// Fields

	private String uids;
	private String masterid;
	private String treeid;
	private String fixedno;
	private String fixedname;
	private Double costValue1;
	private Double costValue2;
	private Double costValue3;
	private String remark;
	private String parentid;
	private Long isleaf;
	private String pid;

	// Constructors

	/** default constructor */
	public FacompCostFixedAssetCont() {
	}

	/** full constructor */
	public FacompCostFixedAssetCont(String masterid, String treeid,String parentid,
			Long isleaf,
			String fixedno, String fixedname, Double costValue1,
			Double costValue2, Double costValue3, String remark,String pid) {
		this.masterid = masterid;
		this.treeid = treeid;
		this.fixedno = fixedno;
		this.fixedname = fixedname;
		this.costValue1 = costValue1;
		this.costValue2 = costValue2;
		this.costValue3 = costValue3;
		this.remark = remark;
		this.parentid = parentid;
		this.isleaf = isleaf;
		this.pid = pid;
	}

	// Property accessors

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

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getFixedno() {
		return this.fixedno;
	}

	public void setFixedno(String fixedno) {
		this.fixedno = fixedno;
	}

	public String getFixedname() {
		return this.fixedname;
	}

	public void setFixedname(String fixedname) {
		this.fixedname = fixedname;
	}

	public Double getCostValue1() {
		return this.costValue1;
	}

	public void setCostValue1(Double costValue1) {
		this.costValue1 = costValue1;
	}

	public Double getCostValue2() {
		return this.costValue2;
	}

	public void setCostValue2(Double costValue2) {
		this.costValue2 = costValue2;
	}

	public Double getCostValue3() {
		return this.costValue3;
	}

	public void setCostValue3(Double costValue3) {
		this.costValue3 = costValue3;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}