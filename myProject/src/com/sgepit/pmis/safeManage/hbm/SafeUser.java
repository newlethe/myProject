package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafeUser entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeUser implements java.io.Serializable {

	// Fields

	private String bh;
	private String name;
	private String department;
	private String sex;
	private Date birthday;
	private String position;
	private String education;
	private Date beginWork;
	private Double timeWithSecuty;
	private String id;
	private String certificationClass;
	private String certificationNo;
	private String departmentGiveCertification;
	private String bz;
	private String photo;
	private String type;
	private String conserveTwo;

	// Constructors

	/** default constructor */
	public SafeUser() {
	}

	/** minimal constructor */
	public SafeUser(String bh) {
		this.bh = bh;
	}

	/** full constructor */
	public SafeUser(String bh, String name, String department, String sex,
			Date birthday, String position, String education, Date beginWork,
			Double timeWithSecuty, String id, String certificationClass,
			String certificationNo, String departmentGiveCertification,
			String bz, String photo, String conserveOne, String conserveTwo) {
		this.bh = bh;
		this.name = name;
		this.department = department;
		this.sex = sex;
		this.birthday = birthday;
		this.position = position;
		this.education = education;
		this.beginWork = beginWork;
		this.timeWithSecuty = timeWithSecuty;
		this.id = id;
		this.certificationClass = certificationClass;
		this.certificationNo = certificationNo;
		this.departmentGiveCertification = departmentGiveCertification;
		this.bz = bz;
		this.photo = photo;
		this.type = type;
		this.conserveTwo = conserveTwo;
	}

	// Property accessors

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDepartment() {
		return this.department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public Date getBirthday() {
		return this.birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getPosition() {
		return this.position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getEducation() {
		return this.education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	public Date getBeginWork() {
		return this.beginWork;
	}

	public void setBeginWork(Date beginWork) {
		this.beginWork = beginWork;
	}

	public Double getTimeWithSecuty() {
		return this.timeWithSecuty;
	}

	public void setTimeWithSecuty(Double timeWithSecuty) {
		this.timeWithSecuty = timeWithSecuty;
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCertificationClass() {
		return this.certificationClass;
	}

	public void setCertificationClass(String certificationClass) {
		this.certificationClass = certificationClass;
	}

	public String getCertificationNo() {
		return this.certificationNo;
	}

	public void setCertificationNo(String certificationNo) {
		this.certificationNo = certificationNo;
	}

	public String getDepartmentGiveCertification() {
		return this.departmentGiveCertification;
	}

	public void setDepartmentGiveCertification(
			String departmentGiveCertification) {
		this.departmentGiveCertification = departmentGiveCertification;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getPhoto() {
		return this.photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public String getConserveTwo() {
		return this.conserveTwo;
	}

	public void setConserveTwo(String conserveTwo) {
		this.conserveTwo = conserveTwo;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}