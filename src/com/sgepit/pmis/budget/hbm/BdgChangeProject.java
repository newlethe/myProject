package com.sgepit.pmis.budget.hbm;

import java.io.Serializable;

public class BdgChangeProject implements Serializable {
private String prochangeappid;
private String conid;
private String bdgid;
private String changeproname;
private String unit;
private Double changeprice;
private Double changeamount;
private Double changemoney;
private String state;
private String pid;
private String changeid;
private String changeprono;

private String isper;	//变更工程量是否带百分号

public BdgChangeProject() {
}

public BdgChangeProject(String prochangeappid, String conid, String bdgid,
		String changeproname, String unit, Double changeprice,
		Double changeamount, Double changemoney, String state, String pid,
		String changeid, String changeprono, String isper) {
	super();
	this.prochangeappid = prochangeappid;
	this.conid = conid;
	this.bdgid = bdgid;
	this.changeproname = changeproname;
	this.unit = unit;
	this.changeprice = changeprice;
	this.changeamount = changeamount;
	this.changemoney = changemoney;
	this.state = state;
	this.pid = pid;
	this.changeid = changeid;
	this.changeprono = changeprono;
	this.isper = isper;
}

public String getProchangeappid() {
	return prochangeappid;
}
public void setProchangeappid(String prochangeappid) {
	this.prochangeappid = prochangeappid;
}
public String getConid() {
	return conid;
}
public void setConid(String conid) {
	this.conid = conid;
}
public String getBdgid() {
	return bdgid;
}
public void setBdgid(String bdgid) {
	this.bdgid = bdgid;
}
public String getChangeproname() {
	return changeproname;
}
public void setChangeproname(String changeproname) {
	this.changeproname = changeproname;
}
public String getUnit() {
	return unit;
}
public void setUnit(String unit) {
	this.unit = unit;
}
public Double getChangeprice() {
	return changeprice;
}
public void setChangeprice(Double changeprice) {
	this.changeprice = changeprice;
}
public Double getChangeamount() {
	return changeamount;
}
public void setChangeamount(Double changeamount) {
	this.changeamount = changeamount;
}
public Double getChangemoney() {
	return changemoney;
}
public void setChangemoney(Double changemoney) {
	this.changemoney = changemoney;
}
public String getState() {
	return state;
}
public void setState(String state) {
	this.state = state;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public String getChangeid() {
	return changeid;
}
public void setChangeid(String changeid) {
	this.changeid = changeid;
}
public String getChangeprono() {
	return changeprono;
}
public void setChangeprono(String changeprono) {
	this.changeprono = changeprono;
}

public String getIsper() {
	return isper;
}

public void setIsper(String isper) {
	this.isper = isper;
}

}
