package com.imfav.business.stock.hbm;

import java.util.Date;

/**
 * CrmStock entity. @author MyEclipse Persistence Tools
 */

public class Stock implements java.io.Serializable {

	// Fields

	private String uids;
	private String custUids;
	private String stockNo;
	private String stockName;
	private Double openPosition;
	private Long haveNumber;
	private Double nowPrice;
	private Double profitPoint;
	private Double incomeMoney;
	private String addUser;
	private Date addTime;
	private String editUser;
	private Date editTime;
	private String stockDeal;
	private Date dealTime;

	// Constructors

	/** default constructor */
	public Stock() {
	}

	/** full constructor */
	public Stock(String custUids, String stockNo, String stockName,
			Double openPosition, Long haveNumber, Double nowPrice,
			Double profitPoint, Double incomeMoney, String addUser,
			Date addTime, String editUser, Date editTime, String stockDeal,
			Date dealTime) {
		this.custUids = custUids;
		this.stockNo = stockNo;
		this.stockName = stockName;
		this.openPosition = openPosition;
		this.haveNumber = haveNumber;
		this.nowPrice = nowPrice;
		this.profitPoint = profitPoint;
		this.incomeMoney = incomeMoney;
		this.addUser = addUser;
		this.addTime = addTime;
		this.editUser = editUser;
		this.editTime = editTime;
		this.stockDeal = stockDeal;
		this.dealTime = dealTime;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCustUids() {
		return this.custUids;
	}

	public void setCustUids(String custUids) {
		this.custUids = custUids;
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

	public Long getHaveNumber() {
		return this.haveNumber;
	}

	public void setHaveNumber(Long haveNumber) {
		this.haveNumber = haveNumber;
	}

	public Double getNowPrice() {
		return this.nowPrice;
	}

	public void setNowPrice(Double nowPrice) {
		this.nowPrice = nowPrice;
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

	public String getAddUser() {
		return this.addUser;
	}

	public void setAddUser(String addUser) {
		this.addUser = addUser;
	}

	public Date getAddTime() {
		return this.addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

	public String getEditUser() {
		return this.editUser;
	}

	public void setEditUser(String editUser) {
		this.editUser = editUser;
	}

	public Date getEditTime() {
		return this.editTime;
	}

	public void setEditTime(Date editTime) {
		this.editTime = editTime;
	}

	public String getStockDeal() {
		return stockDeal;
	}

	public void setStockDeal(String stockDeal) {
		this.stockDeal = stockDeal;
	}

	public Date getDealTime() {
		return dealTime;
	}

	public void setDealTime(Date dealTime) {
		this.dealTime = dealTime;
	}

}