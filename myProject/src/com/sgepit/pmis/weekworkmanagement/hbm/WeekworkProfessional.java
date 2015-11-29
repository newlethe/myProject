package com.sgepit.pmis.weekworkmanagement.hbm;

/**
 * WeekworkProfessional entity. @author MyEclipse Persistence Tools
 */

public class WeekworkProfessional implements java.io.Serializable {

	// Fields

	private String uids;
	private String professionalCode;
	private String professionalName;
	private String pid;

	// Constructors

	/** default constructor */
	public WeekworkProfessional() {
	}

	/** full constructor */
	public WeekworkProfessional(String professionalCode,
			String professionalName, String pid) {
		this.professionalCode = professionalCode;
		this.professionalName = professionalName;
		this.pid = pid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getProfessionalCode() {
		return this.professionalCode;
	}

	public void setProfessionalCode(String professionalCode) {
		this.professionalCode = professionalCode;
	}

	public String getProfessionalName() {
		return this.professionalName;
	}

	public void setProfessionalName(String professionalName) {
		this.professionalName = professionalName;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}