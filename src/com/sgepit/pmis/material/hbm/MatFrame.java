package com.sgepit.pmis.material.hbm;

/**
 * MatFrame entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatFrame implements java.io.Serializable {

	// Fields

	private String uuid;
	private String pid;
	private String catNo;
	private String catName;
	private String spec;
	private String warehouse;
	private String unit;
	private Double price;
	private String enName;
	private Long isleaf;
	private String parent;
	private String wareNo;
	private String remark;
	private String appid;
	private String material;

	// Constructors

	/** default constructor */
	public MatFrame() {
	}

	/** full constructor */
	public MatFrame(String pid, String catNo, String catName, String spec,
			String warehouse, String unit, Double price, String enName,
			Long isleaf, String parent, String wareNo, String remark,
			String appid, String material) {
		this.pid = pid;
		this.catNo = catNo;
		this.catName = catName;
		this.spec = spec;
		this.warehouse = warehouse;
		this.unit = unit;
		this.price = price;
		this.enName = enName;
		this.isleaf = isleaf;
		this.parent = parent;
		this.wareNo = wareNo;
		this.remark = remark;
		this.appid = appid;
		this.material = material;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
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

	public String getWarehouse() {
		return this.warehouse;
	}

	public void setWarehouse(String warehouse) {
		this.warehouse = warehouse;
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

	public String getEnName() {
		return this.enName;
	}

	public void setEnName(String enName) {
		this.enName = enName;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getWareNo() {
		return this.wareNo;
	}

	public void setWareNo(String wareNo) {
		this.wareNo = wareNo;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getAppid() {
		return this.appid;
	}

	public void setAppid(String appid) {
		this.appid = appid;
	}

	public String getMaterial() {
		return this.material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

}