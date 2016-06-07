package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquJzDate entity. @author MyEclipse Persistence Tools
 */

public class EquJzDate implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private Long jzNum;
	private String jzName;
	private String sbName;
	private Date startDate;
	private Date endDate;
	private Date remindDate;
	private String remindRange;
	private Integer finished;

	// Constructors

	/** default constructor */
	public EquJzDate() {
	}

	/** minimal constructor */
	public EquJzDate(String pid, String conid) {
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public EquJzDate(String pid, String conid, Long jzNum, String jzName,
			String sbName, Date startDate, Date endDate, Date remindDate,
			String remindRange, Integer finished) {
		this.pid = pid;
		this.conid = conid;
		this.jzNum = jzNum;
		this.jzName = jzName;
		this.sbName = sbName;
		this.startDate = startDate;
		this.endDate = endDate;
		this.remindDate = remindDate;
		this.remindRange = remindRange; 
		this.finished = finished;
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

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Long getJzNum() {
		return this.jzNum;
	}

	public void setJzNum(Long jzNum) {
		this.jzNum = jzNum;
	}

	public String getJzName() {
		return this.jzName;
	}

	public void setJzName(String jzName) {
		this.jzName = jzName;
	}

	public String getSbName() {
		return this.sbName;
	}

	public void setSbName(String sbName) {
		this.sbName = sbName;
	}

	public Date getStartDate() {
		return this.startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return this.endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Date getRemindDate() {
		return remindDate;
	}

	public void setRemindDate(Date remindDate) {
		this.remindDate = remindDate;
	}

	public String getRemindRange() {
		return remindRange;
	}

	public void setRemindRange(String remindRange) {
		this.remindRange = remindRange;
	}

	public Integer getFinished() {
		return finished;
	}

	public void setFinished(Integer finished) {
		this.finished = finished;
	}

}