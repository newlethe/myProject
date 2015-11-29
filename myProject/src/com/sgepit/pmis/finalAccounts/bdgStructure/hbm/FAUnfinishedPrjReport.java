package com.sgepit.pmis.finalAccounts.bdgStructure.hbm;

import java.math.BigDecimal;

public class FAUnfinishedPrjReport {
	
	private String uids;
	private String bdgid;
	private String bdgname;
	private String location;
	private String unit;
	private Integer quantity;
	private BigDecimal bdgmoney;
	private BigDecimal amountDoneValue;
	private Double amountDonePer;
	private BigDecimal unfinishedBuild;
	private BigDecimal unfinishedInstall;
	private BigDecimal unfinishedEqu;
	private BigDecimal unfinishedOther;
	private BigDecimal unfinishedTotal;
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
	 * @return the location
	 */
	public String getLocation() {
		return location;
	}
	/**
	 * @param location the location to set
	 */
	public void setLocation(String location) {
		this.location = location;
	}
	/**
	 * @return the quantity
	 */
	public Integer getQuantity() {
		return quantity;
	}
	/**
	 * @param quantity the quantity to set
	 */
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
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
	 * @return the amountDoneValue
	 */
	public BigDecimal getAmountDoneValue() {
		return amountDoneValue;
	}
	/**
	 * @param amountDoneValue the amountDoneValue to set
	 */
	public void setAmountDoneValue(BigDecimal amountDoneValue) {
		this.amountDoneValue = amountDoneValue;
	}
	/**
	 * @return the amountDonePer
	 */
	public Double getAmountDonePer() {
		return amountDonePer;
	}
	/**
	 * @param amountDonePer the amountDonePer to set
	 */
	public void setAmountDonePer(Double amountDonePer) {
		this.amountDonePer = amountDonePer;
	}
	/**
	 * @return the unfinishedBuild
	 */
	public BigDecimal getUnfinishedBuild() {
		return unfinishedBuild;
	}
	/**
	 * @param unfinishedBuild the unfinishedBuild to set
	 */
	public void setUnfinishedBuild(BigDecimal unfinishedBuild) {
		this.unfinishedBuild = unfinishedBuild;
	}
	/**
	 * @return the unfinishedInstall
	 */
	public BigDecimal getUnfinishedInstall() {
		return unfinishedInstall;
	}
	/**
	 * @param unfinishedInstall the unfinishedInstall to set
	 */
	public void setUnfinishedInstall(BigDecimal unfinishedInstall) {
		this.unfinishedInstall = unfinishedInstall;
	}
	/**
	 * @return the unfinishedEqu
	 */
	public BigDecimal getUnfinishedEqu() {
		return unfinishedEqu;
	}
	/**
	 * @param unfinishedEqu the unfinishedEqu to set
	 */
	public void setUnfinishedEqu(BigDecimal unfinishedEqu) {
		this.unfinishedEqu = unfinishedEqu;
	}
	/**
	 * @return the unfinishedOther
	 */
	public BigDecimal getUnfinishedOther() {
		return unfinishedOther;
	}
	/**
	 * @param unfinishedOther the unfinishedOther to set
	 */
	public void setUnfinishedOther(BigDecimal unfinishedOther) {
		this.unfinishedOther = unfinishedOther;
	}
	/**
	 * @return the unfinishedTotal
	 */
	public BigDecimal getUnfinishedTotal() {
		return unfinishedTotal;
	}
	/**
	 * @param unfinishedTotal the unfinishedTotal to set
	 */
	public void setUnfinishedTotal(BigDecimal unfinishedTotal) {
		this.unfinishedTotal = unfinishedTotal;
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
	/**
	 * @return the unit
	 */
	public String getUnit() {
		return unit;
	}
	/**
	 * @param unit the unit to set
	 */
	public void setUnit(String unit) {
		this.unit = unit;
	}

}
