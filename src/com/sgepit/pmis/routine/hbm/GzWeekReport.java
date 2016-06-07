package com.sgepit.pmis.routine.hbm;

import java.util.Date;

/**
 * GzWeekReport entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GzWeekReport implements java.io.Serializable {

	// Fields

	private String uuid;
	private String flowid;
	private String reportweek;
	private Date reporttime;
	private String reportuser;
	private String reportdept;
	private String reportdeptlead;
	private String planstate;
	private String completestate;
	private String recordstate;
	private Long billstate;
    private String pid;
	// Constructors


	/** default constructor */
	public GzWeekReport() {
	}

	/** full constructor */
	public GzWeekReport(String flowid, String reportweek, Date reporttime,
			String reportuser, String reportdept, String reportdeptlead,
			String planstate, String completestate, String recordstate,
			Long billstate) {
		this.flowid = flowid;
		this.reportweek = reportweek;
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

	public String getReportweek() {
		return this.reportweek;
	}

	public void setReportweek(String reportweek) {
		this.reportweek = reportweek;
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

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}
	

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}