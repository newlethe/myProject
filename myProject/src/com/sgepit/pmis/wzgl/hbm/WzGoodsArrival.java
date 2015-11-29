package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * yanglh
 * 2012-12-18
 */

public class WzGoodsArrival implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String treeuids;
	private Integer finished;
	private Integer isOpen;
	private String dhNo;
	private Date dhDate;
	private String dhDesc;
	private String csno;
	private String receiveUser;
	private Long boxNum;
	private Long totalWeight;
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
	private String setUser;

	private Long singleMaxWeight;
	private String volume;
	private String carrierPhoto;
	private String dhShi;
	private String dhFen;
	private Date actualTime;
	private String dhNoticeNo;
	private String dhHandoverNo;
	
	
	//权限控制新增字段
	private String createMan;//创建人ID
	private String createUnit;//创建单位
	
	// Constructors

	/** default constructor */
	public WzGoodsArrival() {
	}

	/** minimal constructor */
	public WzGoodsArrival(String pid, String conid, String treeuids, String dhNo) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.dhNo = dhNo;
	}

	/** full constructor */
	public WzGoodsArrival(String pid, String conid, String treeuids,
			Integer finished, Integer isOpen, String dhNo, Date dhDate, String dhDesc,
			String csno, String receiveUser, Long boxNum,String dhShi,String dhFen,
			Long totalWeight, String sendType, String carNo, String dumpType,
			String dumpUnit, String recordUser, String remark,Date actualTime,
			String dhHandoverNo,String dhNoticeNo) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.finished = finished;
		this.isOpen = isOpen;
		this.dhNo = dhNo;
		this.dhDate = dhDate;
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
		this.dhShi = dhShi;
		this.dhFen = dhFen;
		this.actualTime= actualTime;
		this.dhHandoverNo = dhHandoverNo;
		this.dhNoticeNo = dhNoticeNo;
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

	public Long getTotalWeight() {
		return this.totalWeight;
	}

	public void setTotalWeight(Long totalWeight) {
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

	public String getSetUser() {
		return setUser;
	}

	public void setSetUser(String setUser) {
		this.setUser = setUser;
	}

	public Long getSingleMaxWeight() {
		return singleMaxWeight;
	}

	public void setSingleMaxWeight(Long singleMaxWeight) {
		this.singleMaxWeight = singleMaxWeight;
	}

	public String getVolume() {
		return volume;
	}

	public void setVolume(String volume) {
		this.volume = volume;
	}

	public String getCarrierPhoto() {
		return carrierPhoto;
	}

	public void setCarrierPhoto(String carrierPhoto) {
		this.carrierPhoto = carrierPhoto;
	}

	public String getDhShi() {
		return dhShi;
	}

	public void setDhShi(String dhShi) {
		this.dhShi = dhShi;
	}

	public String getDhFen() {
		return dhFen;
	}

	public void setDhFen(String dhFen) {
		this.dhFen = dhFen;
	}

	public Date getActualTime() {
		return actualTime;
	}

	public void setActualTime(Date actualTime) {
		this.actualTime = actualTime;
	}

	public String getDhNoticeNo() {
		return dhNoticeNo;
	}

	public void setDhNoticeNo(String dhNoticeNo) {
		this.dhNoticeNo = dhNoticeNo;
	}

	public String getDhHandoverNo() {
		return dhHandoverNo;
	}

	public void setDhHandoverNo(String dhHandoverNo) {
		this.dhHandoverNo = dhHandoverNo;
	}

	public String getCreateMan() {
		return createMan;
	}

	public void setCreateMan(String createMan) {
		this.createMan = createMan;
	}

	public String getCreateUnit() {
		return createUnit;
	}

	public void setCreateUnit(String createUnit) {
		this.createUnit = createUnit;
	}

}