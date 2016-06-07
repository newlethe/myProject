package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsArrival entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsArrival implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String treeuids;
	private Integer finished;
	private Integer isOpen;
	private String dhNo;
	private Date dhDate;
	private Date demDhDate;
	private Date plaDhDate;
	private String dhDesc;
	private String csno;
	private String receiveUser;
	private Long boxNum;
	private Double totalWeight;
	private String sendType;
	private String carNo;
	private String dumpType;
	private String dumpUnit;
	private String recordUser;
	private String remark;

	private String flowid;
	private String joinUnit;
	private String joinPlace;
	private String billState;
	private String sendNum;
	private String fileid;


	
	/** default constructor */
	public EquGoodsArrival() {
	}

	/** minimal constructor */
	public EquGoodsArrival(String pid, String conid, String treeuids, String dhNo) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.dhNo = dhNo;
	}

	/** full constructor */
	public EquGoodsArrival(String uids, String pid, String conid,
			String treeuids, Integer finished, Integer isOpen, String dhNo,
			Date dhDate, Date demDhDate, Date plaDhDate, String dhDesc,
			String csno, String receiveUser, Long boxNum, Double totalWeight,
			String sendType, String carNo, String dumpType, String dumpUnit,
			String recordUser, String remark, String flowid, String joinUnit,
			String joinPlace, String billState, String sendNum, String fileid) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.finished = finished;
		this.isOpen = isOpen;
		this.dhNo = dhNo;
		this.dhDate = dhDate;
		this.demDhDate = demDhDate;
		this.plaDhDate = plaDhDate;
		this.dhDesc = dhDesc;
		this.csno = csno;
		this.receiveUser = receiveUser;
		this.boxNum = boxNum;
		this.totalWeight = totalWeight;
		this.sendType = sendType;
		this.carNo = carNo;
		this.dumpType = dumpType;
		this.dumpUnit = dumpUnit;
		this.recordUser = recordUser;
		this.remark = remark;
		this.flowid = flowid;
		this.joinUnit = joinUnit;
		this.joinPlace = joinPlace;
		this.billState = billState;
		this.sendNum = sendNum;
		this.fileid = fileid;
	}

	

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

	public String getTreeuids() {
		return this.treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
	}

	public Integer getFinished() {
		return this.finished;
	}

	public void setFinished(Integer finished) {
		this.finished = finished;
	}

	public String getDhNo() {
		return this.dhNo;
	}

	public void setDhNo(String dhNo) {
		this.dhNo = dhNo;
	}

	public Date getDhDate() {
		return this.dhDate;
	}

	public void setDhDate(Date dhDate) {
		this.dhDate = dhDate;
	}

	public String getDhDesc() {
		return this.dhDesc;
	}

	public void setDhDesc(String dhDesc) {
		this.dhDesc = dhDesc;
	}

	public String getCsno() {
		return this.csno;
	}

	public void setCsno(String csno) {
		this.csno = csno;
	}

	public String getReceiveUser() {
		return this.receiveUser;
	}

	public void setReceiveUser(String receiveUser) {
		this.receiveUser = receiveUser;
	}

	public Long getBoxNum() {
		return this.boxNum;
	}

	public void setBoxNum(Long boxNum) {
		this.boxNum = boxNum;
	}

	public Double getTotalWeight() {
		return this.totalWeight;
	}

	public void setTotalWeight(Double totalWeight) {
		this.totalWeight = totalWeight;
	}

	public String getSendType() {
		return this.sendType;
	}

	public void setSendType(String sendType) {
		this.sendType = sendType;
	}

	public String getCarNo() {
		return this.carNo;
	}

	public void setCarNo(String carNo) {
		this.carNo = carNo;
	}

	public String getDumpType() {
		return this.dumpType;
	}

	public void setDumpType(String dumpType) {
		this.dumpType = dumpType;
	}

	public String getDumpUnit() {
		return this.dumpUnit;
	}

	public void setDumpUnit(String dumpUnit) {
		this.dumpUnit = dumpUnit;
	}

	public String getRecordUser() {
		return this.recordUser;
	}

	public void setRecordUser(String recordUser) {
		this.recordUser = recordUser;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getIsOpen() {
		return isOpen;
	}

	public void setIsOpen(Integer isOpen) {
		this.isOpen = isOpen;
	}

	public String getFlowid() {
		return flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getJoinUnit() {
		return joinUnit;
	}

	public void setJoinUnit(String joinUnit) {
		this.joinUnit = joinUnit;
	}

	public String getJoinPlace() {
		return joinPlace;
	}

	public void setJoinPlace(String joinPlace) {
		this.joinPlace = joinPlace;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public Date getDemDhDate() {
		return demDhDate;
	}

	public void setDemDhDate(Date demDhDate) {
		this.demDhDate = demDhDate;
	}

	public Date getPlaDhDate() {
		return plaDhDate;
	}

	public void setPlaDhDate(Date plaDhDate) {
		this.plaDhDate = plaDhDate;
	}

	public String getSendNum() {
		return sendNum;
	}

	public void setSendNum(String sendNum) {
		this.sendNum = sendNum;
	}

	public String getFileid() {
		return fileid;
	}

	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

}