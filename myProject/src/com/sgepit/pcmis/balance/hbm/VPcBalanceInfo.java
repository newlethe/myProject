package com.sgepit.pcmis.balance.hbm;

import java.util.Date;

/**
 * BdgInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

@SuppressWarnings("serial")
public class VPcBalanceInfo {

	// Fields
	private String uids;
	private String pid;
	private String prjName;
	private Double constructionCost;  //工程费用
	private Double coMoney;//已完成金额
	private Date buildStart;
	private Date buildEnd;

	/** default constructor */
	public VPcBalanceInfo() {
	}
	
	public VPcBalanceInfo(String uids, String pid, String prjName,Double constructionCost,Double coMoney,
			Date buildStart, Date buildEnd) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.prjName = prjName;
		this.constructionCost = constructionCost;
		this.coMoney = coMoney;
		this.buildStart = buildStart;
		this.buildEnd = buildEnd;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public Double getConstructionCost() {
		return constructionCost;
	}

	public void setConstructionCost(Double constructionCost) {
		this.constructionCost = constructionCost;
	}

	public Double getCoMoney() {
		return coMoney;
	}

	public void setCoMoney(Double coMoney) {
		this.coMoney = coMoney;
	}

	public String getPrjName() {
		return prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}
	
	public Date getBuildStart() {
		return buildStart;
	}

	public void setBuildStart(Date buildStart) {
		this.buildStart = buildStart;
	}

	public Date getBuildEnd() {
		return buildEnd;
	}

	public void setBuildEnd(Date buildEnd) {
		this.buildEnd = buildEnd;
	}
}