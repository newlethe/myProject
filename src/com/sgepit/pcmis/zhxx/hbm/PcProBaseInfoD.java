package com.sgepit.pcmis.zhxx.hbm;

/**
 * PcProBaseInfoD entity. @author MyEclipse Persistence Tools
 */

public class PcProBaseInfoD implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String prjName;
	private String buildUnit;
	private String buildGuimoDw;
	private String buildGuimoGm;
	private String buildNature;
	private String buildAddress;
	private String buildLimit;
	private Double companyShare;
	private Double bdgTotalAmount;
	private Double bdgTjAmount;
	private Double bdgSbAmount;
	private Double bdgAzAmount;
	private Double bdgTqAmount;
	private Double bdgKcAmount;
	private Double bdgQtAmount;
	private Double fundSourceTotalAmount;
	private Double fundSourceZbAmount;
	private Double fundSourceDkAmount;
	private Double fundSourceQtAmount;

	// Constructors

	/** default constructor */
	public PcProBaseInfoD() {
	}

	/** minimal constructor */
	public PcProBaseInfoD(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcProBaseInfoD(String pid, String prjName, String buildUnit,
			String buildGuimoDw, String buildGuimoGm, String buildNature,
			String buildAddress, String buildLimit, Double companyShare,
			Double bdgTotalAmount, Double bdgTjAmount, Double bdgSbAmount,
			Double bdgAzAmount, Double bdgTqAmount, Double bdgKcAmount,
			Double bdgQtAmount, Double fundSourceTotalAmount,
			Double fundSourceZbAmount, Double fundSourceDkAmount,
			Double fundSourceQtAmount) {
		this.pid = pid;
		this.prjName = prjName;
		this.buildUnit = buildUnit;
		this.buildGuimoDw = buildGuimoDw;
		this.buildGuimoGm = buildGuimoGm;
		this.buildNature = buildNature;
		this.buildAddress = buildAddress;
		this.buildLimit = buildLimit;
		this.companyShare = companyShare;
		this.bdgTotalAmount = bdgTotalAmount;
		this.bdgTjAmount = bdgTjAmount;
		this.bdgSbAmount = bdgSbAmount;
		this.bdgAzAmount = bdgAzAmount;
		this.bdgTqAmount = bdgTqAmount;
		this.bdgKcAmount = bdgKcAmount;
		this.bdgQtAmount = bdgQtAmount;
		this.fundSourceTotalAmount = fundSourceTotalAmount;
		this.fundSourceZbAmount = fundSourceZbAmount;
		this.fundSourceDkAmount = fundSourceDkAmount;
		this.fundSourceQtAmount = fundSourceQtAmount;
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

	public String getPrjName() {
		return this.prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}

	public String getBuildUnit() {
		return this.buildUnit;
	}

	public void setBuildUnit(String buildUnit) {
		this.buildUnit = buildUnit;
	}

	public String getBuildGuimoDw() {
		return this.buildGuimoDw;
	}

	public void setBuildGuimoDw(String buildGuimoDw) {
		this.buildGuimoDw = buildGuimoDw;
	}

	public String getBuildGuimoGm() {
		return this.buildGuimoGm;
	}

	public void setBuildGuimoGm(String buildGuimoGm) {
		this.buildGuimoGm = buildGuimoGm;
	}

	public String getBuildNature() {
		return this.buildNature;
	}

	public void setBuildNature(String buildNature) {
		this.buildNature = buildNature;
	}

	public String getBuildAddress() {
		return this.buildAddress;
	}

	public void setBuildAddress(String buildAddress) {
		this.buildAddress = buildAddress;
	}

	public String getBuildLimit() {
		return this.buildLimit;
	}

	public void setBuildLimit(String buildLimit) {
		this.buildLimit = buildLimit;
	}

	public Double getCompanyShare() {
		return this.companyShare;
	}

	public void setCompanyShare(Double companyShare) {
		this.companyShare = companyShare;
	}

	public Double getBdgTotalAmount() {
		return this.bdgTotalAmount;
	}

	public void setBdgTotalAmount(Double bdgTotalAmount) {
		this.bdgTotalAmount = bdgTotalAmount;
	}

	public Double getBdgTjAmount() {
		return this.bdgTjAmount;
	}

	public void setBdgTjAmount(Double bdgTjAmount) {
		this.bdgTjAmount = bdgTjAmount;
	}

	public Double getBdgSbAmount() {
		return this.bdgSbAmount;
	}

	public void setBdgSbAmount(Double bdgSbAmount) {
		this.bdgSbAmount = bdgSbAmount;
	}

	public Double getBdgAzAmount() {
		return this.bdgAzAmount;
	}

	public void setBdgAzAmount(Double bdgAzAmount) {
		this.bdgAzAmount = bdgAzAmount;
	}

	public Double getBdgTqAmount() {
		return this.bdgTqAmount;
	}

	public void setBdgTqAmount(Double bdgTqAmount) {
		this.bdgTqAmount = bdgTqAmount;
	}

	public Double getBdgKcAmount() {
		return this.bdgKcAmount;
	}

	public void setBdgKcAmount(Double bdgKcAmount) {
		this.bdgKcAmount = bdgKcAmount;
	}

	public Double getBdgQtAmount() {
		return this.bdgQtAmount;
	}

	public void setBdgQtAmount(Double bdgQtAmount) {
		this.bdgQtAmount = bdgQtAmount;
	}

	public Double getFundSourceTotalAmount() {
		return this.fundSourceTotalAmount;
	}

	public void setFundSourceTotalAmount(Double fundSourceTotalAmount) {
		this.fundSourceTotalAmount = fundSourceTotalAmount;
	}

	public Double getFundSourceZbAmount() {
		return this.fundSourceZbAmount;
	}

	public void setFundSourceZbAmount(Double fundSourceZbAmount) {
		this.fundSourceZbAmount = fundSourceZbAmount;
	}

	public Double getFundSourceDkAmount() {
		return this.fundSourceDkAmount;
	}

	public void setFundSourceDkAmount(Double fundSourceDkAmount) {
		this.fundSourceDkAmount = fundSourceDkAmount;
	}

	public Double getFundSourceQtAmount() {
		return this.fundSourceQtAmount;
	}

	public void setFundSourceQtAmount(Double fundSourceQtAmount) {
		this.fundSourceQtAmount = fundSourceQtAmount;
	}

}