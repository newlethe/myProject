package com.sgepit.pmis.investmentComp.hbm;

/**
 * ProAcmInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ProAcmInfo implements java.io.Serializable {

	// Fields

	private String acmId;
	private String monId;
	
	private String proid;
	private String conid;
	private String bdgid;
	private String proname;
	private String unit;
	private Double price;
	private Double amount;
	private Double money;
	
	private Double totalpro;
	private Double totalpercent;
	private Double declpro;
	private Double checkpro;
	private Double ratiftpro;
	private Double decmoney;
	private Double checkmoney;
	private Double ratiftmoney;
	private String remark;

	private String pid;
	private String isper;	//总工程量是否带百分号

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public ProAcmInfo() {
	}

	/** full constructor */
	public ProAcmInfo(String acmId, String monId, String proid, String conid,
			String bdgid, String proname, String unit, Double price,
			Double amount, Double money, Double totalpro, Double totalpercent,
			Double declpro, Double checkpro, Double ratiftpro, Double decmoney,
			Double checkmoney, Double ratiftmoney, String remark, String pid,
			String isper) {
		super();
		this.acmId = acmId;
		this.monId = monId;
		this.proid = proid;
		this.conid = conid;
		this.bdgid = bdgid;
		this.proname = proname;
		this.unit = unit;
		this.price = price;
		this.amount = amount;
		this.money = money;
		this.totalpro = totalpro;
		this.totalpercent = totalpercent;
		this.declpro = declpro;
		this.checkpro = checkpro;
		this.ratiftpro = ratiftpro;
		this.decmoney = decmoney;
		this.checkmoney = checkmoney;
		this.ratiftmoney = ratiftmoney;
		this.remark = remark;
		this.pid = pid;
		this.isper = isper;
	}

	// Property accessors

	public String getAcmId() {
		return this.acmId;
	}

	public void setAcmId(String acmId) {
		this.acmId = acmId;
	}

	public String getProid() {
		return this.proid;
	}

	public void setProid(String proid) {
		this.proid = proid;
	}

	public Double getTotalpro() {
		return this.totalpro;
	}

	public void setTotalpro(Double totalpro) {
		this.totalpro = totalpro;
	}

	public Double getTotalpercent() {
		return this.totalpercent;
	}

	public void setTotalpercent(Double totalpercent) {
		this.totalpercent = totalpercent;
	}

	public Double getDeclpro() {
		return this.declpro;
	}

	public void setDeclpro(Double declpro) {
		this.declpro = declpro;
	}

	public Double getCheckpro() {
		return this.checkpro;
	}

	public void setCheckpro(Double checkpro) {
		this.checkpro = checkpro;
	}

	public Double getRatiftpro() {
		return this.ratiftpro;
	}

	public void setRatiftpro(Double ratiftpro) {
		this.ratiftpro = ratiftpro;
	}

	public Double getDecmoney() {
		return this.decmoney;
	}

	public void setDecmoney(Double decmoney) {
		this.decmoney = decmoney;
	}

	public Double getCheckmoney() {
		return this.checkmoney;
	}

	public void setCheckmoney(Double checkmoney) {
		this.checkmoney = checkmoney;
	}

	public Double getRatiftmoney() {
		return this.ratiftmoney;
	}

	public void setRatiftmoney(Double ratiftmoney) {
		this.ratiftmoney = ratiftmoney;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getMonId() {
		return this.monId;
	}

	public void setMonId(String monId) {
		this.monId = monId;
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

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getIsper() {
		return isper;
	}

	public void setIsper(String isper) {
		this.isper = isper;
	}

}