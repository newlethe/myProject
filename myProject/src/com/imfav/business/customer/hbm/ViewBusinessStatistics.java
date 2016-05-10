package com.imfav.business.customer.hbm;

import java.util.Date;

/**
 * CrmViewCustStockId entity. @author MyEclipse Persistence Tools
 */

public class ViewBusinessStatistics implements java.io.Serializable {

	// Fields

	private String uids;
	private String salesman;
	private String manager;
	private String director;
	
	private Long sendNum;
	private Long backNum;
	private Double sumMoney;

	// Constructors

	/** default constructor */
	public ViewBusinessStatistics() {
	}

	/** full constructor */
	public ViewBusinessStatistics(
			String salesman, String manager, String director, 
			Long sendNum,
			Long backNum,
			Double sumMoney) {
		this.salesman = salesman;
		this.manager = manager;
		this.director = director;
		this.sendNum = sendNum;
		this.backNum = backNum;
		this.sumMoney = sumMoney;
	}

	// Property accessors
	
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
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

	public Long getSendNum() {
		return sendNum;
	}

	public void setSendNum(Long sendNum) {
		this.sendNum = sendNum;
	}

	public Long getBackNum() {
		return backNum;
	}

	public void setBackNum(Long backNum) {
		this.backNum = backNum;
	}

	public Double getSumMoney() {
		return sumMoney;
	}

	public void setSumMoney(Double sumMoney) {
		this.sumMoney = sumMoney;
	}

}