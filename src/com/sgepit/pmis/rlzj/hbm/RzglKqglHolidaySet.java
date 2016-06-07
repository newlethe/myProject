package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * RzglKqglHolidaySet entity. @author MyEclipse Persistence Tools
 */

public class RzglKqglHolidaySet implements java.io.Serializable {

	// Fields

	private String uids;
	private Date holidayDate;
	private String type;
	private String remark;
	private String pid;

	// Constructors

	/** default constructor */
	public RzglKqglHolidaySet() {
	}

	/** full constructor */
	public RzglKqglHolidaySet(Date holidayDate, String type, String remark,
			String pid) {
		this.holidayDate = holidayDate;
		this.type = type;
		this.remark = remark;
		this.pid = pid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public Date getHolidayDate() {
		return this.holidayDate;
	}

	public void setHolidayDate(Date holidayDate) {
		this.holidayDate = holidayDate;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}