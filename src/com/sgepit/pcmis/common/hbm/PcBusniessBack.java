package com.sgepit.pcmis.common.hbm;

import java.util.Date;

/**
 * PcBusniessBack entity. @author MyEclipse Persistence Tools
 */

public class PcBusniessBack implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String busniessId;
	private String backUser;
	private Date backDate;
	private String backReason;
	private String busniessType;
	private String spareC1;
	private String spareC2;
	private String spareC3;
	private String spareC4;

	// Constructors

	/** default constructor */
	public PcBusniessBack() {
	}

	/** minimal constructor */
	public PcBusniessBack(String pid, String busniessId, String backUser,
			Date backDate, String backReason, String busniessType) {
		this.pid = pid;
		this.busniessId = busniessId;
		this.backUser = backUser;
		this.backDate = backDate;
		this.backReason = backReason;
		this.busniessType = busniessType;
	}

	/** full constructor */
	public PcBusniessBack(String pid, String busniessId, String backUser,
			Date backDate, String backReason, String busniessType,
			String spareC1, String spareC2, String spareC3, String spareC4) {
		this.pid = pid;
		this.busniessId = busniessId;
		this.backUser = backUser;
		this.backDate = backDate;
		this.backReason = backReason;
		this.busniessType = busniessType;
		this.spareC1 = spareC1;
		this.spareC2 = spareC2;
		this.spareC3 = spareC3;
		this.spareC4 = spareC4;
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

	public String getBusniessId() {
		return this.busniessId;
	}

	public void setBusniessId(String busniessId) {
		this.busniessId = busniessId;
	}

	public String getBackUser() {
		return this.backUser;
	}

	public void setBackUser(String backUser) {
		this.backUser = backUser;
	}

	public Date getBackDate() {
		return this.backDate;
	}

	public void setBackDate(Date backDate) {
		this.backDate = backDate;
	}

	public String getBackReason() {
		return this.backReason;
	}

	public void setBackReason(String backReason) {
		this.backReason = backReason;
	}

	public String getBusniessType() {
		return this.busniessType;
	}

	public void setBusniessType(String busniessType) {
		this.busniessType = busniessType;
	}

	public String getSpareC1() {
		return this.spareC1;
	}

	public void setSpareC1(String spareC1) {
		this.spareC1 = spareC1;
	}

	public String getSpareC2() {
		return this.spareC2;
	}

	public void setSpareC2(String spareC2) {
		this.spareC2 = spareC2;
	}

	public String getSpareC3() {
		return this.spareC3;
	}

	public void setSpareC3(String spareC3) {
		this.spareC3 = spareC3;
	}

	public String getSpareC4() {
		return this.spareC4;
	}

	public void setSpareC4(String spareC4) {
		this.spareC4 = spareC4;
	}

}