package com.sgepit.pmis.budgetNk.hbm;
/**
 * BdgClaApp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BudgetClaAppNk implements java.io.Serializable {

	// Fields

	private String claappid;
	private String conid;
	private String bdgid;
	private String claid;
	private String pid;
	private Double clamoney;
	private Boolean isLeaf;
	private String parent;
	
	//extend
	//属于budgetMoneyAppNk实体
	private Double realMoney;
	//属于budgetNk实体
	private String bdgNo;
	private String bdgName;
	// Constructors
	public String getClaappid() {
		return claappid;
	}
	public void setClaappid(String claappid) {
		this.claappid = claappid;
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
	public String getClaid() {
		return claid;
	}
	public void setClaid(String claid) {
		this.claid = claid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public Double getClamoney() {
		return clamoney;
	}
	public void setClamoney(Double clamoney) {
		this.clamoney = clamoney;
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
	public Double getRealMoney() {
		return realMoney;
	}
	public void setRealMoney(Double realMoney) {
		this.realMoney = realMoney;
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

	

}