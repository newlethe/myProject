package com.imfav.business.customer.hbm;

import java.util.Date;

/**
 * Customer entity. @author MyEclipse Persistence Tools
 */

public class Customer implements java.io.Serializable {

	// Fields

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String uids;
	private String name;
	private String mobile;
	private String qq;
	private String province;
	private String city;
	private Double fund;
	private Double quote;
	private Double deposit;
	private Double back;
	private String payway;
	private String salesman;
	private String manager;
	private String director;
	private String remark;
	private Date backTime;
	private String addUser;
	private Date addTime;
	private String state;
	private String managerShow;
	private String toKefu;
	private String toKefuUser;
	private Date toKefuTime;

	// Constructors

	/** default constructor */
	public Customer() {
	}

	/** full constructor */
	public Customer(String name, String mobile, String qq, String province,
			String city, Double fund, Double quote, Double deposit,
			Double back, String payway, String salesman, String manager,
			String director, String remark, Date backTime, String addUser,
			Date addTime, String state, String managerShow, String toKefu,
			String toKefuUser, Date toKefuTime) {
		this.name = name;
		this.mobile = mobile;
		this.mobile = qq;
		this.province = province;
		this.city = city;
		this.fund = fund;
		this.quote = quote;
		this.deposit = deposit;
		this.back = back;
		this.salesman = salesman;
		this.manager = manager;
		this.director = director;
		this.remark = remark;
		this.backTime = backTime;
		this.addUser = addUser;
		this.addTime = addTime;
		this.state = state;
		this.managerShow = managerShow;
		this.toKefu = toKefu;
		this.toKefuUser = toKefuUser;
		this.toKefuTime = toKefuTime;
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

	public String getProvince() {
		return this.province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return this.city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public Double getFund() {
		return this.fund;
	}

	public void setFund(Double fund) {
		this.fund = fund;
	}

	public Double getDeposit() {
		return this.deposit;
	}

	public void setDeposit(Double deposit) {
		this.deposit = deposit;
	}

	public String getSalesman() {
		return this.salesman;
	}

	public void setSalesman(String salesman) {
		this.salesman = salesman;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Date getBackTime() {
		return this.backTime;
	}

	public void setBackTime(Date backTime) {
		this.backTime = backTime;
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

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public Double getQuote() {
		return quote;
	}

	public void setQuote(Double quote) {
		this.quote = quote;
	}

	public String getPayway() {
		return payway;
	}

	public void setPayway(String payway) {
		this.payway = payway;
	}

	public Double getBack() {
		return back;
	}

	public void setBack(Double back) {
		this.back = back;
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

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getManagerShow() {
		return managerShow;
	}

	public void setManagerShow(String managerShow) {
		this.managerShow = managerShow;
	}

	public String getToKefu() {
		return toKefu;
	}

	public void setToKefu(String toKefu) {
		this.toKefu = toKefu;
	}

	public String getToKefuUser() {
		return toKefuUser;
	}

	public void setToKefuUser(String toKefuUser) {
		this.toKefuUser = toKefuUser;
	}

	public Date getToKefuTime() {
		return toKefuTime;
	}

	public void setToKefuTime(Date toKefuTime) {
		this.toKefuTime = toKefuTime;
	}

}