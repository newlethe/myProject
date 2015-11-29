package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompWxzcCqdtAsset entity. @author MyEclipse Persistence Tools
 */

public class FacompWxzcCqdtAsset implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String xh;
	private String fixedno;
	private String fixedname;
	private String typetreeid;
	private String remark;
	private String deliveryUnit;
	private String unit;
	private Double num;
	private Double money;
	private String conid;

	// Constructors

	/** default constructor */
	public FacompWxzcCqdtAsset() {
	}

	/** full constructor */
	public FacompWxzcCqdtAsset(String pid, String xh, String fixedno,
			String fixedname, String typetreeid, String remark,
			String deliveryUnit, String unit, Double num, Double money,
			String conid) {
		this.pid = pid;
		this.xh = xh;
		this.fixedno = fixedno;
		this.fixedname = fixedname;
		this.typetreeid = typetreeid;
		this.remark = remark;
		this.deliveryUnit = deliveryUnit;
		this.unit = unit;
		this.num = num;
		this.money = money;
		this.conid = conid;
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

	public String getXh() {
		return this.xh;
	}

	public void setXh(String xh) {
		this.xh = xh;
	}

	public String getFixedno() {
		return this.fixedno;
	}

	public void setFixedno(String fixedno) {
		this.fixedno = fixedno;
	}

	public String getFixedname() {
		return this.fixedname;
	}

	public void setFixedname(String fixedname) {
		this.fixedname = fixedname;
	}

	public String getTypetreeid() {
		return this.typetreeid;
	}

	public void setTypetreeid(String typetreeid) {
		this.typetreeid = typetreeid;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getDeliveryUnit() {
		return this.deliveryUnit;
	}

	public void setDeliveryUnit(String deliveryUnit) {
		this.deliveryUnit = deliveryUnit;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getNum() {
		return this.num;
	}

	public void setNum(Double num) {
		this.num = num;
	}

	public Double getMoney() {
		return this.money;
	}

	public void setMoney(Double money) {
		this.money = money;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

}