package com.sgepit.pmis.finalAccounts.finance.hbm;

import java.math.BigDecimal;

public class FAOtherDetailReport {
	
	private String uids;
	private String bdgid;
	private String bdgname;
	private BigDecimal bdgmoney;
	private BigDecimal deferredExpense;
	private BigDecimal fixedAssets;
	private BigDecimal currentAssets;
	private BigDecimal IntangibleAssets;
	private BigDecimal termDeferredExpense;
	private BigDecimal total;
	private String remark;
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
	 * @return the bdgmoney
	 */
	public BigDecimal getBdgmoney() {
		return bdgmoney;
	}
	/**
	 * @param bdgmoney the bdgmoney to set
	 */
	public void setBdgmoney(BigDecimal bdgmoney) {
		this.bdgmoney = bdgmoney;
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
	 * @return the fixedAssets
	 */
	public BigDecimal getFixedAssets() {
		return fixedAssets;
	}
	/**
	 * @param fixedAssets the fixedAssets to set
	 */
	public void setFixedAssets(BigDecimal fixedAssets) {
		this.fixedAssets = fixedAssets;
	}
	/**
	 * @return the currentAssets
	 */
	public BigDecimal getCurrentAssets() {
		return currentAssets;
	}
	/**
	 * @param currentAssets the currentAssets to set
	 */
	public void setCurrentAssets(BigDecimal currentAssets) {
		this.currentAssets = currentAssets;
	}
	/**
	 * @return the intangibleAssets
	 */
	public BigDecimal getIntangibleAssets() {
		return IntangibleAssets;
	}
	/**
	 * @param intangibleAssets the intangibleAssets to set
	 */
	public void setIntangibleAssets(BigDecimal intangibleAssets) {
		IntangibleAssets = intangibleAssets;
	}
	/**
	 * @return the termDeferredExpense
	 */
	public BigDecimal getTermDeferredExpense() {
		return termDeferredExpense;
	}
	/**
	 * @param termDeferredExpense the termDeferredExpense to set
	 */
	public void setTermDeferredExpense(BigDecimal termDeferredExpense) {
		this.termDeferredExpense = termDeferredExpense;
	}
	/**
	 * @return the total
	 */
	public BigDecimal getTotal() {
		return total;
	}
	/**
	 * @param total the total to set
	 */
	public void setTotal(BigDecimal total) {
		this.total = total;
	}
	/**
	 * @return the remark
	 */
	public String getRemark() {
		return remark;
	}
	/**
	 * @param remark the remark to set
	 */
	public void setRemark(String remark) {
		this.remark = remark;
	}

}
