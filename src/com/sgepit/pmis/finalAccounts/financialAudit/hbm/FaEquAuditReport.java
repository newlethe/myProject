package com.sgepit.pmis.finalAccounts.financialAudit.hbm;

import java.math.BigDecimal;

/**
 * FaEquAuditList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FaEquAuditReport extends FaAuditReport implements java.io.Serializable {

	// Fields

	private String equId;
	private String bdgid;
	private String equName;
	private String equSpec;
	private String equSupplyunit;
	private String equLocation;
	private String unit;
	private BigDecimal num;
	private BigDecimal equAmount;
	private BigDecimal equMainAmount;
	private BigDecimal equSubAmount;
	private BigDecimal equBaseAmount;
	private BigDecimal equInstallAmount;
	private BigDecimal equOtherAmount;
	private BigDecimal amount;
	private String mainFlag;
	
	// Constructors
	/** default constructor */
	public FaEquAuditReport() {
	}

	/** minimal constructor */
	public FaEquAuditReport(String uids, String pid, String equId) {
		this.uids = uids;
		this.pid = pid;
		this.equId = equId;
	}

	/** full constructor */
	public FaEquAuditReport(String uids, String pid, String assetsNo,
			String equId, String auditId, String equName, String equSpec,
			String equSupplyunit, String equLocation, String unit, BigDecimal num,
			BigDecimal equAmount, BigDecimal equSubAmount, BigDecimal equBaseAmount,
			BigDecimal equInstallAmount, BigDecimal equOtherAmount, BigDecimal amount,
			String remark, String mainFlag) {
		this.uids = uids;
		this.pid = pid;
		this.assetsNo = assetsNo;
		this.equId = equId;
		this.auditId = auditId;
		this.equName = equName;
		this.equSpec = equSpec;
		this.equSupplyunit = equSupplyunit;
		this.equLocation = equLocation;
		this.unit = unit;
		this.num = num;
		this.equAmount = equAmount;
		this.equSubAmount = equSubAmount;
		this.equBaseAmount = equBaseAmount;
		this.equInstallAmount = equInstallAmount;
		this.equOtherAmount = equOtherAmount;
		this.amount = amount;
		this.remark = remark;
		this.mainFlag = mainFlag;
	}

	// Property accessors

	public String getEquId() {
		return this.equId;
	}

	public void setEquId(String equId) {
		this.equId = equId;
	}

	public String getEquName() {
		return this.equName;
	}

	public void setEquName(String equName) {
		this.equName = equName;
	}

	public String getEquSpec() {
		return this.equSpec;
	}

	public void setEquSpec(String equSpec) {
		this.equSpec = equSpec;
	}

	public String getEquSupplyunit() {
		return this.equSupplyunit;
	}

	public void setEquSupplyunit(String equSupplyunit) {
		this.equSupplyunit = equSupplyunit;
	}

	public String getEquLocation() {
		return this.equLocation;
	}

	public void setEquLocation(String equLocation) {
		this.equLocation = equLocation;
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

	public BigDecimal getEquAmount() {
		return this.equAmount;
	}

	public void setEquAmount(BigDecimal equAmount) {
		this.equAmount = equAmount;
	}

	public BigDecimal getEquSubAmount() {
		return this.equSubAmount;
	}

	public void setEquSubAmount(BigDecimal equSubAmount) {
		this.equSubAmount = equSubAmount;
	}

	public BigDecimal getEquBaseAmount() {
		return this.equBaseAmount;
	}

	public void setEquBaseAmount(BigDecimal equBaseAmount) {
		this.equBaseAmount = equBaseAmount;
	}

	public BigDecimal getEquInstallAmount() {
		return this.equInstallAmount;
	}

	public void setEquInstallAmount(BigDecimal equInstallAmount) {
		this.equInstallAmount = equInstallAmount;
	}

	public BigDecimal getEquOtherAmount() {
		return this.equOtherAmount;
	}

	public void setEquOtherAmount(BigDecimal equOtherAmount) {
		this.equOtherAmount = equOtherAmount;
	}

	public BigDecimal getAmount() {
		return this.amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public BigDecimal getEquMainAmount() {
		return equMainAmount;
	}

	public void setEquMainAmount(BigDecimal equMainAmount) {
		this.equMainAmount = equMainAmount;
	}

	public String getBdgid() {
		return bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getMainFlag() {
		return mainFlag;
	}

	public void setMainFlag(String mainFlag) {
		this.mainFlag = mainFlag;
	}

}