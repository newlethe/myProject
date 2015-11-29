package com.sgepit.pcmis.tzgl.hbm;

import java.math.BigDecimal;

/**
 * VPcTzglMonthReport entity. @author MyEclipse Persistence Tools
 */

public class VPcTzglMonthReport implements java.io.Serializable {

	// Fields

	private String uids;
	private String sjType;
	private String unitId;
	private String zbSeqno;
	private String sjstr;
	private String unitname;
	private String buildNatureName;
	private String guiMoDw;
	private String memoC2;
	private Double zxBdg;
	private Double pfBdg;
	private Double totalComp;
	private BigDecimal planFundTotal;
	private Double monthComp;
	private Double yearComp;
	private Double totalIn;
	private Double yearIn;
	private Double monthIn;
	private Double totalOut;
	private Double yearOut;
	private Double monthOut;
	private String memo;
	private BigDecimal zjye;
	private String masterId;
	private String pid;
	private String unit2id;
	private String unit3id;
	private String state2;
	private String stateA;

	// Constructors

	/** default constructor */
	public VPcTzglMonthReport() {
	}

	/** full constructor */
	public VPcTzglMonthReport(String sjType, String unitId, String zbSeqno,
			String sjstr, String unitname, String buildNatureName,
			String guiMoDw, String memoC2, Double zxBdg, Double pfBdg,
			Double totalComp, BigDecimal planFundTotal, Double monthComp,
			Double yearComp, Double totalIn, Double yearIn, Double monthIn,
			Double totalOut, Double yearOut, Double monthOut, String memo,
			BigDecimal zjye, String masterId, String pid, String unit2id,
			String unit3id, String state2, String stateA) {
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
		this.sjstr = sjstr;
		this.unitname = unitname;
		this.buildNatureName = buildNatureName;
		this.guiMoDw = guiMoDw;
		this.memoC2 = memoC2;
		this.zxBdg = zxBdg;
		this.pfBdg = pfBdg;
		this.totalComp = totalComp;
		this.planFundTotal = planFundTotal;
		this.monthComp = monthComp;
		this.yearComp = yearComp;
		this.totalIn = totalIn;
		this.yearIn = yearIn;
		this.monthIn = monthIn;
		this.totalOut = totalOut;
		this.yearOut = yearOut;
		this.monthOut = monthOut;
		this.memo = memo;
		this.zjye = zjye;
		this.masterId = masterId;
		this.pid = pid;
		this.unit2id = unit2id;
		this.unit3id = unit3id;
		this.state2 = state2;
		this.stateA = stateA;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
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

	public String getSjstr() {
		return this.sjstr;
	}

	public void setSjstr(String sjstr) {
		this.sjstr = sjstr;
	}

	public String getUnitname() {
		return this.unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getBuildNatureName() {
		return this.buildNatureName;
	}

	public void setBuildNatureName(String buildNatureName) {
		this.buildNatureName = buildNatureName;
	}

	public String getGuiMoDw() {
		return this.guiMoDw;
	}

	public void setGuiMoDw(String guiMoDw) {
		this.guiMoDw = guiMoDw;
	}

	public String getMemoC2() {
		return this.memoC2;
	}

	public void setMemoC2(String memoC2) {
		this.memoC2 = memoC2;
	}

	public Double getZxBdg() {
		return this.zxBdg;
	}

	public void setZxBdg(Double zxBdg) {
		this.zxBdg = zxBdg;
	}

	public Double getPfBdg() {
		return this.pfBdg;
	}

	public void setPfBdg(Double pfBdg) {
		this.pfBdg = pfBdg;
	}

	public Double getTotalComp() {
		return this.totalComp;
	}

	public void setTotalComp(Double totalComp) {
		this.totalComp = totalComp;
	}

	public BigDecimal getPlanFundTotal() {
		return this.planFundTotal;
	}

	public void setPlanFundTotal(BigDecimal planFundTotal) {
		this.planFundTotal = planFundTotal;
	}

	public Double getMonthComp() {
		return this.monthComp;
	}

	public void setMonthComp(Double monthComp) {
		this.monthComp = monthComp;
	}

	public Double getYearComp() {
		return this.yearComp;
	}

	public void setYearComp(Double yearComp) {
		this.yearComp = yearComp;
	}

	public Double getTotalIn() {
		return this.totalIn;
	}

	public void setTotalIn(Double totalIn) {
		this.totalIn = totalIn;
	}

	public Double getYearIn() {
		return this.yearIn;
	}

	public void setYearIn(Double yearIn) {
		this.yearIn = yearIn;
	}

	public Double getMonthIn() {
		return this.monthIn;
	}

	public void setMonthIn(Double monthIn) {
		this.monthIn = monthIn;
	}

	public Double getTotalOut() {
		return this.totalOut;
	}

	public void setTotalOut(Double totalOut) {
		this.totalOut = totalOut;
	}

	public Double getYearOut() {
		return this.yearOut;
	}

	public void setYearOut(Double yearOut) {
		this.yearOut = yearOut;
	}

	public Double getMonthOut() {
		return this.monthOut;
	}

	public void setMonthOut(Double monthOut) {
		this.monthOut = monthOut;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public BigDecimal getZjye() {
		return this.zjye;
	}

	public void setZjye(BigDecimal zjye) {
		this.zjye = zjye;
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

	public String getUnit2id() {
		return this.unit2id;
	}

	public void setUnit2id(String unit2id) {
		this.unit2id = unit2id;
	}

	public String getUnit3id() {
		return this.unit3id;
	}

	public void setUnit3id(String unit3id) {
		this.unit3id = unit3id;
	}

	public String getState2() {
		return this.state2;
	}

	public void setState2(String state2) {
		this.state2 = state2;
	}

	public String getStateA() {
		return this.stateA;
	}

	public void setStateA(String stateA) {
		this.stateA = stateA;
	}

}