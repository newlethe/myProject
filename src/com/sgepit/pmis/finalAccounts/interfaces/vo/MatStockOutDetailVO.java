package com.sgepit.pmis.finalAccounts.interfaces.vo;

import java.math.BigDecimal;


/**
 * 物资出库单的出库物质
 * @author Ivy
 * @createDate 2011-3-10
 * 
 */
public class MatStockOutDetailVO{
	
	private String pid;
	
	/*
	 *	 出库单编号：【对于新密，出库和入库是一致的；国锦项目，计划内出库为申请计划编号，计划外领用为领料单编号】
	 */
	private String outNo;
	
	/*
	 *	出库单的系统编码； 
	 */
	private String outId;
	
	/*
	 *	出库类型： 1为计划内出库；2：计划外出库； 
	 */
	private String outType;
	
	/*
	 *	 物资的系统编码
	 */
	private String matId;
	
	/*
	 *	 物资编号
	 */
	private String matCode;
	
	/*
	 *	 物资名称
	 */
	private String matName;
	
	/*
	 *	 物资规格型号；
	 */
	private String matSpec;
	
	/*
	 *	 单位
	 */
	private String matUnit;
	
	/*
	 *	 实际领用物资数量
	 */
	private BigDecimal num;
	
	/*
	 *	 单价
	 */
	private BigDecimal matPrice;
	
	/*
	 *	 领用物资的实际总金额
	 */
	private BigDecimal amount;
	
	/*
	 *	使用单位 
	 */
	private String usingUnit;
	
	/*
	 *	领用人 
	 */
	private String usingUser;
	
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
	 * 交付使用资产价值-原值
	 */
	private BigDecimal finOAmount;
	
	/*
	 * 交付使用资产价值-折旧或摊销
	 */
	private BigDecimal finDepAmount;
	
	/*
	 * 属资产类别-固定资产
	 */
	private BigDecimal finFixedAmount;
	
	/*
	 * 属资产类别-流动资产
	 */
	private BigDecimal finCurrentAmount;
	
	/*
	 * 备注
	 */
	private String remark;
	
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

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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

	public String getOutNo() {
		return outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public String getOutId() {
		return outId;
	}

	public void setOutId(String outId) {
		this.outId = outId;
	}

	public String getOutType() {
		return outType;
	}

	public void setOutType(String outType) {
		this.outType = outType;
	}

	public String getMatId() {
		return matId;
	}

	public void setMatId(String matId) {
		this.matId = matId;
	}

	public String getMatCode() {
		return matCode;
	}

	public void setMatCode(String matCode) {
		this.matCode = matCode;
	}

	public String getMatName() {
		return matName;
	}

	public void setMatName(String matName) {
		this.matName = matName;
	}

	public String getMatSpec() {
		return matSpec;
	}

	public void setMatSpec(String matSpec) {
		this.matSpec = matSpec;
	}

	public String getMatUnit() {
		return matUnit;
	}

	public void setMatUnit(String matUnit) {
		this.matUnit = matUnit;
	}

	public BigDecimal getNum() {
		return num;
	}

	public void setNum(BigDecimal num) {
		this.num = num;
	}

	public BigDecimal getMatPrice() {
		return matPrice;
	}

	public void setMatPrice(BigDecimal matPrice) {
		this.matPrice = matPrice;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getUsingUnit() {
		return usingUnit;
	}

	public void setUsingUnit(String usingUnit) {
		this.usingUnit = usingUnit;
	}

	public String getUsingUser() {
		return usingUser;
	}

	public void setUsingUser(String usingUser) {
		this.usingUser = usingUser;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getAuditId() {
		return auditId;
	}

	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}
}