package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsArrival entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsFinishedRecord implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private Date finiTime = new Date();
	private String finiUids;
	private String finiNo;
	private String finiSubUids;
	private String finiSubNo;
	private Double finiSubNum;
	private Double finiStockNum;
	private Double finiStockPrice;
	private Double finiStockMoney;
	private String finiInOut;
	private String finiType;
	
	// Constructors


	/** default constructor */
	public EquGoodsFinishedRecord() {
	}

	/** minimal constructor */
	

	/** full constructor */
	public EquGoodsFinishedRecord(String pid, String conid, Date finiTime,
			String finiUids, String finiNo, String finiSubUids,
			String finiSubNo, Double finiSubNum, Double finiStockNum,
			Double finiStockPrice, Double finiStockMoney, String finiInOut,
			String finiType) {
		super();
		this.pid = pid;
		this.conid = conid;
		this.finiTime = finiTime;
		this.finiUids = finiUids;
		this.finiNo = finiNo;
		this.finiSubUids = finiSubUids;
		this.finiSubNo = finiSubNo;
		this.finiSubNum = finiSubNum;
		this.finiStockNum = finiStockNum;
		this.finiStockPrice = finiStockPrice;
		this.finiStockMoney = finiStockMoney;
		this.finiInOut = finiInOut;
		this.finiType = finiType;
	}
	
	// Property accessors

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Date getFiniTime() {
		return finiTime;
	}

	public void setFiniTime(Date finiTime) {
		this.finiTime = finiTime;
	}

	public String getFiniUids() {
		return finiUids;
	}

	public void setFiniUids(String finiUids) {
		this.finiUids = finiUids;
	}

	public String getFiniNo() {
		return finiNo;
	}

	public void setFiniNo(String finiNo) {
		this.finiNo = finiNo;
	}

	public String getFiniSubUids() {
		return finiSubUids;
	}

	public void setFiniSubUids(String finiSubUids) {
		this.finiSubUids = finiSubUids;
	}

	public String getFiniSubNo() {
		return finiSubNo;
	}

	public void setFiniSubNo(String finiSubNo) {
		this.finiSubNo = finiSubNo;
	}

	public Double getFiniSubNum() {
		return finiSubNum;
	}

	public void setFiniSubNum(Double finiSubNum) {
		this.finiSubNum = finiSubNum;
	}

	public Double getFiniStockNum() {
		return finiStockNum;
	}

	public void setFiniStockNum(Double finiStockNum) {
		this.finiStockNum = finiStockNum;
	}

	public Double getFiniStockPrice() {
		return finiStockPrice;
	}

	public void setFiniStockPrice(Double finiStockPrice) {
		this.finiStockPrice = finiStockPrice;
	}

	public Double getFiniStockMoney() {
		return finiStockMoney;
	}

	public void setFiniStockMoney(Double finiStockMoney) {
		this.finiStockMoney = finiStockMoney;
	}
	
	public String getFiniInOut() {
		return finiInOut;
	}

	public void setFiniInOut(String finiInOut) {
		this.finiInOut = finiInOut;
	}

	public String getFiniType() {
		return finiType;
	}

	public void setFiniType(String finiType) {
		this.finiType = finiType;
	}

}