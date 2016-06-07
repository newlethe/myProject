package com.sgepit.pmis.finalAccounts.finance.hbm;

import java.math.BigDecimal;

public class FAOutcomeAppReport {
	private String uids;
	private String bdgid;
	private String bdgname;
	private BigDecimal deferredExpense;
	private BigDecimal buildPubExpense;
	private BigDecimal buildExclExpense;
	private BigDecimal installPubExpense;
	private BigDecimal installExclExpense;
	private BigDecimal equPubExpense;
	private BigDecimal equExclExpense;
	private String exclProperties;
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
	 * @return the deferredExpense
	 */
	public BigDecimal getDeferredExpense() {
		return deferredExpense;
	}
	/**
	 * @param deferredExpense the deferredExpense to set
	 */
	public void setDeferredExpense(BigDecimal deferredExpense) {
		this.deferredExpense = deferredExpense;
	}
	/**
	 * @return the buildPubExpense
	 */
	public BigDecimal getBuildPubExpense() {
		return buildPubExpense;
	}
	/**
	 * @param buildPubExpense the buildPubExpense to set
	 */
	public void setBuildPubExpense(BigDecimal buildPubExpense) {
		this.buildPubExpense = buildPubExpense;
	}
	/**
	 * @return the buildExclExpense
	 */
	public BigDecimal getBuildExclExpense() {
		return buildExclExpense;
	}
	/**
	 * @param buildExclExpense the buildExclExpense to set
	 */
	public void setBuildExclExpense(BigDecimal buildExclExpense) {
		this.buildExclExpense = buildExclExpense;
	}
	/**
	 * @return the installPubExpense
	 */
	public BigDecimal getInstallPubExpense() {
		return installPubExpense;
	}
	/**
	 * @param installPubExpense the installPubExpense to set
	 */
	public void setInstallPubExpense(BigDecimal installPubExpense) {
		this.installPubExpense = installPubExpense;
	}
	/**
	 * @return the installExclExpense
	 */
	public BigDecimal getInstallExclExpense() {
		return installExclExpense;
	}
	/**
	 * @param installExclExpense the installExclExpense to set
	 */
	public void setInstallExclExpense(BigDecimal installExclExpense) {
		this.installExclExpense = installExclExpense;
	}
	/**
	 * @return the equPubExpense
	 */
	public BigDecimal getEquPubExpense() {
		return equPubExpense;
	}
	/**
	 * @param equPubExpense the equPubExpense to set
	 */
	public void setEquPubExpense(BigDecimal equPubExpense) {
		this.equPubExpense = equPubExpense;
	}
	/**
	 * @return the equExclExpense
	 */
	public BigDecimal getEquExclExpense() {
		return equExclExpense;
	}
	/**
	 * @param equExclExpense the equExclExpense to set
	 */
	public void setEquExclExpense(BigDecimal equExclExpense) {
		this.equExclExpense = equExclExpense;
	}
	/**
	 * @return the exclProperties
	 */
	public String getExclProperties() {
		return exclProperties;
	}
	/**
	 * @param exclProperties the exclProperties to set
	 */
	public void setExclProperties(String exclProperties) {
		this.exclProperties = exclProperties;
	}
	
	
}
