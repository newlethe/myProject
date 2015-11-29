package com.sgepit.pmis.finalAccounts.complete.hbm;


/**
 * FacompTransferAssetsR4View entity. @author MyEclipse Persistence Tools
 */

public class FacompTransferAssetsR4View implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String treeid;
	private String typetreeid;
	private Double buildMoney;
	private Double equipBuyMoney;
	private Double installMoney;
	private Double contMoney;
	private Double fixedAssetsMoney;
	private Double currentAssetsMoney;
	private Double intangibleAssetsMoney;
	private Double longTermUnamortizedMoney;

	// Constructors

	/** default constructor */
	public FacompTransferAssetsR4View() {
	}

	public FacompTransferAssetsR4View(String uids, String pid, String treeid,
			String typetreeid, Double buildMoney, Double equipBuyMoney,
			Double installMoney, Double contMoney, Double fixedAssetsMoney,
			Double currentAssetsMoney, Double intangibleAssetsMoney,
			Double longTermUnamortizedMoney) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.treeid = treeid;
		this.typetreeid = typetreeid;
		this.buildMoney = buildMoney;
		this.equipBuyMoney = equipBuyMoney;
		this.installMoney = installMoney;
		this.contMoney = contMoney;
		this.fixedAssetsMoney = fixedAssetsMoney;
		this.currentAssetsMoney = currentAssetsMoney;
		this.intangibleAssetsMoney = intangibleAssetsMoney;
		this.longTermUnamortizedMoney = longTermUnamortizedMoney;
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

	public String getTreeid() {
		return treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getTypetreeid() {
		return typetreeid;
	}

	public void setTypetreeid(String typetreeid) {
		this.typetreeid = typetreeid;
	}

	public Double getBuildMoney() {
		return buildMoney;
	}

	public void setBuildMoney(Double buildMoney) {
		this.buildMoney = buildMoney;
	}

	public Double getEquipBuyMoney() {
		return equipBuyMoney;
	}

	public void setEquipBuyMoney(Double equipBuyMoney) {
		this.equipBuyMoney = equipBuyMoney;
	}

	public Double getInstallMoney() {
		return installMoney;
	}

	public void setInstallMoney(Double installMoney) {
		this.installMoney = installMoney;
	}

	public Double getContMoney() {
		return contMoney;
	}

	public void setContMoney(Double contMoney) {
		this.contMoney = contMoney;
	}

	public Double getFixedAssetsMoney() {
		return fixedAssetsMoney;
	}

	public void setFixedAssetsMoney(Double fixedAssetsMoney) {
		this.fixedAssetsMoney = fixedAssetsMoney;
	}

	public Double getCurrentAssetsMoney() {
		return currentAssetsMoney;
	}

	public void setCurrentAssetsMoney(Double currentAssetsMoney) {
		this.currentAssetsMoney = currentAssetsMoney;
	}

	public Double getIntangibleAssetsMoney() {
		return intangibleAssetsMoney;
	}

	public void setIntangibleAssetsMoney(Double intangibleAssetsMoney) {
		this.intangibleAssetsMoney = intangibleAssetsMoney;
	}

	public Double getLongTermUnamortizedMoney() {
		return longTermUnamortizedMoney;
	}

	public void setLongTermUnamortizedMoney(Double longTermUnamortizedMoney) {
		this.longTermUnamortizedMoney = longTermUnamortizedMoney;
	}

	

}