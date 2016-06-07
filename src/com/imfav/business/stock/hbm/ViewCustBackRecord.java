package com.imfav.business.stock.hbm;

import java.util.Date;

/**
 * CrmStock entity. @author MyEclipse Persistence Tools
 */

public class ViewCustBackRecord implements java.io.Serializable {

	// Fields

	private String uids;
	private String custUids;
	private String name;
	private String mobile;
	private Double backMoney;
	private Date backTime;
	private String payway;
	private String salesman;
	private String manager;
	private String director;
	private String addUser;

	// Constructors

	/** default constructor */
	public ViewCustBackRecord() {
	}

	/** full constructor */
	public ViewCustBackRecord(String custUids, String name, String mobile,
			Double backMoney, Date backTime, String payway, String salesman,
			String manager, String director, String addUser) {
		this.custUids = custUids;
		this.name = name;
		this.mobile = mobile;
		this.backMoney = backMoney;
		this.backTime = backTime;
		this.payway = payway;
		this.salesman = salesman;
		this.manager = manager;
		this.director = director;
		this.addUser = addUser;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
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

	public String getPayway() {
		return payway;
	}

	public void setPayway(String payway) {
		this.payway = payway;
	}

	public String getSalesman() {
		return salesman;
	}

	public void setSalesman(String salesman) {
		this.salesman = salesman;
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public String getDirector() {
		return director;
	}

	public void setDirector(String director) {
		this.director = director;
	}

	public String getAddUser() {
		return addUser;
	}

	public void setAddUser(String addUser) {
		this.addUser = addUser;
	}

}