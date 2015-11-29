package com.sgepit.pmis.finalAccounts.complete.hbm;

import java.util.Date;
/**
 * 工程基本信息-投资概况表
 * @author pengy
 * @createtime 2013-06-27
 */
public class FACompInvestment {
	
	private String pid;
	private String uids;
	private String invesName;
	private Double invesTotal;
	private Double invesAvg;
	private Date createDate;
	
	public FACompInvestment() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public FACompInvestment(String pid, String uids, String invesName,
			Double invesTotal, Double invesAvg, Date createDate) {
		super();
		this.pid = pid;
		this.uids = uids;
		this.invesName = invesName;
		this.invesTotal = invesTotal;
		this.invesAvg = invesAvg;
		this.createDate = createDate;
	}

	public String getPid() {
		return pid;
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

	public String getInvesName() {
		return invesName;
	}

	public void setInvesName(String invesName) {
		this.invesName = invesName;
	}

	public Double getInvesTotal() {
		return invesTotal;
	}

	public void setInvesTotal(Double invesTotal) {
		this.invesTotal = invesTotal;
	}

	public Double getInvesAvg() {
		return invesAvg;
	}

	public void setInvesAvg(Double invesAvg) {
		this.invesAvg = invesAvg;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

}
