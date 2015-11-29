package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatAppbuyMaterial entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatAppView implements java.io.Serializable {

	// Fields
	private String uuid;
	private String appid;
	private String matId;
	private String catNo;
	private String catName;
	private String spec;
	private String unit;
	private Double price;
	private Double takenum;
	private Double remain;
	

	
	public String getMatId() {
		return matId;
	}
	public void setMatId(String matId) {
		this.matId = matId;
	}
	public String getCatNo() {
		return catNo;
	}
	public void setCatNo(String catNo) {
		this.catNo = catNo;
	}
	public String getCatName() {
		return catName;
	}
	public void setCatName(String catName) {
		this.catName = catName;
	}
	public String getSpec() {
		return spec;
	}
	public void setSpec(String spec) {
		this.spec = spec;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	
	public String getAppid() {
		return appid;
	}
	public void setAppid(String appid) {
		this.appid = appid;
	}
	public Double getRemain() {
		return remain;
	}
	public void setRemain(Double remain) {
		this.remain = remain;
	}
	public Double getTakenum() {
		return takenum;
	}
	public void setTakenum(Double takenum) {
		this.takenum = takenum;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	

}