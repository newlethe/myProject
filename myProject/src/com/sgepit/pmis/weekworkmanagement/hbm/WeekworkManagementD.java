package com.sgepit.pmis.weekworkmanagement.hbm;

/**
 * WeekworkManagementD entity. @author MyEclipse Persistence Tools
 */

public class WeekworkManagementD implements java.io.Serializable {

	// Fields

	private String uids;
	private String workableItems;
	private String dutyPerson;
	private String workSchedule;
	private String performance;
	private String mainId;

	// Constructors

	/** default constructor */
	public WeekworkManagementD() {
	}

	/** full constructor */
	public WeekworkManagementD(String workableItems, String dutyPerson,
			String workSchedule, String performance, String mainId) {
		this.workableItems = workableItems;
		this.dutyPerson = dutyPerson;
		this.workSchedule = workSchedule;
		this.performance = performance;
		this.mainId = mainId;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getWorkableItems() {
		return this.workableItems;
	}

	public void setWorkableItems(String workableItems) {
		this.workableItems = workableItems;
	}

	public String getDutyPerson() {
		return this.dutyPerson;
	}

	public void setDutyPerson(String dutyPerson) {
		this.dutyPerson = dutyPerson;
	}

	public String getWorkSchedule() {
		return this.workSchedule;
	}

	public void setWorkSchedule(String workSchedule) {
		this.workSchedule = workSchedule;
	}

	public String getPerformance() {
		return this.performance;
	}

	public void setPerformance(String performance) {
		this.performance = performance;
	}

	public String getMainId() {
		return this.mainId;
	}

	public void setMainId(String mainId) {
		this.mainId = mainId;
	}

}