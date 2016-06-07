package com.sgepit.pcmis.contract.hbm;

import java.math.BigDecimal;

public class ConInfoBean {
private String pid;//项目PID
private BigDecimal changeMoney;//变更金额之和
private BigDecimal breMoney;//违约金额之和
private BigDecimal claMoney;//索赔金额之和
private BigDecimal conMoney;//录入金额之和
private BigDecimal alreadyPay;//付款金额之和
private BigDecimal conValue;//合同总金额
private BigDecimal balAppMoney;//结算金额
private BigDecimal conNum;//合同签订总数
private BigDecimal bdgMoney;//执行概算

public ConInfoBean(String pid, BigDecimal changeMoney, BigDecimal breMoney,
		BigDecimal claMoney, BigDecimal conMoney, BigDecimal alreadyPay,
		BigDecimal conValue, BigDecimal balAppMoney, BigDecimal conNum,
		BigDecimal bdgMoney) {
	super();
	this.pid = pid;
	this.changeMoney = changeMoney;
	this.breMoney = breMoney;
	this.claMoney = claMoney;
	this.conMoney = conMoney;
	this.alreadyPay = alreadyPay;
	this.conValue = conValue;
	this.balAppMoney = balAppMoney;
	this.conNum = conNum;
	this.bdgMoney = bdgMoney;
}

public BigDecimal getBalAppMoney() {
	return balAppMoney;
}
public void setBalAppMoney(BigDecimal balAppMoney) {
	this.balAppMoney = balAppMoney;
}
public BigDecimal getConValue() {
	return conValue;
}
public void setConValue(BigDecimal conValue) {
	this.conValue = conValue;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public BigDecimal getChangeMoney() {
	return changeMoney;
}
public void setChangeMoney(BigDecimal changeMoney) {
	this.changeMoney = changeMoney;
}
public BigDecimal getBreMoney() {
	return breMoney;
}
public void setBreMoney(BigDecimal breMoney) {
	this.breMoney = breMoney;
}
public BigDecimal getClaMoney() {
	return claMoney;
}
public void setClaMoney(BigDecimal claMoney) {
	this.claMoney = claMoney;
}
public BigDecimal getConMoney() {
	return conMoney;
}
public void setConMoney(BigDecimal conMoney) {
	this.conMoney = conMoney;
}
public BigDecimal getAlreadyPay() {
	return alreadyPay;
}
public void setAlreadyPay(BigDecimal alreadyPay) {
	this.alreadyPay = alreadyPay;
}
public ConInfoBean() {
	super();
	// TODO Auto-generated constructor stub
}
public BigDecimal getConNum() {
	return conNum;
}
public void setConNum(BigDecimal conNum) {
	this.conNum = conNum;
}

public BigDecimal getBdgMoney() {
	return bdgMoney;
}

public void setBdgMoney(BigDecimal bdgMoney) {
	this.bdgMoney = bdgMoney;
}

}
