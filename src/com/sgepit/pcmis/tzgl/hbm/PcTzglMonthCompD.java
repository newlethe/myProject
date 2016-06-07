package com.sgepit.pcmis.tzgl.hbm;

/**
 * PcTzglMonthCompD entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcTzglMonthCompD implements java.io.Serializable {

	// Fields

	private String uids;
	private String masterId;
	private String pid;
	private String sjType;
	private String unitId;
	private String zbSeqno;
	private Double yearPlanInves;
	private Double monthCompBuild;
	private Double monthCompEquip;
	private Double monthCompInstall;
	private Double monthCompOther;
	private Double yearPlanFullFunded;
	private Double monthFullFunded;
	private String progressObjective;
	private String memo;
	private Double totalInvest;

	// Constructors

	/** default constructor */
	public PcTzglMonthCompD() {
	}

	/** full constructor */
	public PcTzglMonthCompD(String masterId, String pid, String sjType,
			String unitId, String zbSeqno, Double yearPlanInves,
			Double monthCompBuild, Double monthCompEquip,
			Double monthCompInstall, Double monthCompOther,
			Double yearPlanFullFunded, Double monthFullFunded,
			String progressObjective, String memo, Double totalInvest) {
		this.masterId = masterId;
		this.pid = pid;
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
		this.yearPlanInves = yearPlanInves;
		this.monthCompBuild = monthCompBuild;
		this.monthCompEquip = monthCompEquip;
		this.monthCompInstall = monthCompInstall;
		this.monthCompOther = monthCompOther;
		this.yearPlanFullFunded = yearPlanFullFunded;
		this.monthFullFunded = monthFullFunded;
		this.progressObjective = progressObjective;
		this.memo = memo;
		this.totalInvest = totalInvest;
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

	public Double getYearPlanInves() {
		return this.yearPlanInves;
	}

	public void setYearPlanInves(Double yearPlanInves) {
		this.yearPlanInves = yearPlanInves;
	}

	public Double getMonthCompBuild() {
		return this.monthCompBuild;
	}

	public void setMonthCompBuild(Double monthCompBuild) {
		this.monthCompBuild = monthCompBuild;
	}

	public Double getMonthCompEquip() {
		return this.monthCompEquip;
	}

	public void setMonthCompEquip(Double monthCompEquip) {
		this.monthCompEquip = monthCompEquip;
	}

	public Double getMonthCompInstall() {
		return this.monthCompInstall;
	}

	public void setMonthCompInstall(Double monthCompInstall) {
		this.monthCompInstall = monthCompInstall;
	}

	public Double getMonthCompOther() {
		return this.monthCompOther;
	}

	public void setMonthCompOther(Double monthCompOther) {
		this.monthCompOther = monthCompOther;
	}

	public Double getYearPlanFullFunded() {
		return this.yearPlanFullFunded;
	}

	public void setYearPlanFullFunded(Double yearPlanFullFunded) {
		this.yearPlanFullFunded = yearPlanFullFunded;
	}

	public Double getMonthFullFunded() {
		return this.monthFullFunded;
	}

	public void setMonthFullFunded(Double monthFullFunded) {
		this.monthFullFunded = monthFullFunded;
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

	public Double getTotalInvest() {
		return this.totalInvest;
	}

	public void setTotalInvest(Double totalInvest) {
		this.totalInvest = totalInvest;
	}

}