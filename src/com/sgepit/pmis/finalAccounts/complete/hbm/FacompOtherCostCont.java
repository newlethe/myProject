package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompOtherCostCont entity. @author MyEclipse Persistence Tools
 */

public class FacompOtherCostCont implements java.io.Serializable {

	// Fields

	private String uids;
	private String conid;
	private String pid;
	private Double investmentFinishMoney;
	private Double costContMoney;
	private String contFormula;
	private Double alContMoney;
	private Double unContMoney;
	private String otherCostType;
	private String remark;
	private String contState;

	// Constructors

	/** default constructor */
	public FacompOtherCostCont() {
	}

	/** minimal constructor */
	public FacompOtherCostCont(String conid, String pid) {
		this.conid = conid;
		this.pid = pid;
	}

	/** full constructor */
	public FacompOtherCostCont(String conid, String pid, Double investmentFinishMoney, Double costContMoney,
			String contFormula, Double alContMoney, Double unContMoney,
			String otherCostType, String remark,String contState) {
		this.conid = conid;
		this.pid = pid;
		this.investmentFinishMoney = investmentFinishMoney;
		this.costContMoney = costContMoney;
		this.contFormula = contFormula;
		this.alContMoney = alContMoney;
		this.unContMoney = unContMoney;
		this.otherCostType = otherCostType;
		this.remark = remark;
		this.contState = contState;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}


	public Double getInvestmentFinishMoney() {
		return investmentFinishMoney;
	}

	public void setInvestmentFinishMoney(Double investmentFinishMoney) {
		this.investmentFinishMoney = investmentFinishMoney;
	}

	public Double getCostContMoney() {
		return this.costContMoney;
	}

	public void setCostContMoney(Double costContMoney) {
		this.costContMoney = costContMoney;
	}

	public String getContFormula() {
		return this.contFormula;
	}

	public void setContFormula(String contFormula) {
		this.contFormula = contFormula;
	}

	public Double getAlContMoney() {
		return this.alContMoney;
	}

	public void setAlContMoney(Double alContMoney) {
		this.alContMoney = alContMoney;
	}

	public Double getUnContMoney() {
		return this.unContMoney;
	}

	public void setUnContMoney(Double unContMoney) {
		this.unContMoney = unContMoney;
	}

	public String getOtherCostType() {
		return this.otherCostType;
	}

	public void setOtherCostType(String otherCostType) {
		this.otherCostType = otherCostType;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getContState() {
		return contState;
	}

	public void setContState(String contState) {
		this.contState = contState;
	}

}