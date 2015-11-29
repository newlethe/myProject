package com.sgepit.pcmis.budget.hbm;

import java.math.BigDecimal;

public class BudgetProInfo {
private BigDecimal bdgTotalMoney;
private BigDecimal conMoney;
private BigDecimal leftMoney;
private BigDecimal balMoney;
private String pid;
public BigDecimal getBalMoney() {
	return balMoney;
}

public void setBalMoney(BigDecimal balMoney) {
	this.balMoney = balMoney;
}

public BudgetProInfo() {
	super();
	// TODO Auto-generated constructor stub
}

public BigDecimal getBdgTotalMoney() {
	return bdgTotalMoney;
}

public void setBdgTotalMoney(BigDecimal bdgTotalMoney) {
	this.bdgTotalMoney = bdgTotalMoney;
}

public BigDecimal getConMoney() {
	return conMoney;
}
public void setConMoney(BigDecimal conMoney) {
	this.conMoney = conMoney;
}
public BigDecimal getLeftMoney() {
	return leftMoney;
}
public void setLeftMoney(BigDecimal leftMoney) {
	this.leftMoney = leftMoney;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public BudgetProInfo(BigDecimal bdgTotalMoney, BigDecimal conMoney,
		BigDecimal leftMoney, String pid) {
	super();
	this.bdgTotalMoney = bdgTotalMoney;
	this.conMoney = conMoney;
	this.leftMoney = leftMoney;
	this.pid = pid;
}


}
