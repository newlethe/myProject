package com.sgepit.pmis.budget.hbm;

/**
 * BdgBreachApp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgBreachApp implements java.io.Serializable {

	// Fields

	private String breappid;
	private String breappno;
	private String bdgid;
	private String pid;
	private String conid;
	private Double appmoney;
	private String num;
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
	public BdgBreachApp() {
	}

	/** minimal constructor */
	public BdgBreachApp(String bdgid, String pid, String conid) {
		this.bdgid = bdgid;
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public BdgBreachApp(String breappno, String bdgid, String pid,
			String conid, Double appmoney, String num, Long isleaf,
			String parent) {
		this.breappno = breappno;
		this.bdgid = bdgid;
		this.pid = pid;
		this.conid = conid;
		this.appmoney = appmoney;
		this.num = num;
		this.isleaf = isleaf;
		this.parent = parent;
	}

	// Property accessors

	public String getBreappid() {
		return this.breappid;
	}

	public void setBreappid(String breappid) {
		this.breappid = breappid;
	}

	public String getBreappno() {
		return this.breappno;
	}

	public void setBreappno(String breappno) {
		this.breappno = breappno;
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

	public Double getAppmoney() {
		return this.appmoney;
	}

	public void setAppmoney(Double appmoney) {
		this.appmoney = appmoney;
	}

	public String getNum() {
		return this.num;
	}

	public void setNum(String num) {
		this.num = num;
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