package com.sgepit.frame.operatehistory.hbm;

import java.util.Date;

/**
 * UOperateHistory entity. @author MyEclipse Persistence Tools
 */

public class UOperateHistory implements java.io.Serializable {

	// Fields

	private String uids;
	private String unitId;
	private String operateUser;
	private Date operateTime;
	private String userCharactor;
	private String operateType;
	private String operateDescription;
	private String operateState;

	// Constructors

	/** default constructor */
	public UOperateHistory() {
	}

	/** full constructor */
	public UOperateHistory(String unitId, String operateUser, Date operateTime,
			String userCharactor, String operateType,
			String operateDescription, String operateState) {
		this.unitId = unitId;
		this.operateUser = operateUser;
		this.operateTime = operateTime;
		this.userCharactor = userCharactor;
		this.operateType = operateType;
		this.operateDescription = operateDescription;
		this.operateState = operateState;
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

	public String getOperateUser() {
		return this.operateUser;
	}

	public void setOperateUser(String operateUser) {
		this.operateUser = operateUser;
	}

	public Date getOperateTime() {
		return this.operateTime;
	}

	public void setOperateTime(Date operateTime) {
		this.operateTime = operateTime;
	}

	public String getUserCharactor() {
		return this.userCharactor;
	}

	public void setUserCharactor(String userCharactor) {
		this.userCharactor = userCharactor;
	}

	public String getOperateType() {
		return this.operateType;
	}

	public void setOperateType(String operateType) {
		this.operateType = operateType;
	}

	public String getOperateDescription() {
		return this.operateDescription;
	}

	public void setOperateDescription(String operateDescription) {
		this.operateDescription = operateDescription;
	}

	public String getOperateState() {
		return this.operateState;
	}

	public void setOperateState(String operateState) {
		this.operateState = operateState;
	}

}