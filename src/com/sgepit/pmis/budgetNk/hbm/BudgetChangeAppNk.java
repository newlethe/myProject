package com.sgepit.pmis.budgetNk.hbm;

public class BudgetChangeAppNk {

	private String caid;
	private String bdgid;
	private String pid;
	private String conid;
	private Double chgMoney;
	private String chaid;
	private String parent;
	private Boolean isLeaf;
	
	
	//extend
	//属于budgetMoneyAppNk实体
	private Double realMoney;
	//属于budgetNk实体
	private String bdgNo;
	private String bdgName;

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

	public String getCaid() {
		return caid;
	}

	public void setCaid(String caid) {
		this.caid = caid;
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

	public Double getChgMoney() {
		return chgMoney;
	}

	public void setChgMoney(Double chgMoney) {
		this.chgMoney = chgMoney;
	}

	public String getChaid() {
		return chaid;
	}

	public void setChaid(String chaid) {
		this.chaid = chaid;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Boolean getIsLeaf() {
		return isLeaf;
	}

	public void setIsLeaf(Boolean isLeaf) {
		this.isLeaf = isLeaf;
	}

}
