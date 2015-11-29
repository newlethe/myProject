package com.sgepit.pmis.budget.hbm;
/**
 * BdgClaApp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgClaApp implements java.io.Serializable {

	// Fields

	private String claappid;
	private String conid;
	private String bdgid;
	private String claid;
	private String pid;
	private Double clamoney;
	private Long isleaf;
	private String parent;
	
	//extend 
	private Double bdgmoney;
	private String bdgno;
	private String bdgname;
	private Double conbdgappmoney;//所有合同分摊总金额 
	private Double conappmoney;//本合同分摊总金额
	// Constructors

	public Double getBdgmoney() {
		return bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
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

	/** default constructor */
	public BdgClaApp() {
	}

	/** full constructor */
	public BdgClaApp(String conid, String bdgid, String claid, String pid,
			Double clamoney, Long isleaf, String parent) {
		this.conid = conid;
		this.bdgid = bdgid;
		this.claid = claid;
		this.pid = pid;
		this.clamoney = clamoney;
		this.isleaf = isleaf;
		this.parent = parent;
	}

	// Property accessors

	public String getClaappid() {
		return this.claappid;
	}

	public void setClaappid(String claappid) {
		this.claappid = claappid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getClaid() {
		return this.claid;
	}

	public void setClaid(String claid) {
		this.claid = claid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Double getClamoney() {
		return this.clamoney;
	}

	public void setClamoney(Double clamoney) {
		this.clamoney = clamoney;
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

	public Double getConbdgappmoney() {
		return conbdgappmoney;
	}

	public void setConbdgappmoney(Double conbdgappmoney) {
		this.conbdgappmoney = conbdgappmoney;
	}

	public Double getConappmoney() {
		return conappmoney;
	}

	public void setConappmoney(Double conappmoney) {
		this.conappmoney = conappmoney;
	}

}