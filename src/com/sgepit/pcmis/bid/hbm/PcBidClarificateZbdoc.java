package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidClarificateZbdoc entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidClarificateZbdoc implements java.io.Serializable {

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
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getContentUids() {
		return contentUids;
	}
	public void setContentUids(String contentUids) {
		this.contentUids = contentUids;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public Double getRateStatus() {
		return rateStatus;
	}
	public void setRateStatus(Double rateStatus) {
		this.rateStatus = rateStatus;
	}
	public String getRespondDept() {
		return respondDept;
	}
	public void setRespondDept(String respondDept) {
		this.respondDept = respondDept;
	}
	public String getRespondUser() {
		return respondUser;
	}
	public void setRespondUser(String respondUser) {
		this.respondUser = respondUser;
	}
	public String getTbUnit() {
		return tbUnit;
	}
	public void setTbUnit(String tbUnit) {
		this.tbUnit = tbUnit;
	}
	public String getNeedClarContent() {
		return needClarContent;
	}
	public void setNeedClarContent(String needClarContent) {
		this.needClarContent = needClarContent;
	}
	public String getClarContent() {
		return clarContent;
	}
	public void setClarContent(String clarContent) {
		this.clarContent = clarContent;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}

	

}