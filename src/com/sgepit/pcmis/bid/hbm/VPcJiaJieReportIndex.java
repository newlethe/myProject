package com.sgepit.pcmis.bid.hbm;

import java.util.Date;
//查询七大报表的视图
public class VPcJiaJieReportIndex {
	private String uids;
	private String pid;
	private String period;
	private String reportName;
	private String reportPerson;
	private Date reportTime;
	private String state;
	private String type;//区分七大报表

	public VPcJiaJieReportIndex() {
	}	
	public String getPeriod() {
		return period;
	}
	public void setPeriod(String period) {
		this.period = period;
	}
	public String getReportName() {
		return reportName;
	}
	public void setReportName(String reportName) {
		this.reportName = reportName;
	}
	public String getReportPerson() {
		return reportPerson;
	}
	public void setReportPerson(String reportPerson) {
		this.reportPerson = reportPerson;
	}
	public Date getReportTime() {
		return reportTime;
	}
	public void setReportTime(Date reportTime) {
		this.reportTime = reportTime;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public VPcJiaJieReportIndex(String period, String reportName,
			String reportPerson, Date reportTime, String state, String type,String uids,String pid) {
			this.period = period;
			this.reportName = reportName;
			this.reportPerson = reportPerson;
			this.reportTime = reportTime;
			this.state = state;
			this.type = type;
			this.uids=uids;
			this.pid=pid;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
}
