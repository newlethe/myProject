package com.sgepit.pmis.document.hbm;

import java.util.Date;

/**
 * SafetyJobExamine entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafetyJobExamine implements java.io.Serializable {
	// Fields
	private String uuid;
	private Date month;
	private String examineco;
	private Double checkavg;//考核平均值
	private Double selfgrade;//自评平均值
	// Constructors
	/** default constructor */
	public SafetyJobExamine() {
	}
	/** full constructor */
	public SafetyJobExamine(Date month, String examineco) {
		this.month = month;
		this.examineco = examineco;
	}
	// Property accessors
	public String getUuid() {
		return this.uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public Date getMonth() {
		return this.month;
	}
	public void setMonth(Date month) {
		this.month = month;
	}
	public String getExamineco() {
		return this.examineco;
	}
	public void setExamineco(String examineco) {
		this.examineco = examineco;
	}
	/**
	 * @return the checkavg
	 */
	public Double getCheckavg() {
		return checkavg;
	}
	/**
	 * @param checkavg the checkavg to set
	 */
	public void setCheckavg(Double checkavg) {
		this.checkavg = checkavg;
	}
	/**
	 * @return the selfgrade
	 */
	public Double getSelfgrade() {
		return selfgrade;
	}
	/**
	 * @param selfgrade the selfgrade to set
	 */
	public void setSelfgrade(Double selfgrade) {
		this.selfgrade = selfgrade;
	}
}