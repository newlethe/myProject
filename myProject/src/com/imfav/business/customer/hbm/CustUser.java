package com.imfav.business.customer.hbm;

import java.util.Date;

/**
 * CrmCustBack entity. @author MyEclipse Persistence Tools
 */

public class CustUser implements java.io.Serializable {

	// Fields

	private String uids;
	private String custUids;
	private String userid;
	private String state;

	// Constructors

	/** default constructor */
	public CustUser() {
	}

	/** full constructor */
	public CustUser(String custUids, String userid, String state) {
		this.custUids = custUids;
		this.userid = userid;
		this.state = state;
	}

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

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
	
}