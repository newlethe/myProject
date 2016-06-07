package com.sgepit.pmis.budget.hbm;

/**
 * BdgProject entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VBdgProject implements java.io.Serializable {

	// Fields

	private String proappid;
	private String conid;
	private String bdgid;
	private String prono;
	private String proname;
	private String unit;
	private Double price;
	private Double amount;
	private Double money;
	private String state;
	private String pid;
	private String isper;
	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public VBdgProject() {
	}

	/** full constructor */
	public VBdgProject(String proappid, String conid, String bdgid,
			String prono, String proname, String unit, Double price,
			Double amount, Double money, String state, String pid, String isper) {
		super();
		this.proappid = proappid;
		this.conid = conid;
		this.bdgid = bdgid;
		this.prono = prono;
		this.proname = proname;
		this.unit = unit;
		this.price = price;
		this.amount = amount;
		this.money = money;
		this.state = state;
		this.pid = pid;
		this.isper = isper;
	}

	// Property accessors
	public String getProappid() {
		return this.proappid;
	}

	public void setProappid(String proappid) {
		this.proappid = proappid;
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

	public String getProno() {
		return this.prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

	public String getProname() {
		return this.proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getPrice() {
		return this.price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getAmount() {
		return this.amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public Double getMoney() {
		return this.money;
	}

	public void setMoney(Double money) {
		this.money = money;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getIsper() {
		return isper;
	}

	public void setIsper(String isper) {
		this.isper = isper;
	}

}