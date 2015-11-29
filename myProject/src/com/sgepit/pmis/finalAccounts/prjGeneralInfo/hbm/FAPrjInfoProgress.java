package com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm;

import java.util.Date;

public class FAPrjInfoProgress {
	
	private String pid;
	private String uids;
	private String progName;
	private Date planDate;
	private Date assesDate;
	private Date actualDate;
	
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getProgName() {
		return progName;
	}
	public void setProgName(String progName) {
		this.progName = progName;
	}
	public Date getPlanDate() {
		return planDate;
	}
	public void setPlanDate(Date planDate) {
		this.planDate = planDate;
	}
	public Date getAssesDate() {
		return assesDate;
	}
	public void setAssesDate(Date assesDate) {
		this.assesDate = assesDate;
	}
	public Date getActualDate() {
		return actualDate;
	}
	public void setActualDate(Date actualDate) {
		this.actualDate = actualDate;
	}

}
