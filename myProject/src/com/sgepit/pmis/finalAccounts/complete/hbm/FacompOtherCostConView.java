package com.sgepit.pmis.finalAccounts.complete.hbm;


/**
 * FacompOtherCostConViewId entity. @author MyEclipse Persistence Tools
 */

public class FacompOtherCostConView implements java.io.Serializable {

	// Fields

	private String conid;
	private String pid;
	private String conno;
	private String conname;
	private String condivno;
	private Double convaluemoney;
	private String otherCostType;
	private String masterid;
	private String contState;
	private Double investmentFinishMoney;
	private Double costContMoney;
	private String remark;

	// Constructors

	/** default constructor */
	public FacompOtherCostConView() {
	}

	/** minimal constructor */
	public FacompOtherCostConView(String conid, String pid) {
		this.conid = conid;
		this.pid = pid;
	}

	/** full constructor */
	public FacompOtherCostConView(String conid, String pid, String conno,
			String conname, String condivno, 
			Double convaluemoney, String otherCostType, String masterid,
			String contState, Double investmentFinishMoney,
			Double costContMoney, String remark) {
		this.conid = conid;
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.condivno = condivno;
		this.convaluemoney = convaluemoney;
		this.otherCostType = otherCostType;
		this.masterid = masterid;
		this.contState = contState;
		this.investmentFinishMoney = investmentFinishMoney;
		this.costContMoney = costContMoney;
		this.remark = remark;
	}

	// Property accessors

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

	public String getConno() {
		return this.conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return this.conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getCondivno() {
		return this.condivno;
	}

	public void setCondivno(String condivno) {
		this.condivno = condivno;
	}

	public Double getConvaluemoney() {
		return this.convaluemoney;
	}

	public void setConvaluemoney(Double convaluemoney) {
		this.convaluemoney = convaluemoney;
	}

	public String getOtherCostType() {
		return this.otherCostType;
	}

	public void setOtherCostType(String otherCostType) {
		this.otherCostType = otherCostType;
	}

	

	public String getMasterid() {
		return masterid;
	}

	public void setMasterid(String masterid) {
		this.masterid = masterid;
	}

	public String getContState() {
		return this.contState;
	}

	public void setContState(String contState) {
		this.contState = contState;
	}

	public Double getInvestmentFinishMoney() {
		return this.investmentFinishMoney;
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

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
}