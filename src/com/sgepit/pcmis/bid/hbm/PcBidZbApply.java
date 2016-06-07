package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidZbApply entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidZbApply implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String zbType;
	private String zbName;
	private String respondMan;
	private String zbWay;
	private String memo;
	private String zbApproveNo;
	private String zbNo;
	private Double reportStatus;
	private Date applyDate;
	// Constructors

	/** default constructor */
	public PcBidZbApply() {
	}

	/** minimal constructor */
	public PcBidZbApply(String pid, String respondMan, String zbWay) {
		this.pid = pid;
		this.respondMan = respondMan;
		this.zbWay = zbWay;
	}

	/** full constructor */
	public PcBidZbApply(String pid, String zbType, String zbName,
			String respondMan, String zbWay, String memo, String zbApproveNo,
			String zbNo,Date applyDate) {
		this.pid = pid;
		this.zbType = zbType;
		this.zbName = zbName;
		this.respondMan = respondMan;
		this.zbWay = zbWay;
		this.memo = memo;
		this.zbApproveNo = zbApproveNo;
		this.zbNo = zbNo;
		this.applyDate = applyDate;
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

	public String getZbType() {
		return this.zbType;
	}

	public void setZbType(String zbType) {
		this.zbType = zbType;
	}

	public String getZbName() {
		return this.zbName;
	}

	public void setZbName(String zbName) {
		this.zbName = zbName;
	}

	public String getRespondMan() {
		return this.respondMan;
	}

	public void setRespondMan(String respondMan) {
		this.respondMan = respondMan;
	}

	public String getZbWay() {
		return this.zbWay;
	}

	public void setZbWay(String zbWay) {
		this.zbWay = zbWay;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getZbApproveNo() {
		return this.zbApproveNo;
	}

	public void setZbApproveNo(String zbApproveNo) {
		this.zbApproveNo = zbApproveNo;
	}

	public String getZbNo() {
		return this.zbNo;
	}

	public void setZbNo(String zbNo) {
		this.zbNo = zbNo;
	}

	public Double getReportStatus() {
		return reportStatus;
	}

	public void setReportStatus(Double reportStatus) {
		this.reportStatus = reportStatus;
	}

	public Date getApplyDate() {
		return applyDate;
	}

	public void setApplyDate(Date applyDate) {
		this.applyDate = applyDate;
	}
	
}