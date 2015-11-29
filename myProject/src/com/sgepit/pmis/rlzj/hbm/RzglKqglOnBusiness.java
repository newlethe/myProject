package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * RzglKqglOnBusiness entity. @author MyEclipse Persistence Tools
 */

public class RzglKqglOnBusiness implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String employeeId;
	private String deptId;
	private String approver;
	private String reason;
	private String address;
	private Date planStartDate;
	private Date planFinishDate;
	private Date actualStartDate;
	private Date actualFinishDate;
	private String billState;

	// Constructors

	/** default constructor */
	public RzglKqglOnBusiness() {
	}

	/** full constructor */
	public RzglKqglOnBusiness(String pid, String employeeId, String deptId,
			String approver, String reason, String address, Date planStartDate,
			Date planFinishDate, Date actualStartDate, Date actualFinishDate,
			String billState) {
		this.pid = pid;
		this.employeeId = employeeId;
		this.deptId = deptId;
		this.approver = approver;
		this.reason = reason;
		this.address = address;
		this.planStartDate = planStartDate;
		this.planFinishDate = planFinishDate;
		this.actualStartDate = actualStartDate;
		this.actualFinishDate = actualFinishDate;
		this.billState = billState;
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

	public String getEmployeeId() {
		return this.employeeId;
	}

	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getApprover() {
		return this.approver;
	}

	public void setApprover(String approver) {
		this.approver = approver;
	}

	public String getReason() {
		return this.reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Date getPlanStartDate() {
		return this.planStartDate;
	}

	public void setPlanStartDate(Date planStartDate) {
		this.planStartDate = planStartDate;
	}

	public Date getPlanFinishDate() {
		return this.planFinishDate;
	}

	public void setPlanFinishDate(Date planFinishDate) {
		this.planFinishDate = planFinishDate;
	}

	public Date getActualStartDate() {
		return this.actualStartDate;
	}

	public void setActualStartDate(Date actualStartDate) {
		this.actualStartDate = actualStartDate;
	}

	public Date getActualFinishDate() {
		return this.actualFinishDate;
	}

	public void setActualFinishDate(Date actualFinishDate) {
		this.actualFinishDate = actualFinishDate;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

}