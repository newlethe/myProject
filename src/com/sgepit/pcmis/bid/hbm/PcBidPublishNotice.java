package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidPublishNotice entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidPublishNotice implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String zbUids;
	private Date pubDate;
	private String pubTitle;
	private Date startDate;
	private Date endDate;
	private Double rateStatus;
	private String respondDept;
	private String respondUser;
	private String memo;
	private String contentUids;
	private String pubNo;
	private String memoC1;
//	private String memoC2;
//	private String memoC3;

	// Constructors

	public String getContentUids() {
		return contentUids;
	}

	public void setContentUids(String contentUids) {
		this.contentUids = contentUids;
	}

	public String getPubNo() {
		return pubNo;
	}

	public void setPubNo(String pubNo) {
		this.pubNo = pubNo;
	}

	public String getMemoC1() {
		return memoC1;
	}

	public void setMemoC1(String memoC1) {
		this.memoC1 = memoC1;
	}

//	public String getMemoC2() {
//		return memoC2;
//	}
//
//	public void setMemoC2(String memoC2) {
//		this.memoC2 = memoC2;
//	}
//
//	public String getMemoC3() {
//		return memoC3;
//	}
//
//	public void setMemoC3(String memoC3) {
//		this.memoC3 = memoC3;
//	}

	/** default constructor */
	public PcBidPublishNotice() {
	}

	/** minimal constructor */
	public PcBidPublishNotice(String pid, String zbUids, String respondDept,
			String respondUser) {
		this.pid = pid;
		this.zbUids = zbUids;
		this.respondDept = respondDept;
		this.respondUser = respondUser;
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

	public String getZbUids() {
		return this.zbUids;
	}

	public void setZbUids(String zbUids) {
		this.zbUids = zbUids;
	}

	public Date getPubDate() {
		return this.pubDate;
	}

	public void setPubDate(Date pubDate) {
		this.pubDate = pubDate;
	}

	public String getPubTitle() {
		return this.pubTitle;
	}

	public void setPubTitle(String pubTitle) {
		this.pubTitle = pubTitle;
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

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}