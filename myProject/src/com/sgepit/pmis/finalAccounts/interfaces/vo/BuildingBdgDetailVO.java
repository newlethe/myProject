package com.sgepit.pmis.finalAccounts.interfaces.vo;

import java.math.BigDecimal;

/**
 * 房屋建筑物稽核信息
 * @author Ivy
 * @createDate 2011-3-10
 * 
 */
/**
 * @author Ivy
 * @createDate 2011-4-15
 * 
 */
public class BuildingBdgDetailVO{
	
	private String pid;
	
	/*
	 *	概算项目主键 
	 */
	private String bdgid;
	
	/*
	 *	概算项目编号 
	 */
	private String bdgno;
	
	/*
	 *	 概算项目名称
	 */
	private String bdgname;
	
	/*
	 *	 概算总金额
	 */
	private Double bdgmoney;
	
	/*
	 *	 分摊总金额
	 */
	private Double contmoney;
	
	/*
	 *	 规格型号
	 */
	private String buildingSpec;
	
	/*
	 *	所处位置； 
	 */
	private String buildingLocation;
	
	/*
	 *	 计量单位
	 */
	private String buildingUnit;
	
	/*
	 *	数量 
	 */
	private BigDecimal buildingNum;
	
	/*
	 *	 建筑费用
	 */
	private BigDecimal buildingAmount;
	/*
	 *	 建筑自身价值
	 */
	private BigDecimal buildingSelfAmount;
	
	/*
	 *	 摊入费用
	 */
	private BigDecimal apportionAmount;
	
	/*
	 *	 资产合计
	 */
	private BigDecimal amount;
	
	/*
	 *	 稽核主表的系统编号
	 */
	private String auditId;
	
	/*
	 *	稽核流水号 
	 */
	private String auditNo;
	
	/*
	 *	 稽核状态
	 */
	private String auditState;
	
	/*
	 *	合并稽核时，是否主建筑 
	 */
	private String mainFlag;

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBdgid() {
		return bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public Double getBdgmoney() {
		return bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public Double getContmoney() {
		return contmoney;
	}

	public void setContmoney(Double contmoney) {
		this.contmoney = contmoney;
	}

	public String getAuditId() {
		return auditId;
	}

	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}

	public String getAuditNo() {
		return auditNo;
	}

	public void setAuditNo(String auditNo) {
		this.auditNo = auditNo;
	}

	public String getAuditState() {
		return auditState;
	}

	public void setAuditState(String auditState) {
		this.auditState = auditState;
	}

	public String getBuildingSpec() {
		return buildingSpec;
	}

	public void setBuildingSpec(String buildingSpec) {
		this.buildingSpec = buildingSpec;
	}

	public String getBuildingLocation() {
		return buildingLocation;
	}

	public void setBuildingLocation(String buildingLocation) {
		this.buildingLocation = buildingLocation;
	}

	public String getBuildingUnit() {
		return buildingUnit;
	}

	public void setBuildingUnit(String buildingUnit) {
		this.buildingUnit = buildingUnit;
	}

	public BigDecimal getBuildingNum() {
		return buildingNum;
	}

	public void setBuildingNum(BigDecimal buildingNum) {
		this.buildingNum = buildingNum;
	}

	public BigDecimal getBuildingAmount() {
		return buildingAmount;
	}

	public void setBuildingAmount(BigDecimal buildingAmount) {
		this.buildingAmount = buildingAmount;
	}

	public BigDecimal getApportionAmount() {
		return apportionAmount;
	}

	public void setApportionAmount(BigDecimal apportionAmount) {
		this.apportionAmount = apportionAmount;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getMainFlag() {
		return mainFlag;
	}

	public void setMainFlag(String mainFlag) {
		this.mainFlag = mainFlag;
	}

	public BigDecimal getBuildingSelfAmount() {
		return buildingSelfAmount;
	}

	public void setBuildingSelfAmount(BigDecimal buildingSelfAmount) {
		this.buildingSelfAmount = buildingSelfAmount;
	}
	
	
}