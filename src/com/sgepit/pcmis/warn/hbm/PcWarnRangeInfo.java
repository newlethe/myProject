package com.sgepit.pcmis.warn.hbm;

import java.io.Serializable;

public class PcWarnRangeInfo implements Serializable {
private String uids;
private String pid;
private String projectid;
private Double rangemax;
private Double rangemin;
private String warnrulesid;
public PcWarnRangeInfo() {
	super();
	// TODO Auto-generated constructor stub
}
public PcWarnRangeInfo(String uids, String pid, String projectid,
		Double rangemax, Double rangemin, String warnrulesid) {
	super();
	this.uids = uids;
	this.pid = pid;
	this.projectid = projectid;
	this.rangemax = rangemax;
	this.rangemin = rangemin;
	this.warnrulesid = warnrulesid;
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
public String getProjectid() {
	return projectid;
}
public void setProjectid(String projectid) {
	this.projectid = projectid;
}
public Double getRangemax() {
	return rangemax;
}
public void setRangemax(Double rangemax) {
	this.rangemax = rangemax;
}
public Double getRangemin() {
	return rangemin;
}
public void setRangemin(Double rangemin) {
	this.rangemin = rangemin;
}
public String getWarnrulesid() {
	return warnrulesid;
}
public void setWarnrulesid(String warnrulesid) {
	this.warnrulesid = warnrulesid;
}
}
