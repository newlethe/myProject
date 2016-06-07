package com.sgepit.pmis.material.hbm;

/**
 * MatGoodsChecksub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatGoodsChecksub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String subNo;
	private String matid;
	private String catNo;
	private String catName;
	private String spec;
	private String material;
	private Double acceptNum;
	private Double realNum;
	private String factory;
	private String reportNo;
	private String report;
	private String duplicateNo;
	private String duplicate;
	private String record;
	private String remark;
	private String isIn;
	private String checkId;
	private String formId;

	// Constructors

	/** default constructor */
	public MatGoodsChecksub() {
	}

	/** full constructor */
	public MatGoodsChecksub(String subNo, String matid, String catNo,
			String catName, String spec, String material, Double acceptNum,
			Double realNum, String factory, String reportNo, String report,
			String duplicateNo, String duplicate, String record, String remark,
			String isIn, String checkId, String formId) {
		this.subNo = subNo;
		this.matid = matid;
		this.catNo = catNo;
		this.catName = catName;
		this.spec = spec;
		this.material = material;
		this.acceptNum = acceptNum;
		this.realNum = realNum;
		this.factory = factory;
		this.reportNo = reportNo;
		this.report = report;
		this.duplicateNo = duplicateNo;
		this.duplicate = duplicate;
		this.record = record;
		this.remark = remark;
		this.isIn = isIn;
		this.checkId = checkId;
		this.formId = formId;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getSubNo() {
		return this.subNo;
	}

	public void setSubNo(String subNo) {
		this.subNo = subNo;
	}

	public String getMatid() {
		return this.matid;
	}

	public void setMatid(String matid) {
		this.matid = matid;
	}

	public String getCatNo() {
		return this.catNo;
	}

	public void setCatNo(String catNo) {
		this.catNo = catNo;
	}

	public String getCatName() {
		return this.catName;
	}

	public void setCatName(String catName) {
		this.catName = catName;
	}

	public String getSpec() {
		return this.spec;
	}

	public void setSpec(String spec) {
		this.spec = spec;
	}

	public String getMaterial() {
		return this.material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

	public Double getAcceptNum() {
		return this.acceptNum;
	}

	public void setAcceptNum(Double acceptNum) {
		this.acceptNum = acceptNum;
	}

	public Double getRealNum() {
		return this.realNum;
	}

	public void setRealNum(Double realNum) {
		this.realNum = realNum;
	}

	public String getFactory() {
		return this.factory;
	}

	public void setFactory(String factory) {
		this.factory = factory;
	}

	public String getReportNo() {
		return this.reportNo;
	}

	public void setReportNo(String reportNo) {
		this.reportNo = reportNo;
	}

	public String getReport() {
		return this.report;
	}

	public void setReport(String report) {
		this.report = report;
	}

	public String getDuplicateNo() {
		return this.duplicateNo;
	}

	public void setDuplicateNo(String duplicateNo) {
		this.duplicateNo = duplicateNo;
	}

	public String getDuplicate() {
		return this.duplicate;
	}

	public void setDuplicate(String duplicate) {
		this.duplicate = duplicate;
	}

	public String getRecord() {
		return this.record;
	}

	public void setRecord(String record) {
		this.record = record;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getIsIn() {
		return this.isIn;
	}

	public void setIsIn(String isIn) {
		this.isIn = isIn;
	}

	public String getCheckId() {
		return this.checkId;
	}

	public void setCheckId(String checkId) {
		this.checkId = checkId;
	}

	public String getFormId() {
		return this.formId;
	}

	public void setFormId(String formId) {
		this.formId = formId;
	}

}