package com.sgepit.pmis.budget.hbm;

/**
 * BdgProject entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgProject implements java.io.Serializable {

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
	
	private String constructionUnit;	//施工单位
    private String quantitiesType;		//工程量类型
    private String financialAccount;	//财务科目
    private String isper;				//总工程量是否带百分号

    //extend
    private Double investCompProapp;	//投资完成工程量
    private String fixedAssetList;	//所属固定资产清单

	/** default constructor */
	public BdgProject() {
	}

	/** full constructor */	
	public BdgProject(String proappid, String conid, String bdgid,
			String prono, String proname, String unit, Double price,
			Double amount, Double money, String state, String pid,
			String constructionUnit, String quantitiesType,
			String financialAccount, String isper, Double investCompProapp,
			String fixedAssetList) {
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
		this.constructionUnit = constructionUnit;
		this.quantitiesType = quantitiesType;
		this.financialAccount = financialAccount;
		this.isper = isper;
		this.investCompProapp = investCompProapp;
		this.fixedAssetList = fixedAssetList;
	}

	// Property accessors
	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
	
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

	public String getConstructionUnit() {
		return constructionUnit;
	}

	public void setConstructionUnit(String constructionUnit) {
		this.constructionUnit = constructionUnit;
	}

	public String getQuantitiesType() {
		return quantitiesType;
	}

	public void setQuantitiesType(String quantitiesType) {
		this.quantitiesType = quantitiesType;
	}

	public String getFinancialAccount() {
		return financialAccount;
	}

	public void setFinancialAccount(String financialAccount) {
		this.financialAccount = financialAccount;
	}

	public String getIsper() {
		return isper;
	}

	public void setIsper(String isper) {
		this.isper = isper;
	}

	public Double getInvestCompProapp() {
		return investCompProapp;
	}

	public void setInvestCompProapp(Double investCompProapp) {
		this.investCompProapp = investCompProapp;
	}

	public String getFixedAssetList() {
		return fixedAssetList;
	}

	public void setFixedAssetList(String fixedAssetList) {
		this.fixedAssetList = fixedAssetList;
	}

}