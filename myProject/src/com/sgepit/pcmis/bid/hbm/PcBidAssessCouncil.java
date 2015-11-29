package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidAssessCouncil entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidAssessCouncil implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String contentUids;
	private Date startDate;
	private Date endDate;
	private Double rateStatus;
	private String respondDept;
	private String respondUser;
	private String juryName;
	private String memo;
	private String jobTitle;

	// Constructors

	/** default constructor */
	public PcBidAssessCouncil() {
	}

	/** minimal constructor */
	public PcBidAssessCouncil(String pid, String contentUids,
			String respondDept, String respondUser, String juryName, String jobTitle) {
		this.pid = pid;
		this.contentUids = contentUids;
		this.respondDept = respondDept;
		this.respondUser = respondUser;
		this.juryName = juryName;
		this.jobTitle = jobTitle;
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

	public String getJuryName() {
		return this.juryName;
	}

	public void setJuryName(String juryName) {
		this.juryName = juryName;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

}