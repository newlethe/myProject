package com.sgepit.pmis.finalAccounts.interfaces.vo;

import java.util.Date;


/**
 * 物资出库单
 * @author Ivy
 * @createDate 2011-3-10
 * 
 */
public class MatStockOutVO{
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
	 *	 申请部门；
	 */
	private String applyUnit;
	
	/*
	 *	 领用人；
	 */
	private String applyUser;
	
	/*
	 *	申请领用时间； 
	 */
	private Date applyTime;
	
	/*
	 *	 单据的审批状态；
	 */
	private String state;

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

	public String getApplyUnit() {
		return applyUnit;
	}

	public void setApplyUnit(String applyUnit) {
		this.applyUnit = applyUnit;
	}

	public String getApplyUser() {
		return applyUser;
	}

	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
	}

	public Date getApplyTime() {
		return applyTime;
	}

	public void setApplyTime(Date applyTime) {
		this.applyTime = applyTime;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
	
}