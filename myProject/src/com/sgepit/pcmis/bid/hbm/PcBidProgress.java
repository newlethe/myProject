package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

public class PcBidProgress {
	
	private String uids;
	private String pid;
	private String contentUids;
	private String progressType;
	private Date startDate;
	private Date endDate;
	private Double rateStatus;
	private String respondDept;
	private String respondUser;
	private String memo;
	private Boolean isActive;
	private Double kbPrice;
	private String pbWays;
	private String pbWaysAppend;
	
	
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
	public String getProgressType() {
		return progressType;
	}
	public void setProgressType(String progressType) {
		this.progressType = progressType;
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
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	public Double getKbPrice() {
		return kbPrice;
	}
	public void setKbPrice(Double kbPrice) {
		this.kbPrice = kbPrice;
	}
	public String getPbWays() {
		return pbWays;
	}
	public void setPbWays(String pbWays) {
		this.pbWays = pbWays;
	}
	public String getPbWaysAppend() {
		return pbWaysAppend;
	}
	public void setPbWaysAppend(String pbWaysAppend) {
		this.pbWaysAppend = pbWaysAppend;
	}
	
	

}
