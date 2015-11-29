package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidClarificateTbdoc entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidClarificateTbdoc implements java.io.Serializable {

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
	private String needClarContent;
	private String clarContent;
	private String memo;

	// Constructors

	/** default constructor */
	public PcBidClarificateTbdoc() {
	}

	/** minimal constructor */
	public PcBidClarificateTbdoc(String pid, String contentUids,
			String respondDept, String tbUnit) {
		this.pid = pid;
		this.contentUids = contentUids;
		this.respondDept = respondDept;
		this.tbUnit = tbUnit;
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

	public String getNeedClarContent() {
		return this.needClarContent;
	}

	public void setNeedClarContent(String needClarContent) {
		this.needClarContent = needClarContent;
	}

	public String getClarContent() {
		return this.clarContent;
	}

	public void setClarContent(String clarContent) {
		this.clarContent = clarContent;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}