package com.sgepit.pmis.finalAccounts.interfaces.vo;

import java.math.BigDecimal;
import java.util.Date;


/**
 * 设备出库信息
 * @author Ivy
 * @createDate 2011-3-10
 * 
 */
/**
 * @author Ivy
 * @createDate 2011-3-22
 * 
 */
public class EquStockOutDetailVO{
	
	private String pid;
	
	/*
	 *	 设备合同编码
	 */
	private String conid;
	
	/*
	 *	设备出库单系统编码（主键） 
	 */
	private String outid;
	
	/*
	 *	设备出库单编号 
	 */
	private String outno;
	
	/*
	 *	 出库状态
	 */
	private String outState;
	
	/*
	 *	申请人 
	 */
	private String applyUser;
	
	/*
	 *	出库日期	 
	 */
	private Date outDate;
	
	/*
	 *	出库设备主键 
	 */
	private String equId;
	
	/*
	 *	设备编码 
	 */
	private String equCode;
	
	/*
	 *	 设备名称
	 */
	private String equName;
	
	/*
	 *	 规格型号
	 */
	private String equSpec;
	
	/*
	 *	 计量单位
	 */
	private String equUnit;
	
	/*
	 *	设备单价 
	 */
	private BigDecimal equPrice;
	
	/*
	 *	 生产厂家
	 */
	private String equSupplyunit;
	
	/*
	 *	 设备安装位置；
	 */
	private String equLocation;
	
	/*
	 *	 出库数量
	 */
	private BigDecimal equNum;
	
	/*
	 *	 出库设备总价
	 */
	private BigDecimal equAmount;
	
	/*
	 *	 主设备价值
	 */
	private BigDecimal equMainAmount;
	
	/*
	 *	附属设备价值 
	 */
	private BigDecimal equSubAmount;
	
	/*
	 *	 设备基座价值
	 */
	private BigDecimal equBaseAmount;
	
	/*
	 *	设备安装费	 
	 */
	private BigDecimal equInstallAmount;
	
	/*
	 *	其他费用 
	 */
	private BigDecimal equOtherAmount;
	
	/*
	 *	 设备移交资产价值；
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
	 *	设备所关联的概算编号 
	 */
	private String bdgid;
	
	/*
	 *	合并稽核时，是否主建筑 
	 */
	private String mainFlag;

	public String getMainFlag() {
		return mainFlag;
	}

	public void setMainFlag(String mainFlag) {
		this.mainFlag = mainFlag;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getOutid() {
		return outid;
	}

	public void setOutid(String outid) {
		this.outid = outid;
	}

	public String getOutno() {
		return outno;
	}

	public void setOutno(String outno) {
		this.outno = outno;
	}

	public String getOutState() {
		return outState;
	}

	public void setOutState(String outState) {
		this.outState = outState;
	}

	public String getApplyUser() {
		return applyUser;
	}

	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
	}

	public Date getOutDate() {
		return outDate;
	}

	public void setOutDate(Date outDate) {
		this.outDate = outDate;
	}

	public String getEquId() {
		return equId;
	}

	public void setEquId(String equId) {
		this.equId = equId;
	}

	public String getEquCode() {
		return equCode;
	}

	public void setEquCode(String equCode) {
		this.equCode = equCode;
	}

	public String getEquName() {
		return equName;
	}

	public void setEquName(String equName) {
		this.equName = equName;
	}

	public String getEquSpec() {
		return equSpec;
	}

	public void setEquSpec(String equSpec) {
		this.equSpec = equSpec;
	}

	public String getEquUnit() {
		return equUnit;
	}

	public void setEquUnit(String equUnit) {
		this.equUnit = equUnit;
	}

	public String getEquSupplyunit() {
		return equSupplyunit;
	}

	public void setEquSupplyunit(String equSupplyunit) {
		this.equSupplyunit = equSupplyunit;
	}

	public BigDecimal getEquPrice() {
		return equPrice;
	}

	public void setEquPrice(BigDecimal equPrice) {
		this.equPrice = equPrice;
	}

	public BigDecimal getEquNum() {
		return equNum;
	}

	public void setEquNum(BigDecimal equNum) {
		this.equNum = equNum;
	}

	public BigDecimal getEquAmount() {
		return equAmount;
	}

	public void setEquAmount(BigDecimal equAmount) {
		this.equAmount = equAmount;
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

	public String getAuditId() {
		return auditId;
	}

	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}

	public String getEquLocation() {
		return equLocation;
	}

	public void setEquLocation(String equLocation) {
		this.equLocation = equLocation;
	}

	public BigDecimal getEquMainAmount() {
		return equMainAmount;
	}

	public void setEquMainAmount(BigDecimal equMainAmount) {
		this.equMainAmount = equMainAmount;
	}

	public BigDecimal getEquSubAmount() {
		return equSubAmount;
	}

	public void setEquSubAmount(BigDecimal equSubAmount) {
		this.equSubAmount = equSubAmount;
	}

	public BigDecimal getEquBaseAmount() {
		return equBaseAmount;
	}

	public void setEquBaseAmount(BigDecimal equBaseAmount) {
		this.equBaseAmount = equBaseAmount;
	}

	public BigDecimal getEquInstallAmount() {
		return equInstallAmount;
	}

	public void setEquInstallAmount(BigDecimal equInstallAmount) {
		this.equInstallAmount = equInstallAmount;
	}

	public BigDecimal getEquOtherAmount() {
		return equOtherAmount;
	}

	public void setEquOtherAmount(BigDecimal equOtherAmount) {
		this.equOtherAmount = equOtherAmount;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getBdgid() {
		return bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

}