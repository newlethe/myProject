package com.sgepit.pmis.budgetNk.hbm;

import java.util.Date;

public class BudgetPayAppNkView {
	
	// Fields

	private String payappid;
	private String payappno;
	private String bdgid;
	private String pid;
	private String conid;
	private String proname;
	private Date actiondate;
	private Date begindate;
	private Date enddate;
	private Double applypay;
	private Double auditing;
	private Double factpay;
	private Double passpay;
	private String remark;
	private Boolean isLeaf;
	private String parent;
	
	//extend 
	private Double bdgMoney;
	private String bdgNo;
	private String bdgName;
	private Double realBdgMoney;
	private Double sumRealMoney;
	private Double sumfactpay;
	
	
	public Double getSumfactpay() {
		return sumfactpay;
	}
	public void setSumfactpay(Double sumfactpay) {
		this.sumfactpay = sumfactpay;
	}
	public String getPayappid() {
		return payappid;
	}
	public void setPayappid(String payappid) {
		this.payappid = payappid;
	}
	public String getPayappno() {
		return payappno;
	}
	public void setPayappno(String payappno) {
		this.payappno = payappno;
	}
	public String getBdgid() {
		return bdgid;
	}
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public String getProname() {
		return proname;
	}
	public void setProname(String proname) {
		this.proname = proname;
	}
	public Date getActiondate() {
		return actiondate;
	}
	public void setActiondate(Date actiondate) {
		this.actiondate = actiondate;
	}
	public Date getBegindate() {
		return begindate;
	}
	public void setBegindate(Date begindate) {
		this.begindate = begindate;
	}
	public Date getEnddate() {
		return enddate;
	}
	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}
	public Double getApplypay() {
		return applypay;
	}
	public void setApplypay(Double applypay) {
		this.applypay = applypay;
	}
	public Double getAuditing() {
		return auditing;
	}
	public void setAuditing(Double auditing) {
		this.auditing = auditing;
	}
	public Double getFactpay() {
		return factpay;
	}
	public void setFactpay(Double factpay) {
		this.factpay = factpay;
	}
	public Double getPasspay() {
		return passpay;
	}
	public void setPasspay(Double passpay) {
		this.passpay = passpay;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Boolean getIsLeaf() {
		return isLeaf;
	}
	public void setIsLeaf(Boolean isLeaf) {
		this.isLeaf = isLeaf;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public Double getBdgMoney() {
		return bdgMoney;
	}
	public void setBdgMoney(Double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}
	public String getBdgNo() {
		return bdgNo;
	}
	public void setBdgNo(String bdgNo) {
		this.bdgNo = bdgNo;
	}
	public String getBdgName() {
		return bdgName;
	}
	public void setBdgName(String bdgName) {
		this.bdgName = bdgName;
	}
	public Double getRealBdgMoney() {
		return realBdgMoney;
	}
	public void setRealBdgMoney(Double realBdgMoney) {
		this.realBdgMoney = realBdgMoney;
	}
	public Double getSumRealMoney() {
		return sumRealMoney;
	}
	public void setSumRealMoney(Double sumRealMoney) {
		this.sumRealMoney = sumRealMoney;
	}
	
	

}
