package com.sgepit.pmis.finalAccounts.bdgStructure.hbm;

import java.math.BigDecimal;

public class FAOverallReport {
	private String uids;
	private String faBdgid;
	private String faBdgname;
	private BigDecimal buildBdgValue;
	private BigDecimal installBdgValue;
	private BigDecimal equBdgValue;
	private BigDecimal otherBdgValue;
	private BigDecimal totalBdgValue;
	private BigDecimal buildRealValue;
	private BigDecimal installRealValue;
	private BigDecimal equRealValue;
	private BigDecimal otherRealValue;
	private BigDecimal totalRealValue;
	private BigDecimal bdgRealDiff;
	private Double bdgRealDiffPer;
	private String pid;
	
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
	public String getFaBdgid() {
		return faBdgid;
	}
	public void setFaBdgid(String faBdgid) {
		this.faBdgid = faBdgid;
	}
	public String getFaBdgname() {
		return faBdgname;
	}
	public void setFaBdgname(String faBdgname) {
		this.faBdgname = faBdgname;
	}
	public BigDecimal getBuildBdgValue() {
		return buildBdgValue;
	}
	public void setBuildBdgValue(BigDecimal buildBdgValue) {
		this.buildBdgValue = buildBdgValue;
	}
	public BigDecimal getInstallBdgValue() {
		return installBdgValue;
	}
	public void setInstallBdgValue(BigDecimal installBdgValue) {
		this.installBdgValue = installBdgValue;
	}
	public BigDecimal getEquBdgValue() {
		return equBdgValue;
	}
	public void setEquBdgValue(BigDecimal equBdgValue) {
		this.equBdgValue = equBdgValue;
	}
	public BigDecimal getOtherBdgValue() {
		return otherBdgValue;
	}
	public void setOtherBdgValue(BigDecimal otherBdgValue) {
		this.otherBdgValue = otherBdgValue;
	}
	public BigDecimal getTotalBdgValue() {
		return totalBdgValue;
	}
	public void setTotalBdgValue(BigDecimal totalBdgValue) {
		this.totalBdgValue = totalBdgValue;
	}
	public BigDecimal getBuildRealValue() {
		return buildRealValue;
	}
	public void setBuildRealValue(BigDecimal buildRealValue) {
		this.buildRealValue = buildRealValue;
	}
	public BigDecimal getInstallRealValue() {
		return installRealValue;
	}
	public void setInstallRealValue(BigDecimal installRealValue) {
		this.installRealValue = installRealValue;
	}
	public BigDecimal getEquRealValue() {
		return equRealValue;
	}
	public void setEquRealValue(BigDecimal equRealValue) {
		this.equRealValue = equRealValue;
	}
	public BigDecimal getOtherRealValue() {
		return otherRealValue;
	}
	public void setOtherRealValue(BigDecimal otherRealValue) {
		this.otherRealValue = otherRealValue;
	}
	public BigDecimal getTotalRealValue() {
		return totalRealValue;
	}
	public void setTotalRealValue(BigDecimal totalRealValue) {
		this.totalRealValue = totalRealValue;
	}
	public BigDecimal getBdgRealDiff() {
		return bdgRealDiff;
	}
	public void setBdgRealDiff(BigDecimal bdgRealDiff) {
		this.bdgRealDiff = bdgRealDiff;
	}
	public Double getBdgRealDiffPer() {
		return bdgRealDiffPer;
	}
	public void setBdgRealDiffPer(Double bdgRealDiffPer) {
		this.bdgRealDiffPer = bdgRealDiffPer;
	}

}
