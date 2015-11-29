package com.sgepit.pmis.finalAccounts.financialAudit.hbm;

import java.util.Date;

/**
 * FaAuditLog entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FaAuditLog implements java.io.Serializable {

	// Fields

	private String uids;
	private String auditId;
	private String businessType;
	private String operateType;
	private String oldAssetsNo;
	private String newAssetsNo;
	private String remark;
	private String operator;
	private Date operateTime;

	// Constructors

	/** default constructor */
	public FaAuditLog() {
	}

	/** minimal constructor */
	public FaAuditLog(String uids, String auditId, String businessType,
			String operateType) {
		this.uids = uids;
		this.auditId = auditId;
		this.businessType = businessType;
		this.operateType = operateType;
	}

	/** full constructor */
	public FaAuditLog(String uids, String auditId, String businessType,
			String operateType, String oldAssetsNo, String newAssetsNo,
			String remark, String operator, Date operateTime) {
		this.uids = uids;
		this.auditId = auditId;
		this.businessType = businessType;
		this.operateType = operateType;
		this.oldAssetsNo = oldAssetsNo;
		this.newAssetsNo = newAssetsNo;
		this.remark = remark;
		this.operator = operator;
		this.operateTime = operateTime;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getAuditId() {
		return this.auditId;
	}

	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}

	public String getBusinessType() {
		return this.businessType;
	}

	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}

	public String getOperateType() {
		return this.operateType;
	}

	public void setOperateType(String operateType) {
		this.operateType = operateType;
	}

	public String getOldAssetsNo() {
		return this.oldAssetsNo;
	}

	public void setOldAssetsNo(String oldAssetsNo) {
		this.oldAssetsNo = oldAssetsNo;
	}

	public String getNewAssetsNo() {
		return this.newAssetsNo;
	}

	public void setNewAssetsNo(String newAssetsNo) {
		this.newAssetsNo = newAssetsNo;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getOperator() {
		return this.operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public Date getOperateTime() {
		return this.operateTime;
	}

	public void setOperateTime(Date operateTime) {
		this.operateTime = operateTime;
	}

}