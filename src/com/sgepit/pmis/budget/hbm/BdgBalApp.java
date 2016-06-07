package com.sgepit.pmis.budget.hbm;

/**
 * BdgBalApp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgBalApp implements java.io.Serializable {

	// Fields

	private String balappid;
	private String balid;
	private String conid;
	private String pid;
	private String bdgid;
	private String bdgno;
	private Double balmoney;
	private Long isleaf;
	private String parent;

	// Constructors
	
	//extend 
	private Double bdgmoney;
	private String bdgname;

	/** default constructor */
	public BdgBalApp() {
	}

	/** full constructor */
	public BdgBalApp(String balid, String conid, String pid, String bdgid,
			String bdgno, Double balmoney, Long isleaf, String parent) {
		this.balid = balid;
		this.conid = conid;
		this.pid = pid;
		this.bdgid = bdgid;
		this.bdgno = bdgno;
		this.balmoney = balmoney;
		this.isleaf = isleaf;
		this.parent = parent;
	}

	// Property accessors

	public String getBalappid() {
		return this.balappid;
	}

	public void setBalappid(String balappid) {
		this.balappid = balappid;
	}

	public String getBalid() {
		return this.balid;
	}

	public void setBalid(String balid) {
		this.balid = balid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgno() {
		return this.bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public Double getBalmoney() {
		return this.balmoney;
	}

	public void setBalmoney(Double balmoney) {
		this.balmoney = balmoney;
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

	public Double getBdgmoney() {
		return bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

}