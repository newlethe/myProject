package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompOtherCostStatistics entity. @author MyEclipse Persistence Tools
 */

public class FacompOtherCostStatistics implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String treeid;
	private String remark;
	private String parentid;
	private Long isleaf;
	private String prono;
	private String proname;
	private Double bdgmoney;
	private Double investmentFinishMoney;
	private Double tjmoeny;
	private Double sbmoney;
	private Double ldmoney;
	private Double cqdtmoney;
	private Double wxmoney;
	private Double totalmoney;

	// Constructors

	/** default constructor */
	public FacompOtherCostStatistics() {
	}

	/** full constructor */
	public FacompOtherCostStatistics(String pid, String treeid, String remark,
			String parentid, Long isleaf, String prono, String proname,
			Double bdgmoney, Double investmentFinishMoney, Double tjmoeny,
			Double sbmoney, Double ldmoney, Double cqdtmoney, Double wxmoney,
			Double totalmoney) {
		this.pid = pid;
		this.treeid = treeid;
		this.remark = remark;
		this.parentid = parentid;
		this.isleaf = isleaf;
		this.prono = prono;
		this.proname = proname;
		this.bdgmoney = bdgmoney;
		this.investmentFinishMoney = investmentFinishMoney;
		this.tjmoeny = tjmoeny;
		this.sbmoney = sbmoney;
		this.ldmoney = ldmoney;
		this.cqdtmoney = cqdtmoney;
		this.wxmoney = wxmoney;
		this.totalmoney = totalmoney;
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

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getProno() {
		return this.prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

	public String getProname() {
		return this.proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

	public Double getBdgmoney() {
		return this.bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public Double getInvestmentFinishMoney() {
		return this.investmentFinishMoney;
	}

	public void setInvestmentFinishMoney(Double investmentFinishMoney) {
		this.investmentFinishMoney = investmentFinishMoney;
	}

	public Double getTjmoeny() {
		return this.tjmoeny;
	}

	public void setTjmoeny(Double tjmoeny) {
		this.tjmoeny = tjmoeny;
	}

	public Double getSbmoney() {
		return this.sbmoney;
	}

	public void setSbmoney(Double sbmoney) {
		this.sbmoney = sbmoney;
	}

	public Double getLdmoney() {
		return this.ldmoney;
	}

	public void setLdmoney(Double ldmoney) {
		this.ldmoney = ldmoney;
	}

	public Double getCqdtmoney() {
		return this.cqdtmoney;
	}

	public void setCqdtmoney(Double cqdtmoney) {
		this.cqdtmoney = cqdtmoney;
	}

	public Double getWxmoney() {
		return this.wxmoney;
	}

	public void setWxmoney(Double wxmoney) {
		this.wxmoney = wxmoney;
	}

	public Double getTotalmoney() {
		return this.totalmoney;
	}

	public void setTotalmoney(Double totalmoney) {
		this.totalmoney = totalmoney;
	}

}