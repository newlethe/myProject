package com.sgepit.pmis.vehicle.hbm;

import java.util.Date;

/**
 * VVehicleUseManagementId entity. @author MyEclipse Persistence Tools
 */

public class VVehicleUseManagement implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String applyno;
	private String applydep;
	private String applyperson;
	private String depatureplace;
	private String stopplace;
	private Date usetime;
	private Integer isround;
	private String licensenumber;
	private String driver;
	private String confirmperson;
	private String approver;
	private String applyreason;
	private String remark;

	// Constructors

	/** default constructor */
	public VVehicleUseManagement() {
	}

	/** minimal constructor */
	public VVehicleUseManagement(String uids, String pid,String applyno, Integer isround) {
		this.uids = uids;
		this.pid = pid;
		this.applyno = applyno;
		this.isround = isround;
	}

	/** full constructor */
	public VVehicleUseManagement(String uids, String pid,String applyno,
			String applydep, String applyperson, String depatureplace,
			String stopplace, Date usetime, Integer isround,
			String licensenumber, String driver, String confirmperson,
			String approver, String applyreason, String remark) {
		this.uids = uids;
		this.pid = pid;
		this.applyno = applyno;
		this.applydep = applydep;
		this.applyperson = applyperson;
		this.depatureplace = depatureplace;
		this.stopplace = stopplace;
		this.usetime = usetime;
		this.isround = isround;
		this.licensenumber = licensenumber;
		this.driver = driver;
		this.confirmperson = confirmperson;
		this.approver = approver;
		this.applyreason = applyreason;
		this.remark = remark;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getApplyno() {
		return this.applyno;
	}

	public void setApplyno(String applyno) {
		this.applyno = applyno;
	}

	public String getApplydep() {
		return this.applydep;
	}

	public void setApplydep(String applydep) {
		this.applydep = applydep;
	}

	public String getApplyperson() {
		return this.applyperson;
	}

	public void setApplyperson(String applyperson) {
		this.applyperson = applyperson;
	}

	public String getDepatureplace() {
		return this.depatureplace;
	}

	public void setDepatureplace(String depatureplace) {
		this.depatureplace = depatureplace;
	}

	public String getStopplace() {
		return this.stopplace;
	}

	public void setStopplace(String stopplace) {
		this.stopplace = stopplace;
	}

	public Date getUsetime() {
		return this.usetime;
	}

	public void setUsetime(Date usetime) {
		this.usetime = usetime;
	}

	public Integer getIsround() {
		return this.isround;
	}

	public void setIsround(Integer isround) {
		this.isround = isround;
	}

	public String getLicensenumber() {
		return this.licensenumber;
	}

	public void setLicensenumber(String licensenumber) {
		this.licensenumber = licensenumber;
	}

	public String getDriver() {
		return this.driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

	public String getConfirmperson() {
		return this.confirmperson;
	}

	public void setConfirmperson(String confirmperson) {
		this.confirmperson = confirmperson;
	}

	public String getApprover() {
		return this.approver;
	}

	public void setApprover(String approver) {
		this.approver = approver;
	}

	public String getApplyreason() {
		return this.applyreason;
	}

	public void setApplyreason(String applyreason) {
		this.applyreason = applyreason;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
	
}