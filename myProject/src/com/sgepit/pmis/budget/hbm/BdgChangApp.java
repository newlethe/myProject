package com.sgepit.pmis.budget.hbm;

/**
 * BdgChangApp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgChangApp implements java.io.Serializable {

	// Fields

	private String caid;
	private String bdgid;
	private String pid;
	private String conid;
	private Double camoney;
	private String cano;
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
	public BdgChangApp() {
	}

	/** minimal constructor */
	public BdgChangApp(String caid, String pid) {
		this.caid = caid;
		this.pid = pid;
	}

	/** full constructor */
	public BdgChangApp(String caid, String bdgid, String pid, String conid,
			Double camoney, String cano, Long isleaf, String parent) {
		this.caid = caid;
		this.bdgid = bdgid;
		this.pid = pid;
		this.conid = conid;
		this.camoney = camoney;
		this.cano = cano;
		this.isleaf = isleaf;
		this.parent = parent;
	}

	// Property accessors

	public String getCaid() {
		return this.caid;
	}

	public void setCaid(String caid) {
		this.caid = caid;
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

	public Double getCamoney() {
		return this.camoney;
	}

	public void setCamoney(Double camoney) {
		this.camoney = camoney;
	}

	public String getCano() {
		return this.cano;
	}

	public void setCano(String cano) {
		this.cano = cano;
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