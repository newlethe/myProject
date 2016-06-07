package com.sgepit.pcmis.jdgk.hbm;

import java.util.Date;

public class PcProject {
	
	public Date buildStartDate;
	public Date buildEndDate;
	public String pid;
	public Long yiPercent;
	public String yiUid;
	public String liUid;
	
	public Date getBuildStartDate() {
		return buildStartDate;
	}
	public void setBuildStartDate(Date buildStartDate) {
		this.buildStartDate = buildStartDate;
	}
	public Date getBuildEndDate() {
		return buildEndDate;
	}
	public void setBuildEndDate(Date buildEndDate) {
		this.buildEndDate = buildEndDate;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public Long getYiPercent() {
		return yiPercent;
	}
	public void setYiPercent(Long yiPercent) {
		this.yiPercent = yiPercent;
	}
	public String getYiUid() {
		return yiUid;
	}
	public void setYiUid(String yiUid) {
		this.yiUid = yiUid;
	}
	public String getLiUid() {
		return liUid;
	}
	public void setLiUid(String liUid) {
		this.liUid = liUid;
	}

	
	
}
