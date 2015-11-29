package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatAppbuyMaterial entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatAppbuyMaterial implements java.io.Serializable {

	// Fields

	private String uuid;
	private String matId;
	private String catNo;
	private String catName;
	private String spec;
	private String enName;
	private String unit;
	private Double price;
	private String material;
	private String warehouse;
	private String wareNo;
	private String remark;
	
	private String appid;
	private String appNo;
	private Double appNum;
	private Double sum;
	private Date appDate;
	
	private String buyId;
	private String buyNo;
	private Double buyNum;
	private String buyWay;
	private String formId;
	private String formNo;
	
	private Double storage;
	private String isBuy;
	private String isIn;
	

	// Constructors

	/** default constructor */
	public MatAppbuyMaterial() {
	}

	/** full constructor */
	public MatAppbuyMaterial(String appid, String appNo, String catNo,
			String catName, String spec, String enName, String unit,
			Double price, Double appNum, Double sum, String material,
			String warehouse, String wareNo, Date appDate, String remark,
			Double storage, String isBuy, String isIn, String buyId,
			String buyNo, Double buyNum, String buyWay, String formId,
			String formNo, String matId) {
		this.appid = appid;
		this.appNo = appNo;
		this.catNo = catNo;
		this.catName = catName;
		this.spec = spec;
		this.enName = enName;
		this.unit = unit;
		this.price = price;
		this.appNum = appNum;
		this.sum = sum;
		this.material = material;
		this.warehouse = warehouse;
		this.wareNo = wareNo;
		this.appDate = appDate;
		this.remark = remark;
		this.storage = storage;
		this.isBuy = isBuy;
		this.isIn = isIn;
		this.buyId = buyId;
		this.buyNo = buyNo;
		this.buyNum = buyNum;
		this.buyWay = buyWay;
		this.formId = formId;
		this.formNo = formNo;
		this.matId = matId;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getAppid() {
		return this.appid;
	}

	public void setAppid(String appid) {
		this.appid = appid;
	}

	public String getAppNo() {
		return this.appNo;
	}

	public void setAppNo(String appNo) {
		this.appNo = appNo;
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

	public String getEnName() {
		return this.enName;
	}

	public void setEnName(String enName) {
		this.enName = enName;
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

	public Double getAppNum() {
		return this.appNum;
	}

	public void setAppNum(Double appNum) {
		this.appNum = appNum;
	}

	public Double getSum() {
		return this.sum;
	}

	public void setSum(Double sum) {
		this.sum = sum;
	}

	public String getMaterial() {
		return this.material;
	}

	public void setMaterial(String material) {
		this.material = material;
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

	public Date getAppDate() {
		return this.appDate;
	}

	public void setAppDate(Date appDate) {
		this.appDate = appDate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Double getStorage() {
		return this.storage;
	}

	public void setStorage(Double storage) {
		this.storage = storage;
	}

	public String getIsBuy() {
		return this.isBuy;
	}

	public void setIsBuy(String isBuy) {
		this.isBuy = isBuy;
	}

	public String getIsIn() {
		return this.isIn;
	}

	public void setIsIn(String isIn) {
		this.isIn = isIn;
	}

	public String getBuyId() {
		return this.buyId;
	}

	public void setBuyId(String buyId) {
		this.buyId = buyId;
	}

	public String getBuyNo() {
		return this.buyNo;
	}

	public void setBuyNo(String buyNo) {
		this.buyNo = buyNo;
	}

	public Double getBuyNum() {
		return this.buyNum;
	}

	public void setBuyNum(Double buyNum) {
		this.buyNum = buyNum;
	}

	public String getBuyWay() {
		return this.buyWay;
	}

	public void setBuyWay(String buyWay) {
		this.buyWay = buyWay;
	}

	public String getFormId() {
		return this.formId;
	}

	public void setFormId(String formId) {
		this.formId = formId;
	}

	public String getFormNo() {
		return this.formNo;
	}

	public void setFormNo(String formNo) {
		this.formNo = formNo;
	}

	public String getMatId() {
		return this.matId;
	}

	public void setMatId(String matId) {
		this.matId = matId;
	}

}