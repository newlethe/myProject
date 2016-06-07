package com.sgepit.pmis.finalAccounts.financialAudit.hbm;

import java.util.Date;

import com.sgepit.pmis.finalAccounts.interfaces.vo.BuildingBdgDetailVO;
import com.sgepit.pmis.finalAccounts.interfaces.vo.EquStockOutDetailVO;
import com.sgepit.pmis.finalAccounts.interfaces.vo.MatStockOutDetailVO;

/**
 * FaAuditMaster entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FaAuditMaster implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String auditNo;
	private String businessType;
	private String sourceNo;
	private String objectId;
	private String mainId;
	private String remark;
	private String operator;
	private Date operateTime;
	private String state;
	
	/*
	 *	 批量稽核时、物资或设备编码
	 */
	private String objectIDs;
	
	/*
	 *	批量稽核时：出库单、或 
	 */
	private String sourceNos;
	
	private EquStockOutDetailVO[] equStockOutDetailVOArr;
	
	/*
	 *	房屋及建筑物稽核的明细信息； 
	 */
	private BuildingBdgDetailVO[] buildingBdgDetailVOArr;
	
	/*
	 *  资产稽核的明细信息
	 */
	private MatStockOutDetailVO[] matStockOutDetailVOArr;

	// Constructors

	public MatStockOutDetailVO[] getMatStockOutDetailVOArr() {
		return matStockOutDetailVOArr;
	}

	public void setMatStockOutDetailVOArr(
			MatStockOutDetailVO[] matStockOutDetailVOArr) {
		this.matStockOutDetailVOArr = matStockOutDetailVOArr;
	}

	/** default constructor */
	public FaAuditMaster() {
	}

	/** minimal constructor */
	public FaAuditMaster(String uids, String pid, String auditNo,
			String businessType, String objectId) {
		this.uids = uids;
		this.pid = pid;
		this.auditNo = auditNo;
		this.businessType = businessType;
		this.objectId = objectId;
	}

	/** full constructor */
	public FaAuditMaster(String uids, String pid, String auditNo,
			String businessType, String sourceNo, String objectId,
			String mainId, String remark, String operator, Date operateTime,
			String state) {
		this.uids = uids;
		this.pid = pid;
		this.auditNo = auditNo;
		this.businessType = businessType;
		this.sourceNo = sourceNo;
		this.objectId = objectId;
		this.mainId = mainId;
		this.remark = remark;
		this.operator = operator;
		this.operateTime = operateTime;
		this.state = state;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getAuditNo() {
		return this.auditNo;
	}

	public void setAuditNo(String auditNo) {
		this.auditNo = auditNo;
	}

	public String getBusinessType() {
		return this.businessType;
	}

	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}

	public String getSourceNo() {
		return this.sourceNo;
	}

	public void setSourceNo(String sourceNo) {
		this.sourceNo = sourceNo;
	}

	public String getObjectId() {
		return this.objectId;
	}

	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}

	public String getMainId() {
		return this.mainId;
	}

	public void setMainId(String mainId) {
		this.mainId = mainId;
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

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getObjectIDs() {
		return objectIDs;
	}

	public void setObjectIDs(String objectIDs) {
		this.objectIDs = objectIDs;
	}

	public String getSourceNos() {
		return sourceNos;
	}

	public void setSourceNos(String sourceNos) {
		this.sourceNos = sourceNos;
	}

	public EquStockOutDetailVO[] getEquStockOutDetailVOArr() {
		return equStockOutDetailVOArr;
	}

	public void setEquStockOutDetailVOArr(
			EquStockOutDetailVO[] equStockOutDetailVOArr) {
		this.equStockOutDetailVOArr = equStockOutDetailVOArr;
	}

	public BuildingBdgDetailVO[] getBuildingBdgDetailVOArr() {
		return buildingBdgDetailVOArr;
	}

	public void setBuildingBdgDetailVOArr(
			BuildingBdgDetailVO[] buildingBdgDetailVOArr) {
		this.buildingBdgDetailVOArr = buildingBdgDetailVOArr;
	}

}