package com.sgepit.pmis.routine.hbm;

import java.util.Date;

/**
 * GzMonthReportList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GzMonthReportList implements java.io.Serializable {

	// Fields

	private String uuid;
	private String reportuuid;
	private String thismonthitem;
	private String thisuser;
	private Date plantime;
	private String lastmonthitem;
	private String lastuser;
	private String complete;
	private String remove;
	private String memo;

	// Constructors

	/** default constructor */
	public GzMonthReportList() {
	}

	/** full constructor */
	public GzMonthReportList(String reportuuid, String thismonthitem,
			String thisuser, Date plantime, String lastmonthitem,
			String lastuser, String complete, String remove, String memo) {
		this.reportuuid = reportuuid;
		this.thismonthitem = thismonthitem;
		this.thisuser = thisuser;
		this.plantime = plantime;
		this.lastmonthitem = lastmonthitem;
		this.lastuser = lastuser;
		this.complete = complete;
		this.remove = remove;
		this.memo = memo;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getReportuuid() {
		return this.reportuuid;
	}

	public void setReportuuid(String reportuuid) {
		this.reportuuid = reportuuid;
	}

	public String getThismonthitem() {
		return this.thismonthitem;
	}

	public void setThismonthitem(String thismonthitem) {
		this.thismonthitem = thismonthitem;
	}

	public String getThisuser() {
		return this.thisuser;
	}

	public void setThisuser(String thisuser) {
		this.thisuser = thisuser;
	}

	public Date getPlantime() {
		return this.plantime;
	}

	public void setPlantime(Date plantime) {
		this.plantime = plantime;
	}

	public String getLastmonthitem() {
		return this.lastmonthitem;
	}

	public void setLastmonthitem(String lastmonthitem) {
		this.lastmonthitem = lastmonthitem;
	}

	public String getLastuser() {
		return this.lastuser;
	}

	public void setLastuser(String lastuser) {
		this.lastuser = lastuser;
	}

	public String getComplete() {
		return this.complete;
	}

	public void setComplete(String complete) {
		this.complete = complete;
	}

	public String getRemove() {
		return this.remove;
	}

	public void setRemove(String remove) {
		this.remove = remove;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}