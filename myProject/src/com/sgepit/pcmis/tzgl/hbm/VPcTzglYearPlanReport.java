package com.sgepit.pcmis.tzgl.hbm;

/**
 * VPcTzglYearPlanReportId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcTzglYearPlanReport implements java.io.Serializable {

	// Fields

	private String uids;
	private String masterUids;
	private String pid;
	private String sjType;
	private String unitId;
	private String zbSeqno;
	private Double val1;
	private Double totalWorkAmount;
	private Double totalFullFunded;
	private Double buildMoney;
	private Double equipMoney;
	private Double installMoney;
	private Double routeMoney;
	private Double otherMoney;
	private Double groupAddFund;
	private Double equityFund;
	private Double capitalLoan;
	private Double capitalOther;
	private Double fundPlanLoan;
	private Double fundPlanOther;
	private String progressObjective;
	private String memo;
	private String unitname;	//项目名称
	private String sjStr;		//时间(XXXX年 )
	private String buildScale;	//建设规模
	private String buildNature;	//建设性质
	private String buildLimit;	//建设起止年限
	private Double srcZbjjt;	//资金来源-资本金-集团出资
	private Double srcZbjzy;	//资金来源-资本金-自有资金
	private Double srcZbjqt;	//资金来源-资本金-其它
	private Double srcDk;		//资金来源-贷款
	private Double srcQt;		//资金来源-其它
	private Double srcZbjTotal;	//资金来源-资本金-小计
	private Double investTotal;	//总投资总额
	private Double lastYearCompTotal;	//上一年完成工程量总额
	private Double lastYearFundedTotal;	//上一年资金到位总额
	private Double prjMoneyTotal;		//工程计划总额
	private Double planZbjTotal;		//资金计划-资本金-合计
	private Double planFundTotal;		//资金计划-总额

	// Constructors

	/** default constructor */
	public VPcTzglYearPlanReport() {
	}

	/** minimal constructor */
	public VPcTzglYearPlanReport(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public VPcTzglYearPlanReport(String uids, String masterUids, String pid,
			String sjType, String unitId, String zbSeqno, Double val1,
			Double totalWorkAmount, Double totalFullFunded, Double buildMoney,
			Double equipMoney, Double installMoney, Double routeMoney,
			Double otherMoney, Double groupAddFund, Double equityFund,
			Double capitalLoan, Double capitalOther, Double fundPlanLoan,
			Double fundPlanOther, String progressObjective, String memo,
			Double totalInvest, Double srcCorpInvest, Double srcEquityFund,
			Double srcCapitalOther, Double srcLoan, Double srcOther,
			String unitname, String sjStr, String buildScale,
			String buildNature, String buildLimit, Double srcZbjjt,
			Double srcZbjzy, Double srcZbjqt, Double srcDk, Double srcQt,
			Double srcZbjTotal, Double investTotal, Double lastYearCompTotal,
			Double lastYearFundedTotal, Double prjMoneyTotal, Double planZbjTotal,
			Double planFundTotal) {
		this.uids = uids;
		this.masterUids = masterUids;
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
		this.val1 = val1;
		this.totalWorkAmount = totalWorkAmount;
		this.totalFullFunded = totalFullFunded;
		this.buildMoney = buildMoney;
		this.equipMoney = equipMoney;
		this.installMoney = installMoney;
		this.routeMoney = routeMoney;
		this.otherMoney = otherMoney;
		this.groupAddFund = groupAddFund;
		this.equityFund = equityFund;
		this.capitalLoan = capitalLoan;
		this.capitalOther = capitalOther;
		this.fundPlanLoan = fundPlanLoan;
		this.fundPlanOther = fundPlanOther;
		this.progressObjective = progressObjective;
		this.memo = memo;
		this.unitname = unitname;
		this.sjStr = sjStr;
		this.buildScale = buildScale;
		this.buildNature = buildNature;
		this.buildLimit = buildLimit;
		this.srcZbjjt = srcZbjjt;
		this.srcZbjzy = srcZbjzy;
		this.srcZbjqt = srcZbjqt;
		this.srcDk = srcDk;
		this.srcQt = srcQt;
		this.srcZbjTotal = srcZbjTotal;
		this.investTotal = investTotal;
		this.lastYearCompTotal = lastYearCompTotal;
		this.lastYearFundedTotal = lastYearFundedTotal;
		this.prjMoneyTotal = prjMoneyTotal;
		this.planZbjTotal = planZbjTotal;
		this.planFundTotal = planFundTotal;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getMasterUids() {
		return this.masterUids;
	}

	public void setMasterUids(String masterUids) {
		this.masterUids = masterUids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getZbSeqno() {
		return this.zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
	}

	public Double getVal1() {
		return this.val1;
	}

	public void setVal1(Double val1) {
		this.val1 = val1;
	}

	public Double getTotalWorkAmount() {
		return this.totalWorkAmount;
	}

	public void setTotalWorkAmount(Double totalWorkAmount) {
		this.totalWorkAmount = totalWorkAmount;
	}

	public Double getTotalFullFunded() {
		return this.totalFullFunded;
	}

	public void setTotalFullFunded(Double totalFullFunded) {
		this.totalFullFunded = totalFullFunded;
	}

	public Double getBuildMoney() {
		return this.buildMoney;
	}

	public void setBuildMoney(Double buildMoney) {
		this.buildMoney = buildMoney;
	}

	public Double getEquipMoney() {
		return this.equipMoney;
	}

	public void setEquipMoney(Double equipMoney) {
		this.equipMoney = equipMoney;
	}

	public Double getInstallMoney() {
		return this.installMoney;
	}

	public void setInstallMoney(Double installMoney) {
		this.installMoney = installMoney;
	}

	public Double getRouteMoney() {
		return this.routeMoney;
	}

	public void setRouteMoney(Double routeMoney) {
		this.routeMoney = routeMoney;
	}

	public Double getOtherMoney() {
		return this.otherMoney;
	}

	public void setOtherMoney(Double otherMoney) {
		this.otherMoney = otherMoney;
	}

	public Double getGroupAddFund() {
		return this.groupAddFund;
	}

	public void setGroupAddFund(Double groupAddFund) {
		this.groupAddFund = groupAddFund;
	}

	public Double getEquityFund() {
		return this.equityFund;
	}

	public void setEquityFund(Double equityFund) {
		this.equityFund = equityFund;
	}

	public Double getCapitalLoan() {
		return this.capitalLoan;
	}

	public void setCapitalLoan(Double capitalLoan) {
		this.capitalLoan = capitalLoan;
	}

	public Double getCapitalOther() {
		return this.capitalOther;
	}

	public void setCapitalOther(Double capitalOther) {
		this.capitalOther = capitalOther;
	}

	public Double getFundPlanLoan() {
		return this.fundPlanLoan;
	}

	public void setFundPlanLoan(Double fundPlanLoan) {
		this.fundPlanLoan = fundPlanLoan;
	}

	public Double getFundPlanOther() {
		return this.fundPlanOther;
	}

	public void setFundPlanOther(Double fundPlanOther) {
		this.fundPlanOther = fundPlanOther;
	}

	public String getProgressObjective() {
		return this.progressObjective;
	}

	public void setProgressObjective(String progressObjective) {
		this.progressObjective = progressObjective;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getUnitname() {
		return this.unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getSjStr() {
		return this.sjStr;
	}

	public void setSjStr(String sjStr) {
		this.sjStr = sjStr;
	}

	public String getBuildScale() {
		return this.buildScale;
	}

	public void setBuildScale(String buildScale) {
		this.buildScale = buildScale;
	}

	public String getBuildNature() {
		return this.buildNature;
	}

	public void setBuildNature(String buildNature) {
		this.buildNature = buildNature;
	}

	public String getBuildLimit() {
		return this.buildLimit;
	}

	public void setBuildLimit(String buildLimit) {
		this.buildLimit = buildLimit;
	}

	public Double getSrcZbjjt() {
		return this.srcZbjjt;
	}

	public void setSrcZbjjt(Double srcZbjjt) {
		this.srcZbjjt = srcZbjjt;
	}

	public Double getSrcZbjzy() {
		return this.srcZbjzy;
	}

	public void setSrcZbjzy(Double srcZbjzy) {
		this.srcZbjzy = srcZbjzy;
	}

	public Double getSrcZbjqt() {
		return this.srcZbjqt;
	}

	public void setSrcZbjqt(Double srcZbjqt) {
		this.srcZbjqt = srcZbjqt;
	}

	public Double getSrcDk() {
		return this.srcDk;
	}

	public void setSrcDk(Double srcDk) {
		this.srcDk = srcDk;
	}

	public Double getSrcQt() {
		return this.srcQt;
	}

	public void setSrcQt(Double srcQt) {
		this.srcQt = srcQt;
	}

	public Double getSrcZbjTotal() {
		return this.srcZbjTotal;
	}

	public void setSrcZbjTotal(Double srcZbjTotal) {
		this.srcZbjTotal = srcZbjTotal;
	}

	public Double getInvestTotal() {
		return this.investTotal;
	}

	public void setInvestTotal(Double investTotal) {
		this.investTotal = investTotal;
	}

	public Double getLastYearCompTotal() {
		return this.lastYearCompTotal;
	}

	public void setLastYearCompTotal(Double lastYearCompTotal) {
		this.lastYearCompTotal = lastYearCompTotal;
	}

	public Double getLastYearFundedTotal() {
		return this.lastYearFundedTotal;
	}

	public void setLastYearFundedTotal(Double lastYearFundedTotal) {
		this.lastYearFundedTotal = lastYearFundedTotal;
	}

	public Double getPrjMoneyTotal() {
		return this.prjMoneyTotal;
	}

	public void setPrjMoneyTotal(Double prjMoneyTotal) {
		this.prjMoneyTotal = prjMoneyTotal;
	}

	public Double getPlanZbjTotal() {
		return this.planZbjTotal;
	}

	public void setPlanZbjTotal(Double planZbjTotal) {
		this.planZbjTotal = planZbjTotal;
	}

	public Double getPlanFundTotal() {
		return this.planFundTotal;
	}

	public void setPlanFundTotal(Double planFundTotal) {
		this.planFundTotal = planFundTotal;
	}
}