package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsStockOutSub entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsInstallInfo implements java.io.Serializable {

	// Fields
	private String uids;
	private String pid;
	private String kks;
	private Date insDate;
	private String insSite;
	private Double insNumber;
	private String insCompany;
	private String insPrincipal;
	private String remark;
	private String stockOut;
	private String stockOutSub;
	// Constructors

	/** default constructor */
	public EquGoodsInstallInfo() {
	}

	/** minimal constructor */
	public EquGoodsInstallInfo(String uids, String kks, String stockOutSub,
			String stockOut, String pid) {
		super();
		this.uids = uids;
		this.kks = kks;
		this.stockOutSub = stockOutSub;
		this.stockOut = stockOut;
		this.pid = pid;
	}

	/** full constructor */
	public EquGoodsInstallInfo(String uids, String pid, String kks,
			Date insDate, String insSite, Double insNumber, String insCompany,
			String insPrincipal, String remark, String stockOut,
			String stockOutSub) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.kks = kks;
		this.insDate = insDate;
		this.insSite = insSite;
		this.insNumber = insNumber;
		this.insCompany = insCompany;
		this.insPrincipal = insPrincipal;
		this.remark = remark;
		this.stockOut = stockOut;
		this.stockOutSub = stockOutSub;
	}

	// Property accessors
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getKks() {
		return kks;
	}

	public void setKks(String kks) {
		this.kks = kks;
	}

	public Date getInsDate() {
		return insDate;
	}

	public void setInsDate(Date insDate) {
		this.insDate = insDate;
	}

	public String getInsSite() {
		return insSite;
	}

	public void setInsSite(String insSite) {
		this.insSite = insSite;
	}

	public Double getInsNumber() {
		return insNumber;
	}

	public void setInsNumber(Double insNumber) {
		this.insNumber = insNumber;
	}

	public String getInsCompany() {
		return insCompany;
	}

	public void setInsCompany(String insCompany) {
		this.insCompany = insCompany;
	}

	public String getInsPrincipal() {
		return insPrincipal;
	}

	public void setInsPrincipal(String insPrincipal) {
		this.insPrincipal = insPrincipal;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getStockOutSub() {
		return stockOutSub;
	}

	public void setStockOutSub(String stockOutSub) {
		this.stockOutSub = stockOutSub;
	}

	public String getStockOut() {
		return stockOut;
	}

	public void setStockOut(String stockOut) {
		this.stockOut = stockOut;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
	
}