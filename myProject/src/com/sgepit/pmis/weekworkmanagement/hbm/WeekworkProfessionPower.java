package com.sgepit.pmis.weekworkmanagement.hbm;

/**
 * WeekworkProfessionPower entity. @author MyEclipse Persistence Tools
 */

public class WeekworkProfessionPower implements java.io.Serializable {

	// Fields

	private String uids;
	private String unitId;
	private String userId;
	private String professionalId;

	// Constructors

	/** default constructor */
	public WeekworkProfessionPower() {
	}

	/** full constructor */
	public WeekworkProfessionPower(String unitId, String userId,
			String professionalId) {
		this.unitId = unitId;
		this.userId = userId;
		this.professionalId = professionalId;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getProfessionalId() {
		return this.professionalId;
	}

	public void setProfessionalId(String professionalId) {
		this.professionalId = professionalId;
	}

}