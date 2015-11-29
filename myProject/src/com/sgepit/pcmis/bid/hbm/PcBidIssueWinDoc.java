package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidIssueWinDoc entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidIssueWinDoc implements java.io.Serializable {

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
	private String memo;
	private Double tbPrice;
	private String state;

	// Constructors

	/** default constructor */
	public PcBidIssueWinDoc() {
	}

	/** minimal constructor */
	public PcBidIssueWinDoc(String pid, String contentUids, String respondDept,
			String respondUser, String tbUnit, Double tbPrice,String state) {
		this.pid = pid;
		this.contentUids = contentUids;
		this.respondDept = respondDept;
		this.respondUser = respondUser;
		this.tbUnit = tbUnit;
		this.tbPrice = tbPrice;
		this.state=state;
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

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Double getTbPrice() {
		return tbPrice;
	}

	public void setTbPrice(Double tbPrice) {
		this.tbPrice = tbPrice;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
	
	

}