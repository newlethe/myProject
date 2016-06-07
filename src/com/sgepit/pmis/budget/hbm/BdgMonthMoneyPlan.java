package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * BdgMonthMoneyPlan entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgMonthMoneyPlan implements java.io.Serializable {

	// Fields

	private String uids;
	private String content;
	private Long planmoney;
	private Date enddate;
	private Date sbsj;
	private String fzr;
	private String deptuser;
	private String zbr;
	private String memo;
	private String memo1;
	private String dept;
	private String jhzt;
	private String billState;
	private String ifbl;
	private String bh;
	private String hzbh;
	private String pid;
	
	
	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getDept() {
		return dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public String getJhzt() {
		return jhzt;
	}

	public void setJhzt(String jhzt) {
		this.jhzt = jhzt;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getIfbl() {
		return ifbl;
	}

	public void setIfbl(String ifbl) {
		this.ifbl = ifbl;
	}

	public String getBh() {
		return bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getHzbh() {
		return hzbh;
	}

	public void setHzbh(String hzbh) {
		this.hzbh = hzbh;
	}

	

	// Constructors

	/** default constructor */
	public BdgMonthMoneyPlan() {
	}

	/** minimal constructor */
	public BdgMonthMoneyPlan(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public BdgMonthMoneyPlan(String uids, String content, Long planmoney,
			Date enddate,Date sbsj,  String fzr, String deptuser, String zbr, String memo,
			String memo1) {
		this.uids = uids;
		this.content = content;
		this.planmoney = planmoney;
		this.enddate = enddate;
		this.sbsj = sbsj;
		this.fzr = fzr;
		this.deptuser = deptuser;
		this.zbr = zbr;
		this.memo = memo;
		this.memo1 = memo1;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getPlanmoney() {
		return this.planmoney;
	}

	public void setPlanmoney(Long planmoney) {
		this.planmoney = planmoney;
	}

	public Date getEnddate() {
		return this.enddate;
	}

	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}

	public String getFzr() {
		return this.fzr;
	}

	public void setFzr(String fzr) {
		this.fzr = fzr;
	}

	public String getDeptuser() {
		return this.deptuser;
	}

	public void setDeptuser(String deptuser) {
		this.deptuser = deptuser;
	}

	public String getZbr() {
		return this.zbr;
	}

	public void setZbr(String zbr) {
		this.zbr = zbr;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getMemo1() {
		return this.memo1;
	}

	public void setMemo1(String memo1) {
		this.memo1 = memo1;
	}

	public Date getSbsj() {
		return sbsj;
	}

	public void setSbsj(Date sbsj) {
		this.sbsj = sbsj;
	}

}