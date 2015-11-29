package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * RzglKqglWorktimeSet entity. @author MyEclipse Persistence Tools
 */

public class RzglKqglWorktimeSet implements java.io.Serializable {

	// Fields

	private String uids;
	private String sjType;
	private Date onWorktimeAm;
	private Date offWorktimeAm;
	private Date onWorktimePm;
	private Date offWorktimePm;
	private Date startTime;
	private Date endTime;
	private String pid;

	// Constructors

	/** default constructor */
	public RzglKqglWorktimeSet() {
	}

	/** full constructor */
	public RzglKqglWorktimeSet(String sjType, Date onWorktimeAm,
			Date offWorktimeAm, Date onWorktimePm, Date offWorktimePm,
			Date startTime, Date endTime, String pid) {
		this.sjType = sjType;
		this.onWorktimeAm = onWorktimeAm;
		this.offWorktimeAm = offWorktimeAm;
		this.onWorktimePm = onWorktimePm;
		this.offWorktimePm = offWorktimePm;
		this.startTime = startTime;
		this.endTime = endTime;
		this.pid = pid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public Date getOnWorktimeAm() {
		return this.onWorktimeAm;
	}

	public void setOnWorktimeAm(Date onWorktimeAm) {
		this.onWorktimeAm = onWorktimeAm;
	}

	public Date getOffWorktimeAm() {
		return this.offWorktimeAm;
	}

	public void setOffWorktimeAm(Date offWorktimeAm) {
		this.offWorktimeAm = offWorktimeAm;
	}

	public Date getOnWorktimePm() {
		return this.onWorktimePm;
	}

	public void setOnWorktimePm(Date onWorktimePm) {
		this.onWorktimePm = onWorktimePm;
	}

	public Date getOffWorktimePm() {
		return this.offWorktimePm;
	}

	public void setOffWorktimePm(Date offWorktimePm) {
		this.offWorktimePm = offWorktimePm;
	}

	public Date getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return this.endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}