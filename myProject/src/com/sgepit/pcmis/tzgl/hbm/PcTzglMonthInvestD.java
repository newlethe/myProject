package com.sgepit.pcmis.tzgl.hbm;

/**
 * PcTzglMonthInvestD entity. @author MyEclipse Persistence Tools
 */

public class PcTzglMonthInvestD implements java.io.Serializable {

	// Fields

	private String uids;
	private String masterId;
	private String pid;
	private String sjType;
	private String unitId;
	private Double bdgCompTotal;
	private Double balCompTotal;
	private Double fundPayTotal;
	private Double fundInTotal;
	private Double monthCopmpTotal;
	private Double monthCopmpJz;
	private Double monthCopmpSb;
	private Double monthCopmpAz;
	private Double monthCopmpTd;
	private Double monthCopmpSj;
	private Double monthCopmpQt;
	private Double monthCopmpPay;
	private Double monthCopmpIn;
	private Double monthCopmpBal;
	private Double yearCopmpTotal;
	private Double yearCopmpJz;
	private Double yearCopmpSb;
	private Double yearCopmpAz;
	private Double yearCopmpTd;
	private Double yearCopmpSj;
	private Double yearCopmpQt;
	private Double yearCopmpPay;
	private Double yearCopmpIn;
	private Double yearInvestPlan;
	private Double yearInvestPlanRate;
	private Double yearCopmpRate;
	private String yearPlanVisualSchedule;
	private String monthVisualSchedule;
	private Double lastMonthCopmpTotal;
	private Double lastMonthCopmpJz;
	private Double lastMonthCopmpSb;
	private Double lastMonthCopmpAz;
	private Double lastMonthCopmpTd;
	private Double lastMonthCopmpSj;
	private Double lastMonthCopmpQt;
	private Double lastMonthCopmpPay;
	private Double lastMonthCopmpIn;
	private Double lastMonthCopmpBal;

	// Constructors

	/** default constructor */
	public PcTzglMonthInvestD() {
	}

