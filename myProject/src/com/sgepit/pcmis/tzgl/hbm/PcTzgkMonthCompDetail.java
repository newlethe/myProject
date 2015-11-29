package com.sgepit.pcmis.tzgl.hbm;

/**
 * PcTzgkMonthCompDetail entity. @author MyEclipse Persistence Tools
 */

public class PcTzgkMonthCompDetail implements java.io.Serializable {

	// Fields

	private String uids;
	private String masterId;
	private String pid;
	private String sjType;
	private String unitId;
	private String zbSeqno;
	private Double zxBdg;
	private Double pfBdg;
	private Double totalComp;
	private Double monthComp;
	private Double yearComp;
	private Double totalIn;
	private Double yearIn;
	private Double monthIn;
	private Double totalOut;
	private Double yearOut;
	private Double monthOut;
	private String memo;

	// Constructors

	/** default constructor */
	public PcTzgkMonthCompDetail() {
	}

	/** minimal constructor */
	public PcTzgkMonthCompDetail(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public PcTzgkMonthCompDetail(String uids, String masterId, String pid,
			String sjType, String unitId, String zbSeqno, Double zxBdg,
			Double pfBdg, Double totalComp, Double monthComp, Double yearComp,
			Double totalIn, Double yearIn, Double monthIn, Double totalOut,
			Double yearOut, Double monthOut, String memo) {
		this.uids = uids;
		this.masterId = masterId;
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
		this.zxBdg = zxBdg;
		this.pfBdg = pfBdg;
		this.totalComp = totalComp;
		this.monthComp = monthComp;
		this.yearComp = yearComp;
		this.totalIn = totalIn;
		this.yearIn = yearIn;
		this.monthIn = monthIn;
		this.totalOut = totalOut;
		this.yearOut = yearOut;
		this.monthOut = monthOut;
		this.memo = memo;
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

	public String getZbSeqno() {
		return this.zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
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

}