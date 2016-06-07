package com.sgepit.pmis.wzgl.hbm;

/**
 * WzCsb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCsb implements java.io.Serializable {

	// Fields

	private String uids;
	private String csdm;
	private String csmc;
	private String gb;
	private String tel;
	private String post;
	private String addr;
	private String fax;
	private String fr;
	private String lxr;
	private String email;
	private String mobil;
	private String bank;
	private String accountNumber;
	private String taxNumber;
	private String bz;
	private String flbm;
	private String isused;
	private String wzorsb;
	private String rate;
	private String appra;
	private String pid;
	private String property;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public WzCsb() {
	}

	/** minimal constructor */
	public WzCsb(String csdm) {
		this.csdm = csdm;
		this.pid = pid;
	}

	/** full constructor */
	public WzCsb(String csdm, String csmc, String gb, String tel, String post,
			String addr, String fax, String fr, String lxr, String email,
			String mobil, String bank, String accountNumber, String taxNumber,
			String bz, String flbm, String isused,String wzorsb,String rate,String appra) {
		this.csdm = csdm;
		this.csmc = csmc;
		this.gb = gb;
		this.tel = tel;
		this.post = post;
		this.addr = addr;
		this.fax = fax;
		this.fr = fr;
		this.lxr = lxr;
		this.email = email;
		this.mobil = mobil;
		this.bank = bank;
		this.accountNumber = accountNumber;
		this.taxNumber = taxNumber;
		this.bz = bz;
		this.flbm = flbm;
		this.isused = isused;
		this.wzorsb = wzorsb;
		this.rate =rate;
		this.appra = appra;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCsdm() {
		return this.csdm;
	}

	public void setCsdm(String csdm) {
		this.csdm = csdm;
	}

	public String getCsmc() {
		return this.csmc;
	}

	public void setCsmc(String csmc) {
		this.csmc = csmc;
	}

	public String getGb() {
		return this.gb;
	}

	public void setGb(String gb) {
		this.gb = gb;
	}

	public String getTel() {
		return this.tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getPost() {
		return this.post;
	}

	public void setPost(String post) {
		this.post = post;
	}

	public String getAddr() {
		return this.addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

	public String getFax() {
		return this.fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getFr() {
		return this.fr;
	}

	public void setFr(String fr) {
		this.fr = fr;
	}

	public String getLxr() {
		return this.lxr;
	}

	public void setLxr(String lxr) {
		this.lxr = lxr;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobil() {
		return this.mobil;
	}

	public void setMobil(String mobil) {
		this.mobil = mobil;
	}

	public String getBank() {
		return this.bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	public String getAccountNumber() {
		return this.accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public String getTaxNumber() {
		return this.taxNumber;
	}

	public void setTaxNumber(String taxNumber) {
		this.taxNumber = taxNumber;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getFlbm() {
		return this.flbm;
	}

	public void setFlbm(String flbm) {
		this.flbm = flbm;
	}

	public String getIsused() {
		return this.isused;
	}

	public void setIsused(String isused) {
		this.isused = isused;
	}

	public String getWzorsb() {
		return wzorsb;
	}

	public void setWzorsb(String wzorsb) {
		this.wzorsb = wzorsb;
	}

	public String getRate() {
		return rate;
	}

	public void setRate(String rate) {
		this.rate = rate;
	}

	public String getAppra() {
		return appra;
	}

	public void setAppra(String appra) {
		this.appra = appra;
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

}