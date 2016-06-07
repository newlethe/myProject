package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatStoreIn entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatStoreIn implements java.io.Serializable {

	// Fields

	private String uuid;
	private String inNo;
	private String dept;
	private String name;
	private Date inDate;
	private String conid;
	private Double sum;
	private String fareType;
	private String offerDept;
	private String matType;
	private Date arrivDate;
	private String userWay;
	private String remark;
	private String storetype;
	private String billState;
	private String pid;

	// Constructors

	/** default constructor */
	public MatStoreIn() {
	}

	/** full constructor */
	public MatStoreIn(String inNo, String dept, String name, Date inDate,
			String conid, Double sum, String fareType, String offerDept,
			String matType, Date arrivDate, String userWay, String remark,String storetype) {
		this.inNo = inNo;
		this.dept = dept;
		this.name = name;
		this.inDate = inDate;
		this.conid = conid;
		this.sum = sum;
		this.fareType = fareType;
		this.offerDept = offerDept;
		this.matType = matType;
		this.arrivDate = arrivDate;
		this.userWay = userWay;
		this.remark = remark;
		this.storetype = storetype;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getInNo() {
		return this.inNo;
	}

	public void setInNo(String inNo) {
		this.inNo = inNo;
	}

	public String getDept() {
		return this.dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getInDate() {
		return this.inDate;
	}

	public void setInDate(Date inDate) {
		this.inDate = inDate;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getSum() {
		return this.sum;
	}

	public void setSum(Double sum) {
		this.sum = sum;
	}

	public String getFareType() {
		return this.fareType;
	}

	public void setFareType(String fareType) {
		this.fareType = fareType;
	}

	public String getOfferDept() {
		return this.offerDept;
	}

	public void setOfferDept(String offerDept) {
		this.offerDept = offerDept;
	}

	public String getMatType() {
		return this.matType;
	}

	public void setMatType(String matType) {
		this.matType = matType;
	}

	public Date getArrivDate() {
		return this.arrivDate;
	}

	public void setArrivDate(Date arrivDate) {
		this.arrivDate = arrivDate;
	}

	public String getUserWay() {
		return this.userWay;
	}

	public void setUserWay(String userWay) {
		this.userWay = userWay;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getStoretype() {
		return storetype;
	}

	public void setStoretype(String storetype) {
		this.storetype = storetype;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}