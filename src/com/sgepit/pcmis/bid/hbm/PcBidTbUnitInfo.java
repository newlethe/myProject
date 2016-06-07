package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidTbUnitInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidTbUnitInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String contentUids;
	private Date startDate;
	private Date endDate;
	private Double rateStatus;
	private String respondDept;
	private String respondUser;
	private String tbUnit;
	private String preHearResult;
	private String memo;
	private String contactPerson;
	private String contactPhone;
	private String contactMail;
	//extend
	private Double price;
	// Constructors
	public String getContactPerson() {
		return contactPerson;
	}



	public void setContactPerson(String contactPerson) {
		this.contactPerson = contactPerson;
	}



	public String getContactPhone() {
		return contactPhone;
	}



	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;
	}



	public String getContactMail() {
		return contactMail;
	}



	public void setContactMail(String contactMail) {
		this.contactMail = contactMail;
	}



	/** default constructor */
	public PcBidTbUnitInfo() {
	}



	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getContentUids() {
		return this.contentUids;
	}

	public void setContentUids(String contentUids) {
		this.contentUids = contentUids;
	}

	public Date getStartDate() {
		return this.startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return this.endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Double getRateStatus() {
		return this.rateStatus;
	}

	public void setRateStatus(Double rateStatus) {
		this.rateStatus = rateStatus;
	}

	public String getRespondDept() {
		return this.respondDept;
	}

	public void setRespondDept(String respondDept) {
		this.respondDept = respondDept;
	}

	public String getRespondUser() {
		return this.respondUser;
	}

	public void setRespondUser(String respondUser) {
		this.respondUser = respondUser;
	}

	public String getTbUnit() {
		return this.tbUnit;
	}

	public void setTbUnit(String tbUnit) {
		this.tbUnit = tbUnit;
	}

	public String getPreHearResult() {
		return this.preHearResult;
	}

	public void setPreHearResult(String preHearResult) {
		this.preHearResult = preHearResult;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}



	public Double getPrice() {
		return price;
	}



	public void setPrice(Double price) {
		this.price = price;
	}

}