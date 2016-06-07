package com.sgepit.pmis.material.hbm;

/**
 * MatStoreInsub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatStoreInsub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String inId;
	private String appId;
	private String formId;
	private String goodsIn;
	private String matId;
	private String catNo;
	private String catName;
	private String spec;
	private String factory;
	private String material;
	private String unit;
	private Double price;
	private String warehouse;
	private String wareno;
	private Double inNum;
	private Double subSum;
	private String report;
	private String inType;
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public MatStoreInsub() {
	}

	/** full constructor */
	public MatStoreInsub(String inId, String appId, String formId,
			String goodsIn, String matId, String catNo, String catName,
			String spec, String factory, String material, String unit,
			Double price, String warehouse, String wareno, Double inNum,
			Double subSum, String report, String inType) {
		this.inId = inId;
		this.appId = appId;
		this.formId = formId;
		this.goodsIn = goodsIn;
		this.matId = matId;
		this.catNo = catNo;
		this.catName = catName;
		this.spec = spec;
		this.factory = factory;
		this.material = material;
		this.unit = unit;
		this.price = price;
		this.warehouse = warehouse;
		this.wareno = wareno;
		this.inNum = inNum;
		this.subSum = subSum;
		this.report = report;
		this.inType = inType;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getInId() {
		return this.inId;
	}

	public void setInId(String inId) {
		this.inId = inId;
	}

	public String getAppId() {
		return this.appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getFormId() {
		return this.formId;
	}

	public void setFormId(String formId) {
		this.formId = formId;
	}

	public String getGoodsIn() {
		return this.goodsIn;
	}

	public void setGoodsIn(String goodsIn) {
		this.goodsIn = goodsIn;
	}

	public String getMatId() {
		return this.matId;
	}

	public void setMatId(String matId) {
		this.matId = matId;
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

	public String getFactory() {
		return this.factory;
	}

	public void setFactory(String factory) {
		this.factory = factory;
	}

	public String getMaterial() {
		return this.material;
	}

	public void setMaterial(String material) {
		this.material = material;
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

	public String getWarehouse() {
		return this.warehouse;
	}

	public void setWarehouse(String warehouse) {
		this.warehouse = warehouse;
	}

	public String getWareno() {
		return this.wareno;
	}

	public void setWareno(String wareno) {
		this.wareno = wareno;
	}

	public Double getInNum() {
		return this.inNum;
	}

	public void setInNum(Double inNum) {
		this.inNum = inNum;
	}

	public Double getSubSum() {
		return this.subSum;
	}

	public void setSubSum(Double subSum) {
		this.subSum = subSum;
	}

	public String getReport() {
		return this.report;
	}

	public void setReport(String report) {
		this.report = report;
	}

	public String getInType() {
		return this.inType;
	}

	public void setInType(String inType) {
		this.inType = inType;
	}

}