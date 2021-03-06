package com.sgepit.pcmis.zhxx.hbm;

import java.util.Date;

/**
 * VPcZhxxPrjInfoId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcZhxxPrjInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String industryType;
	private String buildNature;
	private String prjStage;
	private String prjType;
	private String prjName;
	private String prjRespond;
	private String investScale;
	private String buildLimit;
	private String fundSrc;
	private String prjAddress;
	private String prjSummary;
	private String memo;
	private Date buildStart;
	private Date buildEnd;
	private String memoC1;
	private String memoC2;
	private String memoC3;
	private String memoC4;
	private String industryTypeName;
	private String buildNatureName;
	private String prjStageName;
	private String prjTypeName;
	private String guiMoDw;

	// Constructors

	/** default constructor */
	public VPcZhxxPrjInfo() {
	}

	/** minimal constructor */
	public VPcZhxxPrjInfo(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public VPcZhxxPrjInfo(String uids, String pid, String industryType,
			String buildNature, String prjStage, String prjType,
			String prjName, String prjRespond, String investScale,
			String buildLimit, String fundSrc, String prjAddress,
			String prjSummary, String memo, Date buildStart, Date buildEnd,
			String memoC1, String memoC2, String memoC3, String memoC4,
			String industryTypeName, String buildNatureName,
			String prjStageName, String prjTypeName, String guiMoDw) {
		this.uids = uids;
		this.pid = pid;
		this.industryType = industryType;
		this.buildNature = buildNature;
		this.prjStage = prjStage;
		this.prjType = prjType;
		this.prjName = prjName;
		this.prjRespond = prjRespond;
		this.investScale = investScale;
		this.buildLimit = buildLimit;
		this.fundSrc = fundSrc;
		this.prjAddress = prjAddress;
		this.prjSummary = prjSummary;
		this.memo = memo;
		this.buildStart = buildStart;
		this.buildEnd = buildEnd;
		this.memoC1 = memoC1;
		this.memoC2 = memoC2;
		this.memoC3 = memoC3;
		this.memoC4 = memoC4;
		this.industryTypeName = industryTypeName;
		this.buildNatureName = buildNatureName;
		this.prjStageName = prjStageName;
		this.prjTypeName = prjTypeName;
		this.guiMoDw = guiMoDw;
	}

	// Property accessors

	public String getGuiMoDw() {
		return guiMoDw;
	}

	public void setGuiMoDw(String guiMoDw) {
		this.guiMoDw = guiMoDw;
	}

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

	public String getIndustryType() {
		return this.industryType;
	}

	public void setIndustryType(String industryType) {
		this.industryType = industryType;
	}

	public String getBuildNature() {
		return this.buildNature;
	}

	public void setBuildNature(String buildNature) {
		this.buildNature = buildNature;
	}

	public String getPrjStage() {
		return this.prjStage;
	}

	public void setPrjStage(String prjStage) {
		this.prjStage = prjStage;
	}

	public String getPrjType() {
		return this.prjType;
	}

	public void setPrjType(String prjType) {
		this.prjType = prjType;
	}

	public String getPrjName() {
		return this.prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}

	public String getPrjRespond() {
		return this.prjRespond;
	}

	public void setPrjRespond(String prjRespond) {
		this.prjRespond = prjRespond;
	}

	public String getInvestScale() {
		return this.investScale;
	}

	public void setInvestScale(String investScale) {
		this.investScale = investScale;
	}

	public String getBuildLimit() {
		return this.buildLimit;
	}

	public void setBuildLimit(String buildLimit) {
		this.buildLimit = buildLimit;
	}

	public String getFundSrc() {
		return this.fundSrc;
	}

	public void setFundSrc(String fundSrc) {
		this.fundSrc = fundSrc;
	}

	public String getPrjAddress() {
		return this.prjAddress;
	}

	public void setPrjAddress(String prjAddress) {
		this.prjAddress = prjAddress;
	}

	public String getPrjSummary() {
		return this.prjSummary;
	}

	public void setPrjSummary(String prjSummary) {
		this.prjSummary = prjSummary;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Date getBuildStart() {
		return this.buildStart;
	}

	public void setBuildStart(Date buildStart) {
		this.buildStart = buildStart;
	}

	public Date getBuildEnd() {
		return this.buildEnd;
	}

	public void setBuildEnd(Date buildEnd) {
		this.buildEnd = buildEnd;
	}

	public String getMemoC1() {
		return this.memoC1;
	}

	public void setMemoC1(String memoC1) {
		this.memoC1 = memoC1;
	}

	public String getMemoC2() {
		return this.memoC2;
	}

	public void setMemoC2(String memoC2) {
		this.memoC2 = memoC2;
	}

	public String getMemoC3() {
		return this.memoC3;
	}

	public void setMemoC3(String memoC3) {
		this.memoC3 = memoC3;
	}

	public String getMemoC4() {
		return this.memoC4;
	}

	public void setMemoC4(String memoC4) {
		this.memoC4 = memoC4;
	}

	public String getIndustryTypeName() {
		return this.industryTypeName;
	}

	public void setIndustryTypeName(String industryTypeName) {
		this.industryTypeName = industryTypeName;
	}

	public String getBuildNatureName() {
		return this.buildNatureName;
	}

	public void setBuildNatureName(String buildNatureName) {
		this.buildNatureName = buildNatureName;
	}

	public String getPrjStageName() {
		return this.prjStageName;
	}

	public void setPrjStageName(String prjStageName) {
		this.prjStageName = prjStageName;
	}

	public String getPrjTypeName() {
		return this.prjTypeName;
	}

	public void setPrjTypeName(String prjTypeName) {
		this.prjTypeName = prjTypeName;
	}
}