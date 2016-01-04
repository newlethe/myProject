package com.imfav.business.customer.hbm;

import java.util.Date;

/**
 * CrmViewCustStockId entity. @author MyEclipse Persistence Tools
 */

public class ViewCustStock implements java.io.Serializable {

	// Fields

	private String uids;
	private String name;
	private String mobile;
	private Double fund;
	private String salesman;
	private String stockNo;
	private String stockName;
	private Double openPosition;
	private Double nowPrice;
	private Long haveNumber;
	private Double profitPoint;
	private Double incomeMoney;
	private Double quote;
	private Double back;
	private Date newDealTime;
	private String remark;
	private String addUser;
	private Date addTime;
	private String haveState;
	private String state;

	// Constructors

	/** default constructor */
	public ViewCustStock() {
	}

	/** full constructor */
	public ViewCustStock(String uids, String name, String mobile, Double fund,
			String salesman, String stockNo, String stockName,
			Double openPosition, Double nowPrice, Long haveNumber,
			Double profitPoint, Double incomeMoney, Double quote, Double back,
			Date newDealTime, String remark, String addUser, Date addTime, String haveState, String state) {
		this.uids = uids;
		this.name = name;
		this.mobile = mobile;
		this.fund = fund;
		this.salesman = salesman;
		this.stockNo = stockNo;
		this.stockName = stockName;
		this.openPosition = openPosition;
		this.nowPrice = nowPrice;
		this.haveNumber = haveNumber;
		this.profitPoint = profitPoint;
		this.incomeMoney = incomeMoney;
		this.quote = quote;
		this.back = back;
		this.newDealTime = newDealTime;
		this.remark = remark;
		this.addUser = addUser;
		this.addTime = addTime;
		this.haveState = haveState;
		this.state = state;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public Double getFund() {
		return this.fund;
	}

	public void setFund(Double fund) {
		this.fund = fund;
	}

	public String getSalesman() {
		return this.salesman;
	}

	public void setSalesman(String salesman) {
		this.salesman = salesman;
	}

	public String getStockNo() {
		return this.stockNo;
	}

	public void setStockNo(String stockNo) {
		this.stockNo = stockNo;
	}

	public String getStockName() {
		return this.stockName;
	}

	public void setStockName(String stockName) {
		this.stockName = stockName;
	}

	public Double getOpenPosition() {
		return this.openPosition;
	}

	public void setOpenPosition(Double openPosition) {
		this.openPosition = openPosition;
	}

	public Double getNowPrice() {
		return this.nowPrice;
	}

	public void setNowPrice(Double nowPrice) {
		this.nowPrice = nowPrice;
	}

	public Long getHaveNumber() {
		return this.haveNumber;
	}

	public void setHaveNumber(Long haveNumber) {
		this.haveNumber = haveNumber;
	}

	public Double getProfitPoint() {
		return this.profitPoint;
	}

	public void setProfitPoint(Double profitPoint) {
		this.profitPoint = profitPoint;
	}

	public Double getIncomeMoney() {
		return this.incomeMoney;
	}

	public void setIncomeMoney(Double incomeMoney) {
		this.incomeMoney = incomeMoney;
	}

	public Double getQuote() {
		return this.quote;
	}

	public void setQuote(Double quote) {
		this.quote = quote;
	}

	public Double getBack() {
		return this.back;
	}

	public void setBack(Double back) {
		this.back = back;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getAddUser() {
		return addUser;
	}

	public void setAddUser(String addUser) {
		this.addUser = addUser;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

	public String getHaveState() {
		return haveState;
	}

	public void setHaveState(String haveState) {
		this.haveState = haveState;
	}

	public Date getNewDealTime() {
		return newDealTime;
	}

	public void setNewDealTime(Date newDealTime) {
		this.newDealTime = newDealTime;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

}