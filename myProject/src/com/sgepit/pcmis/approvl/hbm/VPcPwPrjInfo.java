package com.sgepit.pcmis.approvl.hbm;

import java.util.Date;

/**
 * PcZhxxPrjInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcPwPrjInfo implements java.io.Serializable {

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
	private String isapproved;
	private String isapproval;
	private Double totalinvestment;
	private String guiMoDw;
	private String backupC1;
	
	//新添加内容
	private String jianCheng;
	private String unit2id;
	private String unit3id;
	private String total;
	private String undo;
	private String doing;
	private String done;
	private String guiMo;
	private String name1;
	private String code1;
	private String name2;
	private String code2;
	private String name3;
	private String code3;
	private String name4;
	private String code4;
	private String approvalProcessed;   
	private String approvalProcessing;
	private String approvalWaitProcess;
	private String approvalTotal;
	private String provincelApprovalNum;
	// Constructors

	public VPcPwPrjInfo(String uids, String pid, String industryType,
			String buildNature, String prjStage, String prjType,
			String prjName, String prjRespond, String investScale,
			String buildLimit, String fundSrc, String prjAddress,
			String prjSummary, String memo, Date buildStart, Date buildEnd,
			String memoC1, String memoC2, String memoC3, String memoC4,
			String isapproved, String isapproval, Double totalinvestment,
			String guiMoDw, String backupC1, String jianCheng, String unit2id,
			String unit3id, String total, String undo, String doing,
			String done, String guiMo, String name1, String code1,
			String name2, String code2, String name3, String code3,
			String name4, String code4, String approvalTotal, String approvalWaitProcess, 
			String approvalProcessing, String approvalProcessed) {
		super();
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
		this.isapproved = isapproved;
		this.isapproval = isapproval;
		this.totalinvestment = totalinvestment;
		this.guiMoDw = guiMoDw;
		this.backupC1 = backupC1;
		this.jianCheng = jianCheng;
		this.unit2id = unit2id;
		this.unit3id = unit3id;
		this.total = total;
		this.undo = undo;
		this.doing = doing;
		this.done = done;
		this.guiMo = guiMo;
		this.name1 = name1;
		this.code1 = code1;
		this.name2 = name2;
		this.code2 = code2;
		this.name3 = name3;
		this.code3 = code3;
		this.name4 = name4;
		this.code4 = code4;
		this.approvalProcessed = approvalProcessed;
		this.approvalProcessing = approvalProcessing;
		this.approvalWaitProcess = approvalWaitProcess;
		this.approvalTotal = approvalTotal;
	}

	/** default constructor */
	public VPcPwPrjInfo() {
	}

	/** minimal constructor */
	public VPcPwPrjInfo(String pid) {
		this.pid = pid;
	}

	/** full constructor */

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

	public String getMemoC1() {
		return memoC1;
	}

	public void setMemoC1(String memoC1) {
		this.memoC1 = memoC1;
	}

	public String getJianCheng() {
		return jianCheng;
	}

	public void setJianCheng(String jianCheng) {
		this.jianCheng = jianCheng;
	}

	public String getUnit2id() {
		return unit2id;
	}

	public void setUnit2id(String unit2id) {
		this.unit2id = unit2id;
	}

	public String getUnit3id() {
		return unit3id;
	}

	public void setUnit3id(String unit3id) {
		this.unit3id = unit3id;
	}

	public String getTotal() {
		return total;
	}

	public void setTotal(String total) {
		this.total = total;
	}

	public String getUndo() {
		return undo;
	}

	public void setUndo(String undo) {
		this.undo = undo;
	}

	public String getDoing() {
		return doing;
	}

	public void setDoing(String doing) {
		this.doing = doing;
	}

	public String getDone() {
		return done;
	}

	public void setDone(String done) {
		this.done = done;
	}

	public String getGuiMo() {
		return guiMo;
	}

	public void setGuiMo(String guiMo) {
		this.guiMo = guiMo;
	}

	public String getName1() {
		return name1;
	}

	public void setName1(String name1) {
		this.name1 = name1;
	}

	public String getCode1() {
		return code1;
	}

	public void setCode1(String code1) {
		this.code1 = code1;
	}

	public String getName2() {
		return name2;
	}

	public void setName2(String name2) {
		this.name2 = name2;
	}

	public String getCode2() {
		return code2;
	}

	public void setCode2(String code2) {
		this.code2 = code2;
	}

	public String getName3() {
		return name3;
	}

	public void setName3(String name3) {
		this.name3 = name3;
	}

	public String getCode3() {
		return code3;
	}

	public void setCode3(String code3) {
		this.code3 = code3;
	}

	public String getName4() {
		return name4;
	}

	public void setName4(String name4) {
		this.name4 = name4;
	}

	public String getCode4() {
		return code4;
	}

	public void setCode4(String code4) {
		this.code4 = code4;
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