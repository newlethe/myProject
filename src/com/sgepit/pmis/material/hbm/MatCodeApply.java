package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatCodeApply entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatCodeApply implements java.io.Serializable {

	// Fields

	private String uuid;
	private String applyNo;
	private String catname;
	private String enName;
	private String spec;
	private String unit;
	private Double price;
	private String appDept;
	private String appMan;
	private Date appDate;
	private String acceptMan;
	
	private String appState;
	private String approveOpin;
	private String approveExplain;
	private String remark;
	
	private String frameId;
	private String catNo;
	private String warehouse;
	private String wareNo;

	// Constructors

	/** default constructor */
	public MatCodeApply() {
	}

	/** full constructor */
	public MatCodeApply(String applyNo, String catname, String enName,
			String spec, String unit, Double price, String appDept,
			String appMan, Date appDate, String appState, String acceptMan,
			String approveOpin, String approveExplain, String remark,
			String frameId, String catNo, String warehouse, String wareNo) {
		this.applyNo = applyNo;
		this.catname = catname;
		this.enName = enName;
		this.spec = spec;
		this.unit = unit;
		this.price = price;
		this.appDept = appDept;
		this.appMan = appMan;
		this.appDate = appDate;
		this.appState = appState;
		this.acceptMan = acceptMan;
		this.approveOpin = approveOpin;
		this.approveExplain = approveExplain;
		this.remark = remark;
		this.frameId = frameId;
		this.catNo = catNo;
		this.warehouse = warehouse;
		this.wareNo = wareNo;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getApplyNo() {
		return this.applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}

	public String getCatname() {
		return this.catname;
	}

	public void setCatname(String catname) {
		this.catname = catname;
	}

	public String getEnName() {
		return this.enName;
	}

	public void setEnName(String enName) {
		this.enName = enName;
	}

	public String getSpec() {
		return this.spec;
	}

	public void setSpec(String spec) {
		this.spec = spec;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getPrice() {
		return this.price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getAppDept() {
		return this.appDept;
	}

	public void setAppDept(String appDept) {
		this.appDept = appDept;
	}

	public String getAppMan() {
		return this.appMan;
	}

	public void setAppMan(String appMan) {
		this.appMan = appMan;
	}

	public Date getAppDate() {
		return this.appDate;
	}

	public void setAppDate(Date appDate) {
		this.appDate = appDate;
	}

	public String getAppState() {
		return this.appState;
	}

	public void setAppState(String appState) {
		this.appState = appState;
	}

	public String getAcceptMan() {
		return this.acceptMan;
	}

	public void setAcceptMan(String acceptMan) {
		this.acceptMan = acceptMan;
	}

	public String getApproveOpin() {
		return this.approveOpin;
	}

	public void setApproveOpin(String approveOpin) {
		this.approveOpin = approveOpin;
	}

	public String getApproveExplain() {
		return this.approveExplain;
	}

	public void setApproveExplain(String approveExplain) {
		this.approveExplain = approveExplain;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getFrameId() {
		return this.frameId;
	}

	public void setFrameId(String frameId) {
		this.frameId = frameId;
	}

	public String getCatNo() {
		return this.catNo;
	}

	public void setCatNo(String catNo) {
		this.catNo = catNo;
	}

	public String getWarehouse() {
		return this.warehouse;
	}

	public void setWarehouse(String warehouse) {
		this.warehouse = warehouse;
	}

	public String getWareNo() {
		return this.wareNo;
	}

	public void setWareNo(String wareNo) {
		this.wareNo = wareNo;
	}

}