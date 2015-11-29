package com.sgepit.pcmis.contract.hbm;

public class ConReportBean {
private String contypeid;
private String contypename;
private String conname;
private Double contotalmoney;
private Double singledmoney;
private Double claandchangemoney;
private Double balmoney;
private Double bdgmoney;
private String paypercent;
private Double moninvestment;
private Double yearinvestment;
private Double totalinvestment;
private Double monpay;
private Double totalpay;
private String totalpaypercent;
private Double notpaymoney;
private Long isleaf;
private String parent;

private Double moninvestment_build;
private Double yearinvestment_build;
private Double totalinvestment_build;

private Double moninvestment_install;
private Double yearinvestment_install;
private Double totalinvestment_install;

private Double moninvestment_equ;
private Double yearinvestment_equ;
private Double totalinvestment_equ;

private Double moninvestment_other;
private Double yearinvestment_other;
private Double totalinvestment_other;

public ConReportBean() {
	super();
	// TODO Auto-generated constructor stub
}
public ConReportBean(String contypeid, String contypename, String conname,
		Double contotalmoney, Double singledmoney, Double claandchangemoney,
		Double balmoney, Double bdgmoney, String paypercent,
		Double moninvestment, Double yearinvestment, Double totalinvestment,
		Double monpay, Double totalpay, String totalpaypercent,
		Double notpaymoney) {
	super();
	this.contypeid = contypeid;
	this.contypename = contypename;
	this.conname = conname;
	this.contotalmoney = contotalmoney;
	this.singledmoney = singledmoney;
	this.claandchangemoney = claandchangemoney;
	this.balmoney = balmoney;
	this.bdgmoney = bdgmoney;
	this.paypercent = paypercent;
	this.moninvestment = moninvestment;
	this.yearinvestment = yearinvestment;
	this.totalinvestment = totalinvestment;
	this.monpay = monpay;
	this.totalpay = totalpay;
	this.totalpaypercent = totalpaypercent;
	this.notpaymoney = notpaymoney;
}
public String getContypeid() {
	return contypeid;
}
public void setContypeid(String contypeid) {
	this.contypeid = contypeid;
}
public String getContypename() {
	return contypename;
}
public void setContypename(String contypename) {
	this.contypename = contypename;
}
public String getConname() {
	return conname;
}
public void setConname(String conname) {
	this.conname = conname;
}
public Double getContotalmoney() {
	return contotalmoney;
}
public void setContotalmoney(Double contotalmoney) {
	this.contotalmoney = contotalmoney;
}
public Double getSingledmoney() {
	return singledmoney;
}
public void setSingledmoney(Double singledmoney) {
	this.singledmoney = singledmoney;
}
public Double getClaandchangemoney() {
	return claandchangemoney;
}
public void setClaandchangemoney(Double claandchangemoney) {
	this.claandchangemoney = claandchangemoney;
}
public Double getBalmoney() {
	return balmoney;
}
public void setBalmoney(Double balmoney) {
	this.balmoney = balmoney;
}
public Double getBdgmoney() {
	return bdgmoney;
}
public void setBdgmoney(Double bdgmoney) {
	this.bdgmoney = bdgmoney;
}
public String getPaypercent() {
	return paypercent;
}
public void setPaypercent(String paypercent) {
	this.paypercent = paypercent;
}
public Double getMoninvestment() {
	return moninvestment;
}
public void setMoninvestment(Double moninvestment) {
	this.moninvestment = moninvestment;
}
public Double getYearinvestment() {
	return yearinvestment;
}
public void setYearinvestment(Double yearinvestment) {
	this.yearinvestment = yearinvestment;
}
public Double getTotalinvestment() {
	return totalinvestment;
}
public void setTotalinvestment(Double totalinvestment) {
	this.totalinvestment = totalinvestment;
}
public Double getMonpay() {
	return monpay;
}
public void setMonpay(Double monpay) {
	this.monpay = monpay;
}
public Double getTotalpay() {
	return totalpay;
}
public void setTotalpay(Double totalpay) {
	this.totalpay = totalpay;
}
public String getTotalpaypercent() {
	return totalpaypercent;
}
public void setTotalpaypercent(String totalpaypercent) {
	this.totalpaypercent = totalpaypercent;
}
public Double getNotpaymoney() {
	return notpaymoney;
}
public void setNotpaymoney(Double notpaymoney) {
	this.notpaymoney = notpaymoney;
}
public Long getIsleaf() {
	return isleaf;
}
public void setIsleaf(Long isleaf) {
	this.isleaf = isleaf;
}
public String getParent() {
	return parent;
}
public void setParent(String parent) {
	this.parent = parent;
}
public Double getMoninvestment_build() {
	return moninvestment_build;
}
public void setMoninvestment_build(Double moninvestmentBuild) {
	moninvestment_build = moninvestmentBuild;
}
public Double getYearinvestment_build() {
	return yearinvestment_build;
}
public void setYearinvestment_build(Double yearinvestmentBuild) {
	yearinvestment_build = yearinvestmentBuild;
}
public Double getTotalinvestment_build() {
	return totalinvestment_build;
}
public void setTotalinvestment_build(Double totalinvestmentBuild) {
	totalinvestment_build = totalinvestmentBuild;
}
public Double getMoninvestment_install() {
	return moninvestment_install;
}
public void setMoninvestment_install(Double moninvestmentInstall) {
	moninvestment_install = moninvestmentInstall;
}
public Double getYearinvestment_install() {
	return yearinvestment_install;
}
public void setYearinvestment_install(Double yearinvestmentInstall) {
	yearinvestment_install = yearinvestmentInstall;
}
public Double getTotalinvestment_install() {
	return totalinvestment_install;
}
public void setTotalinvestment_install(Double totalinvestmentInstall) {
	totalinvestment_install = totalinvestmentInstall;
}
public Double getMoninvestment_equ() {
	return moninvestment_equ;
}
public void setMoninvestment_equ(Double moninvestmentEqu) {
	moninvestment_equ = moninvestmentEqu;
}
public Double getYearinvestment_equ() {
	return yearinvestment_equ;
}
public void setYearinvestment_equ(Double yearinvestmentEqu) {
	yearinvestment_equ = yearinvestmentEqu;
}
public Double getTotalinvestment_equ() {
	return totalinvestment_equ;
}
public void setTotalinvestment_equ(Double totalinvestmentEqu) {
	totalinvestment_equ = totalinvestmentEqu;
}
public Double getMoninvestment_other() {
	return moninvestment_other;
}
public void setMoninvestment_other(Double moninvestmentOther) {
	moninvestment_other = moninvestmentOther;
}
public Double getYearinvestment_other() {
	return yearinvestment_other;
}
public void setYearinvestment_other(Double yearinvestmentOther) {
	yearinvestment_other = yearinvestmentOther;
}
public Double getTotalinvestment_other() {
	return totalinvestment_other;
}
public void setTotalinvestment_other(Double totalinvestmentOther) {
	totalinvestment_other = totalinvestmentOther;
}
}
