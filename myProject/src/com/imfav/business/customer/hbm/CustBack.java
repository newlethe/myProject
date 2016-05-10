package com.imfav.business.customer.hbm;

import java.util.Date;

/**
 * CrmCustBack entity. @author MyEclipse Persistence Tools
 */

public class CustBack implements java.io.Serializable {

	// Fields

	private String uids;
	private String custUids;
	private Double backMoney;
	private Date backTime;
	private String payway;
	private String addUser;
	private Date addTime;

	// Constructors

	/** default constructor */
	public CustBack() {
	}

	/** full constructor */
	public CustBack(String custUids, Double backMoney, Date backTime,
			String addUser, Date addTime, String payway) {
		this.custUids = custUids;
		this.backMoney = backMoney;
		this.backTime = backTime;
		this.addUser = addUser;
		this.addTime = addTime;
		this.payway = payway;
	}

	// Property accessors
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCustUids() {
		return custUids;
	}

	public void setCustUids(String custUids) {
		this.custUids = custUids;
	}

	public Double getBackMoney() {
		return backMoney;
	}

	public void setBackMoney(Double backMoney) {
		this.backMoney = backMoney;
	}

	public Date getBackTime() {
		return backTime;
	}

	public void setBackTime(Date backTime) {
		this.backTime = backTime;
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

	public String getPayway() {
		return payway;
	}

	public void setPayway(String payway) {
		this.payway = payway;
	}

}