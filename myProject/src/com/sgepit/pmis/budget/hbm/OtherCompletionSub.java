package com.sgepit.pmis.budget.hbm;

/**
 * OtherCompletionSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class OtherCompletionSub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String otherUuid;
	private String bdgUuid;
	private Double sumMoney;
	private Double monthMoney;
	private String parent;
	private Long isleaf;
	
	private String bdgname;
	private String bdgno;
	private Double bdgmoney;
	private Double sumPercent;
	private Double remainder;
	// Constructors

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public Double getBdgmoney() {
		return bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public Double getSumPercent() {
		return sumPercent;
	}

	public void setSumPercent(Double sumPercent) {
		this.sumPercent = sumPercent;
	}

	public Double getRemainder() {
		return remainder;
	}

	public void setRemainder(Double remainder) {
		this.remainder = remainder;
	}

	/** default constructor */
	public OtherCompletionSub() {
	}

	/** minimal constructor */
	public OtherCompletionSub(String otherUuid, String bdgUuid) {
		this.otherUuid = otherUuid;
		this.bdgUuid = bdgUuid;
	}

	/** full constructor */
	public OtherCompletionSub(String otherUuid, String bdgUuid,
			Double sumMoney, Double monthMoney, String parent, Long isleaf) {
		this.otherUuid = otherUuid;
		this.bdgUuid = bdgUuid;
		this.sumMoney = sumMoney;
		this.monthMoney = monthMoney;
		this.parent = parent;
		this.isleaf = isleaf;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getOtherUuid() {
		return this.otherUuid;
	}

	public void setOtherUuid(String otherUuid) {
		this.otherUuid = otherUuid;
	}

	public String getBdgUuid() {
		return this.bdgUuid;
	}

	public void setBdgUuid(String bdgUuid) {
		this.bdgUuid = bdgUuid;
	}

	public Double getSumMoney() {
		return this.sumMoney;
	}

	public void setSumMoney(Double sumMoney) {
		this.sumMoney = sumMoney;
	}

	public Double getMonthMoney() {
		return this.monthMoney;
	}

	public void setMonthMoney(Double monthMoney) {
		this.monthMoney = monthMoney;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

}