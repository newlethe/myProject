package com.sgepit.pmis.finalAccounts.report.hbm;

public class FAReportConfig {
	
	private String uids;
	private String reportModuleName;
	private String financialSource;
	private String bdgLevel;
	
	/**
	 * @return the bdgLevel
	 */
	public String getBdgLevel() {
		return bdgLevel;
	}
	/**
	 * @param bdgLevel the bdgLevel to set
	 */
	public void setBdgLevel(String bdgLevel) {
		this.bdgLevel = bdgLevel;
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
	 * @return the reportModuleName
	 */
	public String getReportModuleName() {
		return reportModuleName;
	}
	/**
	 * @param reportModuleName the reportModuleName to set
	 */
	public void setReportModuleName(String reportModuleName) {
		this.reportModuleName = reportModuleName;
	}
	/**
	 * @return the financialSource
	 */
	public String getFinancialSource() {
		return financialSource;
	}
	/**
	 * @param financialSource the financialSource to set
	 */
	public void setFinancialSource(String financialSource) {
		this.financialSource = financialSource;
	}
	

}
