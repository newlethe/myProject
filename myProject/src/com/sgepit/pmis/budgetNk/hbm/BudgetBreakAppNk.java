package com.sgepit.pmis.budgetNk.hbm;
/**
 * BdgClaApp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BudgetBreakAppNk implements java.io.Serializable {

	// Fields

	private String breappid;
	private String breid;
	private String bdgid;
	private String conid;
	private String pid;
	private Double breAppMoney;
	private Boolean isLeaf;
	private String parent;
	
	//extend
	//属于budgetMoneyAppNk实体
	private Double realMoney;
	//属于budgetNk实体
	private String bdgNo;
	private String bdgName;
	public String getBreappid() {
		return breappid;
	}
	public void setBreappid(String breappid) {
		this.breappid = breappid;
	}
	public String getBreid() {
		return breid;
	}
	public void setBreid(String breid) {
		this.breid = breid;
	}
	public String getBdgid() {
		return bdgid;
	}
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public Double getBreAppMoney() {
		return breAppMoney;
	}
	public void setBreAppMoney(Double breAppMoney) {
		this.breAppMoney = breAppMoney;
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