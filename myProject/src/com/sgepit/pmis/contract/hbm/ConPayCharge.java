package com.sgepit.pmis.contract.hbm;

import java.io.Serializable;

public class ConPayCharge implements Serializable {
private String uids;
private String conid;
private String payid;
private String conpaytype;
private String chargename;
private Double chargemoney;
private String chargeremark;
private String pid;
public String getUids() {
	return uids;
}
public void setUids(String uids) {
	this.uids = uids;
}
public String getConid() {
	return conid;
}
public void setConid(String conid) {
	this.conid = conid;
}
public String getPayid() {
	return payid;
}
public void setPayid(String payid) {
	this.payid = payid;
}
public String getConpaytype() {
	return conpaytype;
}
public void setConpaytype(String conpaytype) {
	this.conpaytype = conpaytype;
}
public String getChargename() {
	return chargename;
}
public void setChargename(String chargename) {
	this.chargename = chargename;
}
public Double getChargemoney() {
	return chargemoney;
}
public void setChargemoney(Double chargemoney) {
	this.chargemoney = chargemoney;
}
public String getChargeremark() {
	return chargeremark;
}
public void setChargeremark(String chargeremark) {
	this.chargeremark = chargeremark;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public ConPayCharge() {
	super();
}
public ConPayCharge(String uids, String conid, String payid, String conpaytype,
		String chargename, Double chargemoney, String chargeremark, String pid) {
	super();
	this.uids = uids;
	this.conid = conid;
	this.payid = payid;
	this.conpaytype = conpaytype;
	this.chargename = chargename;
	this.chargemoney = chargemoney;
	this.chargeremark = chargeremark;
	this.pid = pid;
}
}
