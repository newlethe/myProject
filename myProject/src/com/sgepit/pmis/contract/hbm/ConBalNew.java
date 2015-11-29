package com.sgepit.pmis.contract.hbm;

import java.util.Date;

/**
 * ConBalNew entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConBalNew implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String balNo;
	private Double balPrice;
	private Double balApproPrice;
	private String balType;
	private String applyMan;
	private Date applyDate;
	private String fileId;
	private String billState;
	private Double conMoney;
	private Double payMoney;
	private String payDetail;
	private Double doBalMoney;
	private Double doneBalMoney;

	// Constructors

	/** default constructor */
	public ConBalNew() {
	}

	/** full constructor */
	public ConBalNew(String pid, String conid, String balNo, Double balPrice,
			Double balApproPrice, String balType, String applyMan,
			Date applyDate, String fileId, String billState, Double conMoney,
			Double payMoney, String payDetail, Double doBalMoney,
			Double doneBalMoney) {
		this.pid = pid;
		this.conid = conid;
		this.balNo = balNo;
		this.balPrice = balPrice;
		this.balApproPrice = balApproPrice;
		this.balType = balType;
		this.applyMan = applyMan;
		this.applyDate = applyDate;
		this.fileId = fileId;
		this.billState = billState;
		this.conMoney = conMoney;
		this.payMoney = payMoney;
		this.payDetail = payDetail;
		this.doBalMoney = doBalMoney;
		this.doneBalMoney = doneBalMoney;
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

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBalNo() {
		return this.balNo;
	}

	public void setBalNo(String balNo) {
		this.balNo = balNo;
	}

	public Double getBalPrice() {
		return this.balPrice;
	}

	public void setBalPrice(Double balPrice) {
		this.balPrice = balPrice;
	}

	public Double getBalApproPrice() {
		return this.balApproPrice;
	}

	public void setBalApproPrice(Double balApproPrice) {
		this.balApproPrice = balApproPrice;
	}

	public String getBalType() {
		return this.balType;
	}

	public void setBalType(String balType) {
		this.balType = balType;
	}

	public String getApplyMan() {
		return this.applyMan;
	}

	public void setApplyMan(String applyMan) {
		this.applyMan = applyMan;
	}

	public Date getApplyDate() {
		return this.applyDate;
	}

	public void setApplyDate(Date applyDate) {
		this.applyDate = applyDate;
	}

	public String getFileId() {
		return this.fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public Double getConMoney() {
		return this.conMoney;
	}

	public void setConMoney(Double conMoney) {
		this.conMoney = conMoney;
	}

	public Double getPayMoney() {
		return this.payMoney;
	}

	public void setPayMoney(Double payMoney) {
		this.payMoney = payMoney;
	}

	public String getPayDetail() {
		return this.payDetail;
	}

	public void setPayDetail(String payDetail) {
		this.payDetail = payDetail;
	}

	public Double getDoBalMoney() {
		return this.doBalMoney;
	}

	public void setDoBalMoney(Double doBalMoney) {
		this.doBalMoney = doBalMoney;
	}

	public Double getDoneBalMoney() {
		return this.doneBalMoney;
	}

	public void setDoneBalMoney(Double doneBalMoney) {
		this.doneBalMoney = doneBalMoney;
	}

}