	/** full constructor */
	public PcTzglMonthInvestD(String masterId, String pid, String sjType,
			String unitId, Double bdgCompTotal, Double balCompTotal,
			Double fundPayTotal, Double fundInTotal, Double monthCopmpTotal,
			Double monthCopmpJz, Double monthCopmpSb, Double monthCopmpAz,
			Double monthCopmpTd, Double monthCopmpSj, Double monthCopmpQt,
			Double monthCopmpPay, Double monthCopmpIn, Double monthCopmpBal,
			Double yearCopmpTotal, Double yearCopmpJz, Double yearCopmpSb,
			Double yearCopmpAz, Double yearCopmpTd, Double yearCopmpSj,
			Double yearCopmpQt, Double yearCopmpPay, Double yearCopmpIn,
			Double yearInvestPlan, Double yearInvestPlanRate,
			Double yearCopmpRate, String yearPlanVisualSchedule,
			String monthVisualSchedule, Double lastMonthCopmpTotal,
			Double lastMonthCopmpJz, Double lastMonthCopmpSb,
			Double lastMonthCopmpAz, Double lastMonthCopmpTd,
			Double lastMonthCopmpSj, Double lastMonthCopmpQt,
			Double lastMonthCopmpPay, Double lastMonthCopmpIn,
			Double lastMonthCopmpBal) {
		this.masterId = masterId;
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.bdgCompTotal = bdgCompTotal;
		this.balCompTotal = balCompTotal;
		this.fundPayTotal = fundPayTotal;
		this.fundInTotal = fundInTotal;
		this.monthCopmpTotal = monthCopmpTotal;
		this.monthCopmpJz = monthCopmpJz;
		this.monthCopmpSb = monthCopmpSb;
		this.monthCopmpAz = monthCopmpAz;
		this.monthCopmpTd = monthCopmpTd;
		this.monthCopmpSj = monthCopmpSj;
		this.monthCopmpQt = monthCopmpQt;
		this.monthCopmpPay = monthCopmpPay;
		this.monthCopmpIn = monthCopmpIn;
		this.monthCopmpBal = monthCopmpBal;
		this.yearCopmpTotal = yearCopmpTotal;
		this.yearCopmpJz = yearCopmpJz;
		this.yearCopmpSb = yearCopmpSb;
		this.yearCopmpAz = yearCopmpAz;
		this.yearCopmpTd = yearCopmpTd;
		this.yearCopmpSj = yearCopmpSj;
		this.yearCopmpQt = yearCopmpQt;
		this.yearCopmpPay = yearCopmpPay;
		this.yearCopmpIn = yearCopmpIn;
		this.yearInvestPlan = yearInvestPlan;
		this.yearInvestPlanRate = yearInvestPlanRate;
		this.yearCopmpRate = yearCopmpRate;
		this.yearPlanVisualSchedule = yearPlanVisualSchedule;
		this.monthVisualSchedule = monthVisualSchedule;
		this.lastMonthCopmpTotal = lastMonthCopmpTotal;
		this.lastMonthCopmpJz = lastMonthCopmpJz;
		this.lastMonthCopmpSb = lastMonthCopmpSb;
		this.lastMonthCopmpAz = lastMonthCopmpAz;
		this.lastMonthCopmpTd = lastMonthCopmpTd;
		this.lastMonthCopmpSj = lastMonthCopmpSj;
		this.lastMonthCopmpQt = lastMonthCopmpQt;
		this.lastMonthCopmpPay = lastMonthCopmpPay;
		this.lastMonthCopmpIn = lastMonthCopmpIn;
		this.lastMonthCopmpBal = lastMonthCopmpBal;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getMasterId() {
		return this.masterId;
	}

	public void setMasterId(String masterId) {
		this.masterId = masterId;
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

	public Double getBdgCompTotal() {
		return this.bdgCompTotal;
	}

	public void setBdgCompTotal(Double bdgCompTotal) {
		this.bdgCompTotal = bdgCompTotal;
	}

	public Double getBalCompTotal() {
		return this.balCompTotal;
	}

	public void setBalCompTotal(Double balCompTotal) {
		this.balCompTotal = balCompTotal;
	}

	public Double getFundPayTotal() {
		return this.fundPayTotal;
	}

	public void setFundPayTotal(Double fundPayTotal) {
		this.fundPayTotal = fundPayTotal;
	}

	public Double getFundInTotal() {
		return this.fundInTotal;
	}

	public void setFundInTotal(Double fundInTotal) {
		this.fundInTotal = fundInTotal;
	}

	public Double getMonthCopmpTotal() {
		return this.monthCopmpTotal;
	}

	public void setMonthCopmpTotal(Double monthCopmpTotal) {
		this.monthCopmpTotal = monthCopmpTotal;
	}

	public Double getMonthCopmpJz() {
		return this.monthCopmpJz;
	}

	public void setMonthCopmpJz(Double monthCopmpJz) {
		this.monthCopmpJz = monthCopmpJz;
	}

	public Double getMonthCopmpSb() {
		return this.monthCopmpSb;
	}

	public void setMonthCopmpSb(Double monthCopmpSb) {
		this.monthCopmpSb = monthCopmpSb;
	}

	public Double getMonthCopmpAz() {
		return this.monthCopmpAz;
	}

	public void setMonthCopmpAz(Double monthCopmpAz) {
		this.monthCopmpAz = monthCopmpAz;
	}

	public Double getMonthCopmpTd() {
		return this.monthCopmpTd;
	}

	public void setMonthCopmpTd(Double monthCopmpTd) {
		this.monthCopmpTd = monthCopmpTd;
	}

	public Double getMonthCopmpSj() {
		return this.monthCopmpSj;
	}

	public void setMonthCopmpSj(Double monthCopmpSj) {
		this.monthCopmpSj = monthCopmpSj;
	}

	public Double getMonthCopmpQt() {
		return this.monthCopmpQt;
	}

	public void setMonthCopmpQt(Double monthCopmpQt) {
		this.monthCopmpQt = monthCopmpQt;
	}

	public Double getMonthCopmpPay() {
		return this.monthCopmpPay;
	}

	public void setMonthCopmpPay(Double monthCopmpPay) {
		this.monthCopmpPay = monthCopmpPay;
	}

	public Double getMonthCopmpIn() {
		return this.monthCopmpIn;
	}

	public void setMonthCopmpIn(Double monthCopmpIn) {
		this.monthCopmpIn = monthCopmpIn;
	}

	public Double getMonthCopmpBal() {
		return this.monthCopmpBal;
	}

	public void setMonthCopmpBal(Double monthCopmpBal) {
		this.monthCopmpBal = monthCopmpBal;
	}

	public Double getYearCopmpTotal() {
		return this.yearCopmpTotal;
	}

	public void setYearCopmpTotal(Double yearCopmpTotal) {
		this.yearCopmpTotal = yearCopmpTotal;
	}

	public Double getYearCopmpJz() {
		return this.yearCopmpJz;
	}

	public void setYearCopmpJz(Double yearCopmpJz) {
		this.yearCopmpJz = yearCopmpJz;
	}

	public Double getYearCopmpSb() {
		return this.yearCopmpSb;
	}

	public void setYearCopmpSb(Double yearCopmpSb) {
		this.yearCopmpSb = yearCopmpSb;
	}

	public Double getYearCopmpAz() {
		return this.yearCopmpAz;
	}

	public void setYearCopmpAz(Double yearCopmpAz) {
		this.yearCopmpAz = yearCopmpAz;
	}

	public Double getYearCopmpTd() {
		return this.yearCopmpTd;
	}

	public void setYearCopmpTd(Double yearCopmpTd) {
		this.yearCopmpTd = yearCopmpTd;
	}

	public Double getYearCopmpSj() {
		return this.yearCopmpSj;
	}

	public void setYearCopmpSj(Double yearCopmpSj) {
		this.yearCopmpSj = yearCopmpSj;
	}

	public Double getYearCopmpQt() {
		return this.yearCopmpQt;
	}

	public void setYearCopmpQt(Double yearCopmpQt) {
		this.yearCopmpQt = yearCopmpQt;
	}

	public Double getYearCopmpPay() {
		return this.yearCopmpPay;
	}

	public void setYearCopmpPay(Double yearCopmpPay) {
		this.yearCopmpPay = yearCopmpPay;
	}

	public Double getYearCopmpIn() {
		return this.yearCopmpIn;
	}

	public void setYearCopmpIn(Double yearCopmpIn) {
		this.yearCopmpIn = yearCopmpIn;
	}

	public Double getYearInvestPlan() {
		return this.yearInvestPlan;
	}

	public void setYearInvestPlan(Double yearInvestPlan) {
		this.yearInvestPlan = yearInvestPlan;
	}

	public Double getYearInvestPlanRate() {
		return this.yearInvestPlanRate;
	}

	public void setYearInvestPlanRate(Double yearInvestPlanRate) {
		this.yearInvestPlanRate = yearInvestPlanRate;
	}

	public Double getYearCopmpRate() {
		return this.yearCopmpRate;
	}

	public void setYearCopmpRate(Double yearCopmpRate) {
		this.yearCopmpRate = yearCopmpRate;
	}

	public String getYearPlanVisualSchedule() {
		return this.yearPlanVisualSchedule;
	}

	public void setYearPlanVisualSchedule(String yearPlanVisualSchedule) {
		this.yearPlanVisualSchedule = yearPlanVisualSchedule;
	}

	public String getMonthVisualSchedule() {
		return this.monthVisualSchedule;
	}

	public void setMonthVisualSchedule(String monthVisualSchedule) {
		this.monthVisualSchedule = monthVisualSchedule;
	}

	public Double getLastMonthCopmpTotal() {
		return this.lastMonthCopmpTotal;
	}

	public void setLastMonthCopmpTotal(Double lastMonthCopmpTotal) {
		this.lastMonthCopmpTotal = lastMonthCopmpTotal;
	}

	public Double getLastMonthCopmpJz() {
		return this.lastMonthCopmpJz;
	}

	public void setLastMonthCopmpJz(Double lastMonthCopmpJz) {
		this.lastMonthCopmpJz = lastMonthCopmpJz;
	}

	public Double getLastMonthCopmpSb() {
		return this.lastMonthCopmpSb;
	}

	public void setLastMonthCopmpSb(Double lastMonthCopmpSb) {
		this.lastMonthCopmpSb = lastMonthCopmpSb;
	}

	public Double getLastMonthCopmpAz() {
		return this.lastMonthCopmpAz;
	}

	public void setLastMonthCopmpAz(Double lastMonthCopmpAz) {
		this.lastMonthCopmpAz = lastMonthCopmpAz;
	}

	public Double getLastMonthCopmpTd() {
		return this.lastMonthCopmpTd;
	}

	public void setLastMonthCopmpTd(Double lastMonthCopmpTd) {
		this.lastMonthCopmpTd = lastMonthCopmpTd;
	}

	public Double getLastMonthCopmpSj() {
		return this.lastMonthCopmpSj;
	}

	public void setLastMonthCopmpSj(Double lastMonthCopmpSj) {
		this.lastMonthCopmpSj = lastMonthCopmpSj;
	}

	public Double getLastMonthCopmpQt() {
		return this.lastMonthCopmpQt;
	}

	public void setLastMonthCopmpQt(Double lastMonthCopmpQt) {
		this.lastMonthCopmpQt = lastMonthCopmpQt;
	}

	public Double getLastMonthCopmpPay() {
		return this.lastMonthCopmpPay;
	}

	public void setLastMonthCopmpPay(Double lastMonthCopmpPay) {
		this.lastMonthCopmpPay = lastMonthCopmpPay;
	}

	public Double getLastMonthCopmpIn() {
		return this.lastMonthCopmpIn;
	}

	public void setLastMonthCopmpIn(Double lastMonthCopmpIn) {
		this.lastMonthCopmpIn = lastMonthCopmpIn;
	}

	public Double getLastMonthCopmpBal() {
		return this.lastMonthCopmpBal;
	}

	public void setLastMonthCopmpBal(Double lastMonthCopmpBal) {
		this.lastMonthCopmpBal = lastMonthCopmpBal;
	}

}