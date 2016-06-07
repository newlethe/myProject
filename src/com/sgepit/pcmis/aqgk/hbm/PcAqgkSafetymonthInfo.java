package com.sgepit.pcmis.aqgk.hbm;

import java.util.Date;

/**
 * PcAqgkSafetymonthInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcAqgkSafetymonthInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private Date infoTime;
	private String reportperson;
	private String title;
	private String state;
	private String sjType;

	// Constructors

	/** default constructor */
	public PcAqgkSafetymonthInfo() {
	}

	/** full constructor */
	public PcAqgkSafetymonthInfo(String pid, Date infoTime,
			String reportperson, String state,String sjType) {
		this.pid = pid;
		this.infoTime = infoTime;
		this.reportperson = reportperson;
		this.state = state;
		this.sjType=sjType;
	}

	// Property accessors

	

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Date getInfoTime() {
		return this.infoTime;
	}

	public void setInfoTime(Date infoTime) {
		this.infoTime = infoTime;
	}

	public String getReportperson() {
		return this.reportperson;
	}

	public void setReportperson(String reportperson) {
		this.reportperson = reportperson;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getSjType() {
		return sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}


}