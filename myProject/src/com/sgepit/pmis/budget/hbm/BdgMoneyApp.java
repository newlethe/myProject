package com.sgepit.pmis.budget.hbm;

/**
 * BdgMoneyApp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgMoneyApp implements java.io.Serializable {

	// Fields

	private String appid;
	private String bdgid;
	private String pid;
	private String conid;
	private Double realmoney;
	private Double sumrealmoney;
	private Long prosign;
	private String remark;
	private Long isleaf;
	private String parent;
	
	//extend 
	private Double bdgmoney;
	private String bdgno;
	private String bdgname;
	private Double percent;

	// Constructors

	/** default constructor */
	public BdgMoneyApp() {
	}

	/** minimal constructor */
	public BdgMoneyApp(String bdgid, String pid, Long isleaf, String parent) {
		this.bdgid = bdgid;
		this.pid = pid;
		this.isleaf = isleaf;
		this.parent = parent;
	}

	/** full constructor */
	public BdgMoneyApp(String bdgid, String pid, String conid,
			Double realmoney, Long prosign, String remark, Long isleaf,
			String parent) {
		this.bdgid = bdgid;
		this.pid = pid;
		this.conid = conid;
		this.realmoney = realmoney;
		this.prosign = prosign;
		this.remark = remark;
		this.isleaf = isleaf;
		this.parent = parent;
	}

	// Property accessors

	public String getAppid() {
		return this.appid;
	}

	public void setAppid(String appid) {
		this.appid = appid;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getRealmoney() {
		return this.realmoney;
	}

	public void setRealmoney(Double realmoney) {
		this.realmoney = realmoney;
	}

	public Long getProsign() {
		return this.prosign;
	}

	public void setProsign(Long prosign) {
		this.prosign = prosign;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

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

	public Double getPercent() {
		return percent;
	}

	public void setPercent(Double percent) {
		this.percent = percent;
	}

	public Double getSumrealmoney() {
		return sumrealmoney;
	}

	public void setSumrealmoney(Double sumrealmoney) {
		this.sumrealmoney = sumrealmoney;
	}

}