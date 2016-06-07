package com.sgepit.pcmis.budget.hbm;

public class BdgReportBean {
private String bdgid;
private String bdgname;
private Double bdgmoney;
private Double contmoney;
private Double changeappmoney;
private Double  changemoney;
private Double bdgcalconmoney;//
private Double monthmoney;
private Double yearmoney;
private Double allmoney;
private String percent;
private String conname;
public BdgReportBean() {
	super();
}
public BdgReportBean(String bdgid, String bdgname, Double bdgmoney,
		Double contmoney, Double changeappmoney, Double changemoney,
		Double bdgcalconmoney, Double monthmoney, Double yearmoney,
		Double allmoney, String percent, String conname) {
	super();
	this.bdgid = bdgid;
	this.bdgname = bdgname;
	this.bdgmoney = bdgmoney;
	this.contmoney = contmoney;
	this.changeappmoney = changeappmoney;
	this.changemoney = changemoney;
	this.bdgcalconmoney = bdgcalconmoney;
	this.monthmoney = monthmoney;
	this.yearmoney = yearmoney;
	this.allmoney = allmoney;
	this.percent = percent;
	this.conname = conname;
}

public String getBdgid() {
	return bdgid;
}
public void setBdgid(String bdgid) {
	this.bdgid = bdgid;
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
public Double getContmoney() {
	return contmoney;
}
public void setContmoney(Double contmoney) {
	this.contmoney = contmoney;
}
public Double getChangeappmoney() {
	return changeappmoney;
}
public void setChangeappmoney(Double changeappmoney) {
	this.changeappmoney = changeappmoney;
}
public Double getChangemoney() {
	return changemoney;
}
public void setChangemoney(Double changemoney) {
	this.changemoney = changemoney;
}
public Double getBdgcalconmoney() {
	return bdgcalconmoney;
}
public void setBdgcalconmoney(Double bdgcalconmoney) {
	this.bdgcalconmoney = bdgcalconmoney;
}
public Double getMonthmoney() {
	return monthmoney;
}
public void setMonthmoney(Double monthmoney) {
	this.monthmoney = monthmoney;
}
public Double getYearmoney() {
	return yearmoney;
}
public void setYearmoney(Double yearmoney) {
	this.yearmoney = yearmoney;
}
public Double getAllmoney() {
	return allmoney;
}

public void setAllmoney(Double allmoney) {
	this.allmoney = allmoney;
}
public String getPercent() {
	return percent;
}
public void setPercent(String percent) {
	this.percent = percent;
}


public String getConname() {
	return conname;
}


public void setConname(String conname) {
	this.conname = conname;
}
}
