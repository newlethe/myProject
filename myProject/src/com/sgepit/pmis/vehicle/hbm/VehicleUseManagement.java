package com.sgepit.pmis.vehicle.hbm;

import java.util.Date;

/**
 * VehicleUseManagement entity. @author MyEclipse Persistence Tools
 */

public class VehicleUseManagement implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String applyno;
	private String applyperson;
	private String applydep;
	private String applyreason;
	private Date usetime;
	private String depatureplace;
	private String stopplace;
	private Integer isround;
	private Integer state;
	private String confirmperson;
	private String approver;
	private String licensenumber;
	private String driver;
	private Double startmileage;
	private Double endmileage;
	private Double mileagedifference;
	private String remark;

	// Constructors

	/** default constructor */
	public VehicleUseManagement() {
	}

	/** minimal constructor */
	public VehicleUseManagement(String pid,String applyno, Integer isround) {
		this.pid = pid;
		this.applyno = applyno;
		this.isround = isround;
	}

	/** full constructor */
	public VehicleUseManagement(String pid,String applyno, String applyperson,
			String applydep, String applyreason, Date usetime,
			String depatureplace, String stopplace, Integer isround,
			Integer state, String confirmperson, String approver,
			String licensenumber, String driver, Double startmileage,
			Double endmileage, Double mileagedifference, String remark) {
		this.pid = pid;
		this.applyno = applyno;
		this.applyperson = applyperson;
		this.applydep = applydep;
		this.applyreason = applyreason;
		this.usetime = usetime;
		this.depatureplace = depatureplace;
		this.stopplace = stopplace;
		this.isround = isround;
		this.state = state;
		this.confirmperson = confirmperson;
		this.approver = approver;
		this.licensenumber = licensenumber;
		this.driver = driver;
		this.startmileage = startmileage;
		this.endmileage = endmileage;
		this.mileagedifference = mileagedifference;
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

	public String getApplyperson() {
		return this.applyperson;
	}

	public void setApplyperson(String applyperson) {
		this.applyperson = applyperson;
	}

	public String getApplydep() {
		return this.applydep;
	}

	public void setApplydep(String applydep) {
		this.applydep = applydep;
	}

	public String getApplyreason() {
		return this.applyreason;
	}

	public void setApplyreason(String applyreason) {
		this.applyreason = applyreason;
	}

	public Date getUsetime() {
		return this.usetime;
	}

	public void setUsetime(Date usetime) {
		this.usetime = usetime;
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

	public Integer getIsround() {
		return this.isround;
	}

	public void setIsround(Integer isround) {
		this.isround = isround;
	}

	public Integer getState() {
		return this.state;
	}

	public void setState(Integer state) {
		this.state = state;
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

	public Double getStartmileage() {
		return this.startmileage;
	}

	public void setStartmileage(Double startmileage) {
		this.startmileage = startmileage;
	}

	public Double getEndmileage() {
		return this.endmileage;
	}

	public void setEndmileage(Double endmileage) {
		this.endmileage = endmileage;
	}

	public Double getMileagedifference() {
		return this.mileagedifference;
	}

	public void setMileagedifference(Double mileagedifference) {
		this.mileagedifference = mileagedifference;
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