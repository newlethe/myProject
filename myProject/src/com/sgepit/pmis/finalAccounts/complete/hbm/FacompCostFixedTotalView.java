package com.sgepit.pmis.finalAccounts.complete.hbm;


/**
 * FacompCostFixedTotalView entity. @author MyEclipse Persistence Tools
 */

public class FacompCostFixedTotalView implements java.io.Serializable {

	// Fields

	private String pid;
	private String otherCostType;
	private String treeid;
	private String fixedno;
	private String fixedname;
	private String parentid;
	private Long isleaf;
	private Double costValue1;
	private Double costValue2;
	private Double costValue3;
	public FacompCostFixedTotalView() {
		super();
		// TODO Auto-generated constructor stub
	}
	public FacompCostFixedTotalView(String pid, String otherCostType,
			String treeid, String fixedno, String fixedname, String parentid,
			Long isleaf, Double costValue1, Double costValue2, Double costValue3) {
		super();
		this.pid = pid;
		this.otherCostType = otherCostType;
		this.treeid = treeid;
		this.fixedno = fixedno;
		this.fixedname = fixedname;
		this.parentid = parentid;
		this.isleaf = isleaf;
		this.costValue1 = costValue1;
		this.costValue2 = costValue2;
		this.costValue3 = costValue3;
	}
	public FacompCostFixedTotalView(String pid, String otherCostType,
			String treeid) {
		super();
		this.pid = pid;
		this.otherCostType = otherCostType;
		this.treeid = treeid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getOtherCostType() {
		return otherCostType;
	}
	public void setOtherCostType(String otherCostType) {
		this.otherCostType = otherCostType;
	}
	public String getTreeid() {
		return treeid;
	}
	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}
	public String getFixedno() {
		return fixedno;
	}
	public void setFixedno(String fixedno) {
		this.fixedno = fixedno;
	}
	public String getFixedname() {
		return fixedname;
	}
	public void setFixedname(String fixedname) {
		this.fixedname = fixedname;
	}
	public String getParentid() {
		return parentid;
	}
	public void setParentid(String parentid) {
		this.parentid = parentid;
	}
	public Long getIsleaf() {
		return isleaf;
	}
	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}
	public Double getCostValue1() {
		return costValue1;
	}
	public void setCostValue1(Double costValue1) {
		this.costValue1 = costValue1;
	}
	public Double getCostValue2() {
		return costValue2;
	}
	public void setCostValue2(Double costValue2) {
		this.costValue2 = costValue2;
	}
	public Double getCostValue3() {
		return costValue3;
	}
	public void setCostValue3(Double costValue3) {
		this.costValue3 = costValue3;
	}

	
}