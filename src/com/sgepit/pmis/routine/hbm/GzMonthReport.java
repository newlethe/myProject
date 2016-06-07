package com.sgepit.pmis.routine.hbm;

import java.util.Date;

/**
 * GzMonthReport entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GzMonthReport implements java.io.Serializable {

	// Fields

	private String uuid;
	private String flowid;
	private String reportmonth;
	private Date reporttime;
	private String reportuser;
	private String reportdept;
	private String reportdeptlead;
	private String planstate;
	private String completestate;
	private String recordstate;
	private String billstate;
	private String pid;

	// Constructors

	/** default constructor */
	public GzMonthReport() {
	}

	/** full constructor */
	public GzMonthReport(String flowid, String reportmonth, Date reporttime,
			String reportuser, String reportdept, String reportdeptlead,
			String planstate, String completestate, String recordstate,
			String billstate) {
		this.flowid = flowid;
		this.reportmonth = reportmonth;
		this.reporttime = reporttime;
		this.reportuser = reportuser;
		this.reportdept = reportdept;
		this.reportdeptlead = reportdeptlead;
		this.planstate = planstate;
		this.completestate = completestate;
		this.recordstate = recordstate;
		this.billstate = billstate;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getFlowid() {
		return this.flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getReportmonth() {
		return this.reportmonth;
	}

	public void setReportmonth(String reportmonth) {
		this.reportmonth = reportmonth;
	}

	public Date getReporttime() {
		return this.reporttime;
	}

	public void setReporttime(Date reporttime) {
		this.reporttime = reporttime;
	}

	public String getReportuser() {
		return this.reportuser;
	}

	public void setReportuser(String reportuser) {
		this.reportuser = reportuser;
	}

	public String getReportdept() {
		return this.reportdept;
	}

	public void setReportdept(String reportdept) {
		this.reportdept = reportdept;
	}

	public String getReportdeptlead() {
		return this.reportdeptlead;
	}

	public void setReportdeptlead(String reportdeptlead) {
		this.reportdeptlead = reportdeptlead;
	}

	public String getPlanstate() {
		return this.planstate;
	}

	public void setPlanstate(String planstate) {
		this.planstate = planstate;
	}

	public String getCompletestate() {
		return this.completestate;
	}

	public void setCompletestate(String completestate) {
		this.completestate = completestate;
	}

	public String getRecordstate() {
		return this.recordstate;
	}

	public void setRecordstate(String recordstate) {
		this.recordstate = recordstate;
	}

	public String getBillstate() {
		return this.billstate;
	}

	public void setBillstate(String billstate) {
		this.billstate = billstate;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	
}