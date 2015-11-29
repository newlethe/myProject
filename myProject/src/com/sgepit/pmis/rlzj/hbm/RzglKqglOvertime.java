package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * RzglKqglOvertime entity. @author MyEclipse Persistence Tools
 */

public class RzglKqglOvertime implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String employeeId;
	private String deptId;
	private String approver;
	private String workDescribe;
	private Double hours;
	private Date planStartDate;
	private Date planFinishDate;
	private String billState;

	// Constructors

	/** default constructor */
	public RzglKqglOvertime() {
	}

	/** full constructor */
	public RzglKqglOvertime(String pid, String employeeId, String deptId,
			String approver, String workDescribe, Double hours,
			Date planStartDate, Date planFinishDate, String billState) {
		this.pid = pid;
		this.employeeId = employeeId;
		this.deptId = deptId;
		this.approver = approver;
		this.workDescribe = workDescribe;
		this.hours = hours;
		this.planStartDate = planStartDate;
		this.planFinishDate = planFinishDate;
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

	public String getWorkDescribe() {
		return this.workDescribe;
	}

	public void setWorkDescribe(String workDescribe) {
		this.workDescribe = workDescribe;
	}

	public Double getHours() {
		return this.hours;
	}

	public void setHours(Double hours) {
		this.hours = hours;
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

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

}