package com.imfav.business.customer.hbm;

import java.util.Date;

/**
 * CrmCustBack entity. @author MyEclipse Persistence Tools
 */

public class CustBacklog implements java.io.Serializable {

	// Fields

	private String uids;
	private String custUids;
	private String addUser;
	private Date addTime;
	private String logContent;

	// Constructors

	/** default constructor */
	public CustBacklog() {
	}

	/** full constructor */
	public CustBacklog(String custUids, String addUser, Date addTime,
			String logContent) {
		this.custUids = custUids;
		this.addUser = addUser;
		this.addTime = addTime;
		this.logContent = logContent;
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

	public String getLogContent() {
		return logContent;
	}

	public void setLogContent(String logContent) {
		this.logContent = logContent;
	}

}