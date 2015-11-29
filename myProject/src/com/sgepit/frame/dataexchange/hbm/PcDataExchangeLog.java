package com.sgepit.frame.dataexchange.hbm;

import java.util.Date;

public class PcDataExchangeLog {
	
	private String uids;
	private String pid;
	private String txGroupId;
	private Date logDate;
	private String logContent;
	private String logType;
	private String spareC1;
	private String spareC2;
	private Integer spareN1;
	private Integer spareN2;
	private Date spareD1;
	private String fromunit;
	private String tounit;
	
	public String getFromunit() {
		return fromunit;
	}
	public void setFromunit(String fromunit) {
		this.fromunit = fromunit;
	}
	public String getTounit() {
		return tounit;
	}
	public void setTounit(String tounit) {
		this.tounit = tounit;
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
	
	public String getTxGroupId() {
		return txGroupId;
	}
	public void setTxGroupId(String txGroupId) {
		this.txGroupId = txGroupId;
	}

	public Date getLogDate() {
		return logDate;
	}
	public void setLogDate(Date logDate) {
		this.logDate = logDate;
	}
	public String getLogContent() {
		return logContent;
	}
	public void setLogContent(String logContent) {
		this.logContent = logContent;
	}
	public String getLogType() {
		return logType;
	}
	public void setLogType(String logType) {
		this.logType = logType;
	}
	public String getSpareC1() {
		return spareC1;
	}
	public void setSpareC1(String spareC1) {
		this.spareC1 = spareC1;
	}
	public String getSpareC2() {
		return spareC2;
	}
	public void setSpareC2(String spareC2) {
		this.spareC2 = spareC2;
	}
	public Integer getSpareN1() {
		return spareN1;
	}
	public void setSpareN1(Integer spareN1) {
		this.spareN1 = spareN1;
	}
	public Integer getSpareN2() {
		return spareN2;
	}
	public void setSpareN2(Integer spareN2) {
		this.spareN2 = spareN2;
	}
	public Date getSpareD1() {
		return spareD1;
	}
	public void setSpareD1(Date spareD1) {
		this.spareD1 = spareD1;
	}

}
