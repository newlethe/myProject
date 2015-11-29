package com.sgepit.pmis.finalAccounts.financialAudit.hbm;

import java.math.BigDecimal;

/**
 * FaBuildingAuditList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FaBuildingAuditReport extends FaAuditReport implements java.io.Serializable {

	// Fields

	private String budgetId;
	private String buildingName;
	private String buildingSpec;
	private String buildingLocation;
	private String unit;
	private BigDecimal num;
	/*
	 *	建筑自身价值 
	 */
	private BigDecimal buildingSelfAmount;
	private BigDecimal buildingAmount;
	private BigDecimal apportionAmount;
	private BigDecimal amount;

	// Constructors

	/** default constructor */
	public FaBuildingAuditReport() {
	}

	/** minimal constructor */
	public FaBuildingAuditReport(String uids, String pid, String budgetId) {
		this.uids = uids;
		this.pid = pid;
		this.budgetId = budgetId;
	}

	/** full constructor */
	public FaBuildingAuditReport(String uids, String pid, String assetsNo,
			String budgetId, String auditId, String buildingName,
			String buildingSpec, String buildingLocation, String unit,
			BigDecimal num, BigDecimal buildingAmount, BigDecimal apportionAmount,
			BigDecimal amount, String remark) {
		this.uids = uids;
		this.pid = pid;
		this.assetsNo = assetsNo;
		this.budgetId = budgetId;
		this.auditId = auditId;
		this.buildingName = buildingName;
		this.buildingSpec = buildingSpec;
		this.buildingLocation = buildingLocation;
		this.unit = unit;
		this.num = num;
		this.buildingAmount = buildingAmount;
		this.apportionAmount = apportionAmount;
		this.amount = amount;
		this.remark = remark;
	}

	// Property accessors

	public String getBudgetId() {
		return this.budgetId;
	}

	public void setBudgetId(String budgetId) {
		this.budgetId = budgetId;
	}

	public String getBuildingName() {
		return this.buildingName;
	}

	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}

	public String getBuildingSpec() {
		return this.buildingSpec;
	}

	public void setBuildingSpec(String buildingSpec) {
		this.buildingSpec = buildingSpec;
	}

	public String getBuildingLocation() {
		return this.buildingLocation;
	}

	public void setBuildingLocation(String buildingLocation) {
		this.buildingLocation = buildingLocation;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public BigDecimal getNum() {
		return this.num;
	}

	public void setNum(BigDecimal num) {
		this.num = num;
	}

	public BigDecimal getBuildingAmount() {
		return this.buildingAmount;
	}

	public void setBuildingAmount(BigDecimal buildingAmount) {
		this.buildingAmount = buildingAmount;
	}

	public BigDecimal getApportionAmount() {
		return this.apportionAmount;
	}

	public void setApportionAmount(BigDecimal apportionAmount) {
		this.apportionAmount = apportionAmount;
	}

	public BigDecimal getAmount() {
		return this.amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public BigDecimal getBuildingSelfAmount() {
		return buildingSelfAmount;
	}

	public void setBuildingSelfAmount(BigDecimal buildingSelfAmount) {
		this.buildingSelfAmount = buildingSelfAmount;
	}
}