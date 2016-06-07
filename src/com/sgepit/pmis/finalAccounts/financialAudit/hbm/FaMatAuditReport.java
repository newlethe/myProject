package com.sgepit.pmis.finalAccounts.financialAudit.hbm;

import java.math.BigDecimal;

/**
 * FaMatAuditList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FaMatAuditReport extends FaAuditReport implements java.io.Serializable {

	// Fields
	private String matId;
	private String matName;
	private String matSpec;
	private String matSupplyunit;
	private String unit;
	private BigDecimal numA;
	private BigDecimal amountA;
	private BigDecimal numF;
	private BigDecimal amountF;
	private String matUser;
	private BigDecimal finOAmount;
	private BigDecimal finDepAmount;
	private BigDecimal finFixedAmount;
	private BigDecimal finCurrentAmount;
	private String auditId;
	private String budgetId;
	private String uids;
	private String pid;
	private String assetsNo;
	private String mainFlag;
	private String remark;

	// Constructors

	/** default constructor */
	public FaMatAuditReport() {
	}

	/** minimal constructor */
	public FaMatAuditReport(String uids, String pid, String matId) {
		this.uids = uids;
		this.pid = pid;
		this.matId = matId;
	}

	/** full constructor */
	public FaMatAuditReport(String uids, String pid, String assetsNo,
			String matId, String auditId, String matName, String matSpec,
			String matSupplyunit, String unit, BigDecimal numA, String matUser,
			String remark,String mainFlag ,String budgetId) {
		this.uids = uids;
		this.pid = pid;
		this.assetsNo = assetsNo;
		this.matId = matId;
		this.auditId = auditId;
		this.matName = matName;
		this.matSpec = matSpec;
		this.matSupplyunit = matSupplyunit;
		this.unit = unit;
		this.numA = numA;
		this.matUser = matUser;
		this.remark = remark;
		this.budgetId = budgetId;
		this.mainFlag = mainFlag;
	}

	// Property accessors

	public String getMatId() {
		return this.matId;
	}

	public void setMatId(String matId) {
		this.matId = matId;
	}

	public String getMatName() {
		return this.matName;
	}

	public void setMatName(String matName) {
		this.matName = matName;
	}

	public String getMatSpec() {
		return this.matSpec;
	}

	public void setMatSpec(String matSpec) {
		this.matSpec = matSpec;
	}

	public String getMatSupplyunit() {
		return this.matSupplyunit;
	}

	public void setMatSupplyunit(String matSupplyunit) {
		this.matSupplyunit = matSupplyunit;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public BigDecimal getNumA() {
		return numA;
	}

	public void setNumA(BigDecimal numA) {
		this.numA = numA;
	}

	public BigDecimal getAmountA() {
		return amountA;
	}

	public void setAmountA(BigDecimal amountA) {
		this.amountA = amountA;
	}

	public BigDecimal getNumF() {
		return numF;
	}

	public void setNumF(BigDecimal numF) {
		this.numF = numF;
	}

	public BigDecimal getAmountF() {
		return amountF;
	}

	public void setAmountF(BigDecimal amountF) {
		this.amountF = amountF;
	}

	public String getMatUser() {
		return matUser;
	}

	public void setMatUser(String matUser) {
		this.matUser = matUser;
	}

	public BigDecimal getFinOAmount() {
		return finOAmount;
	}

	public void setFinOAmount(BigDecimal finOAmount) {
		this.finOAmount = finOAmount;
	}

	public BigDecimal getFinDepAmount() {
		return finDepAmount;
	}

	public void setFinDepAmount(BigDecimal finDepAmount) {
		this.finDepAmount = finDepAmount;
	}

	public BigDecimal getFinFixedAmount() {
		return finFixedAmount;
	}

	public void setFinFixedAmount(BigDecimal finFixedAmount) {
		this.finFixedAmount = finFixedAmount;
	}

	public BigDecimal getFinCurrentAmount() {
		return finCurrentAmount;
	}

	public void setFinCurrentAmount(BigDecimal finCurrentAmount) {
		this.finCurrentAmount = finCurrentAmount;
	}

	public String getAuditId() {
		return auditId;
	}

	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}

	public String getBudgetId() {
		return budgetId;
	}

	public void setBudgetId(String budgetId) {
		this.budgetId = budgetId;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getAssetsNo() {
		return assetsNo;
	}

	public void setAssetsNo(String assetsNo) {
		this.assetsNo = assetsNo;
	}

	public String getMainFlag() {
		return mainFlag;
	}

	public void setMainFlag(String mainFlag) {
		this.mainFlag = mainFlag;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}