package com.sgepit.pmis.finalAccounts.bdgStructure.hbm;

import java.math.BigDecimal;

public class FAInstallEquReport {
	
	private String uids;
	private String bdgid;
	private String bdgname;
	private BigDecimal installBdgValue;
	private BigDecimal installRealValue;
	private BigDecimal installBdgRealDiff;
	private Double installBdgRealDiffPer;
	private BigDecimal equBdgValue;
	private BigDecimal equRealValue;
	private BigDecimal equBdgRealDiff;
	private Double equBdgRealDiffPer;
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
	 * @return the installBdgValue
	 */
	public BigDecimal getInstallBdgValue() {
		return installBdgValue;
	}
	/**
	 * @param installBdgValue the installBdgValue to set
	 */
	public void setInstallBdgValue(BigDecimal installBdgValue) {
		this.installBdgValue = installBdgValue;
	}
	/**
	 * @return the installRealValue
	 */
	public BigDecimal getInstallRealValue() {
		return installRealValue;
	}
	/**
	 * @param installRealValue the installRealValue to set
	 */
	public void setInstallRealValue(BigDecimal installRealValue) {
		this.installRealValue = installRealValue;
	}
	/**
	 * @return the installBdgRealDiff
	 */
	public BigDecimal getInstallBdgRealDiff() {
		return installBdgRealDiff;
	}
	/**
	 * @param installBdgRealDiff the installBdgRealDiff to set
	 */
	public void setInstallBdgRealDiff(BigDecimal installBdgRealDiff) {
		this.installBdgRealDiff = installBdgRealDiff;
	}
	/**
	 * @return the installBdgRealDiffPer
	 */
	public Double getInstallBdgRealDiffPer() {
		return installBdgRealDiffPer;
	}
	/**
	 * @param installBdgRealDiffPer the installBdgRealDiffPer to set
	 */
	public void setInstallBdgRealDiffPer(Double installBdgRealDiffPer) {
		this.installBdgRealDiffPer = installBdgRealDiffPer;
	}
	/**
	 * @return the equBdgValue
	 */
	public BigDecimal getEquBdgValue() {
		return equBdgValue;
	}
	/**
	 * @param equBdgValue the equBdgValue to set
	 */
	public void setEquBdgValue(BigDecimal equBdgValue) {
		this.equBdgValue = equBdgValue;
	}
	/**
	 * @return the equRealValue
	 */
	public BigDecimal getEquRealValue() {
		return equRealValue;
	}
	/**
	 * @param equRealValue the equRealValue to set
	 */
	public void setEquRealValue(BigDecimal equRealValue) {
		this.equRealValue = equRealValue;
	}
	/**
	 * @return the equBdgRealDiff
	 */
	public BigDecimal getEquBdgRealDiff() {
		return equBdgRealDiff;
	}
	/**
	 * @param equBdgRealDiff the equBdgRealDiff to set
	 */
	public void setEquBdgRealDiff(BigDecimal equBdgRealDiff) {
		this.equBdgRealDiff = equBdgRealDiff;
	}
	/**
	 * @return the equBdgRealDiffPer
	 */
	public Double getEquBdgRealDiffPer() {
		return equBdgRealDiffPer;
	}
	/**
	 * @param equBdgRealDiffPer the equBdgRealDiffPer to set
	 */
	public void setEquBdgRealDiffPer(Double equBdgRealDiffPer) {
		this.equBdgRealDiffPer = equBdgRealDiffPer;
	}

}
