package com.sgepit.pcmis.approvl.hbm;

import java.util.Date;
  /**
   * 
   * @author Administrator
   * @version 1.0
   */
public class PCApprovlInfoStatistics 
{
	private String pid;    //项目编号
	private String uids;
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
	private String isapproved;
	private String isapproval;
	private Double totalinvestment;
	private String guiMoDw;
	
	private String approvalProcessed;   
	private String approvalProcessing;
	private String approvalWaitProcess;
	private String approvalTotal;
	private String backupC1;
	
	private String provincelApprovalNum;
	
	public PCApprovlInfoStatistics(){
		
	}
	public PCApprovlInfoStatistics(String pid, String approvalProcessed, String approvalProcessing, 
			String approvalWaitProcess, String approvalTotal,String uids, String industryType,
			String buildNature, String prjStage, String prjType,
			String prjName, String prjRespond, String investScale,
			String buildLimit, String fundSrc, String prjAddress,
			String prjSummary, String memo, Date buildStart, Date buildEnd,
			String memoC1, String memoC2, String memoC3, String memoC4,
			String isapproved, String isapproval, Double totalinvestment, 
			String guiMoDw, String backupC1)
	{
		this.pid = pid;
		this.uids = uids;
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
		this.isapproved = isapproved;
		this.isapproval = isapproval;
		this.totalinvestment = totalinvestment;
		this.guiMoDw = guiMoDw;
		this.approvalProcessed = approvalProcessed;
		this.approvalProcessing = approvalProcessing;
		this.approvalWaitProcess = approvalWaitProcess;
		this.approvalTotal = approvalTotal;
		this.backupC1 = backupC1;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getIndustryType() {
		return industryType;
	}
	public void setIndustryType(String industryType) {
		this.industryType = industryType;
	}
	public String getBuildNature() {
		return buildNature;
	}
	public void setBuildNature(String buildNature) {
		this.buildNature = buildNature;
	}
	public String getPrjStage() {
		return prjStage;
	}
	public void setPrjStage(String prjStage) {
		this.prjStage = prjStage;
	}
	public String getPrjType() {
		return prjType;
	}
	public void setPrjType(String prjType) {
		this.prjType = prjType;
	}
	public String getPrjName() {
		return prjName;
	}
	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}
	public String getPrjRespond() {
		return prjRespond;
	}
	public void setPrjRespond(String prjRespond) {
		this.prjRespond = prjRespond;
	}
	public String getBuildLimit() {
		return buildLimit;
	}
	public void setBuildLimit(String buildLimit) {
		this.buildLimit = buildLimit;
	}
	public String getFundSrc() {
		return fundSrc;
	}
	public void setFundSrc(String fundSrc) {
		this.fundSrc = fundSrc;
	}
	public String getPrjAddress() {
		return prjAddress;
	}
	public void setPrjAddress(String prjAddress) {
		this.prjAddress = prjAddress;
	}
	public String getPrjSummary() {
		return prjSummary;
	}
	public void setPrjSummary(String prjSummary) {
		this.prjSummary = prjSummary;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public Date getBuildStart() {
		return buildStart;
	}
	public void setBuildStart(Date buildStart) {
		this.buildStart = buildStart;
	}
	public Date getBuildEnd() {
		return buildEnd;
	}
	public void setBuildEnd(Date buildEnd) {
		this.buildEnd = buildEnd;
	}
	public String getMemoC1() {
		return memoC1;
	}
	public void setMemoC1(String memoC1) {
		this.memoC1 = memoC1;
	}
	public String getMemoC2() {
		return memoC2;
	}
	public void setMemoC2(String memoC2) {
		this.memoC2 = memoC2;
	}
	public String getMemoC3() {
		return memoC3;
	}
	public void setMemoC3(String memoC3) {
		this.memoC3 = memoC3;
	}
	public String getMemoC4() {
		return memoC4;
	}
	public void setMemoC4(String memoC4) {
		this.memoC4 = memoC4;
	}
	public String getIsapproved() {
		return isapproved;
	}
	public void setIsapproved(String isapproved) {
		this.isapproved = isapproved;
	}
	public String getIsapproval() {
		return isapproval;
	}
	public void setIsapproval(String isapproval) {
		this.isapproval = isapproval;
	}
	public Double getTotalinvestment() {
		return totalinvestment;
	}
	public void setTotalinvestment(Double totalinvestment) {
		this.totalinvestment = totalinvestment;
	}
	public String getGuiMoDw() {
		return guiMoDw;
	}
	public void setGuiMoDw(String guiMoDw) {
		this.guiMoDw = guiMoDw;
	}
	public String getInvestScale() {
		return investScale;
	}
	public void setInvestScale(String investScale) {
		this.investScale = investScale;
	}
	public String getBackupC1() {
		return backupC1;
	}
	public void setBackupC1(String backupC1) {
		this.backupC1 = backupC1;
	}
	public String getApprovalProcessed() {
		return approvalProcessed;
	}
	public void setApprovalProcessed(String approvalProcessed) {
		this.approvalProcessed = approvalProcessed;
	}
	public String getApprovalProcessing() {
		return approvalProcessing;
	}
	public void setApprovalProcessing(String approvalProcessing) {
		this.approvalProcessing = approvalProcessing;
	}
	public String getApprovalWaitProcess() {
		return approvalWaitProcess;
	}
	public void setApprovalWaitProcess(String approvalWaitProcess) {
		this.approvalWaitProcess = approvalWaitProcess;
	}
	public String getApprovalTotal() {
		return approvalTotal;
	}
	public void setApprovalTotal(String approvalTotal) {
		this.approvalTotal = approvalTotal;
	}
	public String getProvincelApprovalNum() {
		return provincelApprovalNum;
	}
	public void setProvincelApprovalNum(String provincelApprovalNum) {
		this.provincelApprovalNum = provincelApprovalNum;
	}
}
