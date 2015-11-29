package com.sgepit.pmis.weekworkmanagement.hbm;

/**
 * WeekworkManagementM entity. @author MyEclipse Persistence Tools
 */

public class WeekworkManagementM implements java.io.Serializable {

	// Fields

	private String uids;
	private String lastWeekWork;
	private String currentWeekWork;
	private String professionalId;
	private String weekPeriod;
	private String pid;

	// Constructors

	/** default constructor */
	public WeekworkManagementM() {
	}

	/** full constructor */
	public WeekworkManagementM(String lastWeekWork, String currentWeekWork,
			String professionalId, String weekPeriod, String pid) {
		this.lastWeekWork = lastWeekWork;
		this.currentWeekWork = currentWeekWork;
		this.professionalId = professionalId;
		this.weekPeriod = weekPeriod;
		this.pid = pid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getLastWeekWork() {
		return this.lastWeekWork;
	}

	public void setLastWeekWork(String lastWeekWork) {
		this.lastWeekWork = lastWeekWork;
	}

	public String getCurrentWeekWork() {
		return this.currentWeekWork;
	}

	public void setCurrentWeekWork(String currentWeekWork) {
		this.currentWeekWork = currentWeekWork;
	}

	public String getProfessionalId() {
		return this.professionalId;
	}

	public void setProfessionalId(String professionalId) {
		this.professionalId = professionalId;
	}

	public String getWeekPeriod() {
		return this.weekPeriod;
	}

	public void setWeekPeriod(String weekPeriod) {
		this.weekPeriod = weekPeriod;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}