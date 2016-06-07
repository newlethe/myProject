package com.sgepit.pmis.finalAccounts.bdgStructure.hbm;

import java.math.BigDecimal;

public class FABuildOveReport {
	private String uids;
	private String bdgid;
	private String bdgname;
	private BigDecimal buildBdgValue;
	private BigDecimal buildRealValue;
	private BigDecimal bdgRealDiff;
	private Double bdgRealDiffPer;
	private String pid;
	
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	/**
	 * @return the uids
	 */
	public String getUids() {
		return uids;
	}
	/**
	 * @param uids the uids to set
	 */
	public void setUids(String uids) {
		this.uids = uids;
	}
	/**
	 * @return the bdgid
	 */
	public String getBdgid() {
		return bdgid;
	}
	/**
	 * @param bdgid the bdgid to set
	 */
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	/**
	 * @return the bdgname
	 */
	public String getBdgname() {
		return bdgname;
	}
	/**
	 * @param bdgname the bdgname to set
	 */
	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}
	/**
	 * @return the buildBdgValue
	 */
	public BigDecimal getBuildBdgValue() {
		return buildBdgValue;
	}
	/**
	 * @param buildBdgValue the buildBdgValue to set
	 */
	public void setBuildBdgValue(BigDecimal buildBdgValue) {
		this.buildBdgValue = buildBdgValue;
	}
	/**
	 * @return the buildRealValue
	 */
	public BigDecimal getBuildRealValue() {
		return buildRealValue;
	}
	/**
	 * @param buildRealValue the buildRealValue to set
	 */
	public void setBuildRealValue(BigDecimal buildRealValue) {
		this.buildRealValue = buildRealValue;
	}
	/**
	 * @return the bdgRealDiff
	 */
	public BigDecimal getBdgRealDiff() {
		return bdgRealDiff;
	}
	/**
	 * @param bdgRealDiff the bdgRealDiff to set
	 */
	public void setBdgRealDiff(BigDecimal bdgRealDiff) {
		this.bdgRealDiff = bdgRealDiff;
	}
	/**
	 * @return the bdgRealDiffPer
	 */
	public Double getBdgRealDiffPer() {
		return bdgRealDiffPer;
	}
	/**
	 * @param bdgRealDiffPer the bdgRealDiffPer to set
	 */
	public void setBdgRealDiffPer(Double bdgRealDiffPer) {
		this.bdgRealDiffPer = bdgRealDiffPer;
	}

}
