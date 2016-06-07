package com.sgepit.pmis.finalAccounts.report.hbm;

import java.util.Date;

public class FAUnitReport {

	private String uids;
	private String pid;
	private String sjType;
	private String title;
	private Integer billState;
	private String remark;
	private String userId;
	private Date createDate;
	private Date lastModifyDate;
	private String sourceType;
	private Integer reportStatus;
	private String fileLsh;
	
	
	
	public String getFileLsh() {
		return fileLsh;
	}
	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}
	public Integer getReportStatus() {
		return reportStatus;
	}
	public void setReportStatus(Integer reportStatus) {
		this.reportStatus = reportStatus;
	}
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
	public String getSjType() {
		return sjType;
	}
	public void setSjType(String sjType) {
		this.sjType = sjType;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Integer getBillState() {
		return billState;
	}
	public void setBillState(Integer billState) {
		this.billState = billState;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public Date getLastModifyDate() {
		return lastModifyDate;
	}
	public void setLastModifyDate(Date lastModifyDate) {
		this.lastModifyDate = lastModifyDate;
	}
	public String getSourceType() {
		return sourceType;
	}
	public void setSourceType(String sourceType) {
		this.sourceType = sourceType;
	}

	
}
