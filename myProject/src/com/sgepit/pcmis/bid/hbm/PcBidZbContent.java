package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidZbContent entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidZbContent implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String zbUids;
	private String contentes;
	private Date startDate;
	private Date endDate;
	private Double rateStatus;
	private String respondDept;
	private String respondUser;
	private String memo;
	private Double applyAmount;
	private String zbBd;
	private Double bdgMoney;

	// Constructors

	/** default constructor */
	public PcBidZbContent() {
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

	public String getContentes() {
		return this.contentes;
	}

	public void setContentes(String contentes) {
		this.contentes = contentes;
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

	public Double getApplyAmount() {
		return this.applyAmount;
	}

	public void setApplyAmount(Double applyAmount) {
		this.applyAmount = applyAmount;
	}

	public String getZbBd() {
		return zbBd;
	}

	public void setZbBd(String zbBd) {
		this.zbBd = zbBd;
	}

	public Double getBdgMoney() {
		return bdgMoney;
	}

	public void setBdgMoney(Double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}
	
}