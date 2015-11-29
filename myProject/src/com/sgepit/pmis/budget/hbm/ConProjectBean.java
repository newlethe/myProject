package com.sgepit.pmis.budget.hbm;
/**
 * 合同工程量汇总统计Bean
 * @author alex
 *
 */
public class ConProjectBean {
 private double conProjectAppmoney; //某个合同下某个工程量的分摊
 private double projectConAppTotalmoney;//当前合同下得所有工程量分摊 总金额
 private double conSigedProjectMoney ;//合同签订工程量总金额
 private double conChangeProjectMoney; //合同变更工程量总金额
 private double bdgProjectAppMoney;//某一概算项目下所有工程量分摊的总金额
 private double conProjectAppNum; //某一个合同下工程量的分摊的总数目
 private double conPrjectAvgmoney;// 某一合同下某一工程量的平均分摊单价
 private double bdgProjectAppNum;//具体概算项目下工程量分摊总数
 private double bdgProjectAvgMoney; //概算工程量下平均单价
public ConProjectBean() {
}
public ConProjectBean(double conProjectAppmoney,
		double projectConAppTotalmoney, double conSigedProjectMoney,
		double conChangeProjectMoney, double bdgProjectAppMoney,
		double conProjectAppNum, double conPrjectAvgmoney,
		double bdgProjectAppNum, double bdgProjectAvgMoney) {
	super();
	this.conProjectAppmoney = conProjectAppmoney;
	this.projectConAppTotalmoney = projectConAppTotalmoney;
	this.conSigedProjectMoney = conSigedProjectMoney;
	this.conChangeProjectMoney = conChangeProjectMoney;
	this.bdgProjectAppMoney = bdgProjectAppMoney;
	this.conProjectAppNum = conProjectAppNum;
	this.conPrjectAvgmoney = conPrjectAvgmoney;
	this.bdgProjectAppNum = bdgProjectAppNum;
	this.bdgProjectAvgMoney = bdgProjectAvgMoney;
}


public double getConProjectAppmoney() {
	return conProjectAppmoney;
}


public void setConProjectAppmoney(double conProjectAppmoney) {
	this.conProjectAppmoney = conProjectAppmoney;
}


public double getProjectConAppTotalmoney() {
	return projectConAppTotalmoney;
}


public void setProjectConAppTotalmoney(double projectConAppTotalmoney) {
	this.projectConAppTotalmoney = projectConAppTotalmoney;
}


public double getConSigedProjectMoney() {
	return conSigedProjectMoney;
}


public void setConSigedProjectMoney(double conSigedProjectMoney) {
	this.conSigedProjectMoney = conSigedProjectMoney;
}


public double getConChangeProjectMoney() {
	return conChangeProjectMoney;
}


public void setConChangeProjectMoney(double conChangeProjectMoney) {
	this.conChangeProjectMoney = conChangeProjectMoney;
}


public double getBdgProjectAppMoney() {
	return bdgProjectAppMoney;
}


public void setBdgProjectAppMoney(double bdgProjectAppMoney) {
	this.bdgProjectAppMoney = bdgProjectAppMoney;
}


public double getConProjectAppNum() {
	return conProjectAppNum;
}


public void setConProjectAppNum(double conProjectAppNum) {
	this.conProjectAppNum = conProjectAppNum;
}


public double getConPrjectAvgmoney() {
	return conPrjectAvgmoney;
}


public void setConPrjectAvgmoney(double conPrjectAvgmoney) {
	this.conPrjectAvgmoney = conPrjectAvgmoney;
}


public double getBdgProjectAppNum() {
	return bdgProjectAppNum;
}


public void setBdgProjectAppNum(double bdgProjectAppNum) {
	this.bdgProjectAppNum = bdgProjectAppNum;
}


public double getBdgProjectAvgMoney() {
	return bdgProjectAvgMoney;
}


public void setBdgProjectAvgMoney(double bdgProjectAvgMoney) {
	this.bdgProjectAvgMoney = bdgProjectAvgMoney;
}

}
