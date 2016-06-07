package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompTransferAssetsR4 entity. @author MyEclipse Persistence Tools
 */

public class FacompTransferAssetsR4 implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String treeid;
	private Long isleaf;
	private String parentid;
	private String remark;
	private String assetname;
	private String assetno;
	private String typetreeid;
	private Double buildMoney;
	private Double equipBuyMoney;
	private Double installMoney;
	private Double contMoney;
	private Double fixedAssetsMoney;
	private Double currentAssetsMoney;
	private Double intangibleAssetsMoney;
	private Double longTermUnamortizedMoney;
	private Double otherCostMoney;
	private Double transferTotalMoney;

	// Constructors

	/** default constructor */
	public FacompTransferAssetsR4() {
	}

	/** full constructor */
	public FacompTransferAssetsR4(String pid, String treeid, Long isleaf,
			String parentid, String remark, String assetname, String assetno,
			String typetreeid, Double buildMoney, Double equipBuyMoney,
			Double installMoney, Double contMoney, Double fixedAssetsMoney,
			Double currentAssetsMoney, Double intangibleAssetsMoney,
			Double longTermUnamortizedMoney, Double otherCostMoney,
			Double transferTotalMoney) {
		this.pid = pid;
		this.treeid = treeid;
		this.isleaf = isleaf;
		this.parentid = parentid;
		this.remark = remark;
		this.assetname = assetname;
		this.assetno = assetno;
		this.typetreeid = typetreeid;
		this.buildMoney = buildMoney;
		this.equipBuyMoney = equipBuyMoney;
		this.installMoney = installMoney;
		this.contMoney = contMoney;
		this.fixedAssetsMoney = fixedAssetsMoney;
		this.currentAssetsMoney = currentAssetsMoney;
		this.intangibleAssetsMoney = intangibleAssetsMoney;
		this.longTermUnamortizedMoney = longTermUnamortizedMoney;
		this.otherCostMoney = otherCostMoney;
		this.transferTotalMoney = transferTotalMoney;
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

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getAssetname() {
		return this.assetname;
	}

	public void setAssetname(String assetname) {
		this.assetname = assetname;
	}

	public String getAssetno() {
		return this.assetno;
	}

	public void setAssetno(String assetno) {
		this.assetno = assetno;
	}

	public String getTypetreeid() {
		return this.typetreeid;
	}

	public void setTypetreeid(String typetreeid) {
		this.typetreeid = typetreeid;
	}

	public Double getBuildMoney() {
		return this.buildMoney;
	}

	public void setBuildMoney(Double buildMoney) {
		this.buildMoney = buildMoney;
	}

	public Double getEquipBuyMoney() {
		return this.equipBuyMoney;
	}

	public void setEquipBuyMoney(Double equipBuyMoney) {
		this.equipBuyMoney = equipBuyMoney;
	}

	public Double getInstallMoney() {
		return this.installMoney;
	}

	public void setInstallMoney(Double installMoney) {
		this.installMoney = installMoney;
	}

	public Double getContMoney() {
		return this.contMoney;
	}

	public void setContMoney(Double contMoney) {
		this.contMoney = contMoney;
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

	public Double getOtherCostMoney() {
		return this.otherCostMoney;
	}

	public void setOtherCostMoney(Double otherCostMoney) {
		this.otherCostMoney = otherCostMoney;
	}

	public Double getTransferTotalMoney() {
		return this.transferTotalMoney;
	}

	public void setTransferTotalMoney(Double transferTotalMoney) {
		this.transferTotalMoney = transferTotalMoney;
	}

}