package com.sgepit.pmis.investmentComp.hbm;

/**
 * ProAcmTree entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ProAcmTree implements java.io.Serializable {

	// Fields

	private String uuid;
	private String conid;
	private String monId;
	private String bdgid;
	private Double proMoney;
	private String parent;
	private Long isleaf;
	private Double sumMoney;
	private Double sumDecmon;
	
	private String bdgname;
	
	private String pid;
	
	//其他类合同投资完成2012-02-15
	private Double decmoney;
	private Double checkmoney;
	private Double ratiftmoney;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public ProAcmTree() {
	}

	/** full constructor */
	public ProAcmTree(String conid, String monId, String bdgid,
			Double proMoney, String parent, Long isleaf, Double sumMoney,
			Double sumDecmon) {
		this.conid = conid;
		this.monId = monId;
		this.bdgid = bdgid;
		this.proMoney = proMoney;
		this.parent = parent;
		this.isleaf = isleaf;
		this.sumMoney = sumMoney;
		this.sumDecmon = sumDecmon;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getMonId() {
		return this.monId;
	}

	public void setMonId(String monId) {
		this.monId = monId;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public Double getProMoney() {
		return this.proMoney;
	}

	public void setProMoney(Double proMoney) {
		this.proMoney = proMoney;
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

	public Double getSumMoney() {
		return this.sumMoney;
	}

	public void setSumMoney(Double sumMoney) {
		this.sumMoney = sumMoney;
	}

	public Double getSumDecmon() {
		return this.sumDecmon;
	}

	public void setSumDecmon(Double sumDecmon) {
		this.sumDecmon = sumDecmon;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public Double getDecmoney() {
		return decmoney;
	}

	public void setDecmoney(Double decmoney) {
		this.decmoney = decmoney;
	}

	public Double getCheckmoney() {
		return checkmoney;
	}

	public void setCheckmoney(Double checkmoney) {
		this.checkmoney = checkmoney;
	}

	public Double getRatiftmoney() {
		return ratiftmoney;
	}

	public void setRatiftmoney(Double ratiftmoney) {
		this.ratiftmoney = ratiftmoney;
	}

}