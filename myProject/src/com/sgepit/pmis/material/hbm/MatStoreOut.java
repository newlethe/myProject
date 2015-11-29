package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatStoreOut entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatStoreOut implements java.io.Serializable {

	// Fields

	private String uuid;
	private String outNo;
	private String outName;
	private String dept;
	private Date outDate;
	private String sendWare;
	private String matType;
	private String useWay;
	private String bdgid;
	private String bdgno;
	private String bdgname;
	private String volumeId;
	private String volumeNo;
	private String volumeName;
	private String dealMan;
	private String remark;
	private Long outType;
	private String billState;
	private String pid;
	private String auditState;//稽核状态
	private String using;
	private String financialSubjects;

	/** default constructor */
	public MatStoreOut() {
	}

	/** full constructor */
	public MatStoreOut(String uuid, String outNo, String outName, String dept,
			Date outDate, String sendWare, String matType, String useWay,
			String bdgid, String bdgno, String bdgname, String volumeId,
			String volumeNo, String volumeName, String dealMan, String remark,
			Long outType, String billState, String pid, String auditState,
			String using, String financialSubjects) {
		super();
		this.uuid = uuid;
		this.outNo = outNo;
		this.outName = outName;
		this.dept = dept;
		this.outDate = outDate;
		this.sendWare = sendWare;
		this.matType = matType;
		this.useWay = useWay;
		this.bdgid = bdgid;
		this.bdgno = bdgno;
		this.bdgname = bdgname;
		this.volumeId = volumeId;
		this.volumeNo = volumeNo;
		this.volumeName = volumeName;
		this.dealMan = dealMan;
		this.remark = remark;
		this.outType = outType;
		this.billState = billState;
		this.pid = pid;
		this.auditState = auditState;
		this.using = using;
		this.financialSubjects = financialSubjects;
	}

	// Property accessors
	public String getPid() {
		return pid;
	}

	
	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getUuid() {
		return this.uuid;
	}


	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getOutNo() {
		return this.outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public String getOutName() {
		return this.outName;
	}

	public void setOutName(String outName) {
		this.outName = outName;
	}

	public String getDept() {
		return this.dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public Date getOutDate() {
		return this.outDate;
	}

	public void setOutDate(Date outDate) {
		this.outDate = outDate;
	}

	public String getSendWare() {
		return this.sendWare;
	}

	public void setSendWare(String sendWare) {
		this.sendWare = sendWare;
	}

	public String getMatType() {
		return this.matType;
	}

	public void setMatType(String matType) {
		this.matType = matType;
	}

	public String getUseWay() {
		return this.useWay;
	}

	public void setUseWay(String useWay) {
		this.useWay = useWay;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgno() {
		return this.bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return this.bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public String getVolumeId() {
		return this.volumeId;
	}

	public void setVolumeId(String volumeId) {
		this.volumeId = volumeId;
	}

	public String getVolumeNo() {
		return this.volumeNo;
	}

	public void setVolumeNo(String volumeNo) {
		this.volumeNo = volumeNo;
	}

	public String getVolumeName() {
		return this.volumeName;
	}

	public void setVolumeName(String volumeName) {
		this.volumeName = volumeName;
	}

	public String getDealMan() {
		return this.dealMan;
	}

	public void setDealMan(String dealMan) {
		this.dealMan = dealMan;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getOutType() {
		return this.outType;
	}

	public void setOutType(Long outType) {
		this.outType = outType;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getAuditState() {
		return auditState;
	}

	public void setAuditState(String auditState) {
		this.auditState = auditState;
	}

	public String getUsing() {
		return using;
	}

	public void setUsing(String using) {
		this.using = using;
	}

	public String getFinancialSubjects() {
		return financialSubjects;
	}

	public void setFinancialSubjects(String financialSubjects) {
		this.financialSubjects = financialSubjects;
	}

}