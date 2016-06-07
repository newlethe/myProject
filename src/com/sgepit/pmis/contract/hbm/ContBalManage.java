package com.sgepit.pmis.contract.hbm;

import java.util.Date;


public class ContBalManage implements java.io.Serializable {
   
	private String uids;
	private String conid;
	private Date  createtime;
	private Double applymoney;
	private Double checkmoney;
	private Double consultmoney;
	private Double approvemoney;
	private Double conmoneycomp;
	private String pid;
	private String projecttype;
	
	private String flowbh;
	private String billState;
	private String sjType;
	private String auditState;
	public ContBalManage(){}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Double getApplymoney() {
		return applymoney;
	}

	public void setApplymoney(Double applymoney) {
		this.applymoney = applymoney;
	}

	public Double getCheckmoney() {
		return checkmoney;
	}

	public void setCheckmoney(Double checkmoney) {
		this.checkmoney = checkmoney;
	}

	public Double getConsultmoney() {
		return consultmoney;
	}

	public void setConsultmoney(Double consultmoney) {
		this.consultmoney = consultmoney;
	}

	public Double getApprovemoney() {
		return approvemoney;
	}

	public void setApprovemoney(Double approvemoney) {
		this.approvemoney = approvemoney;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getProjecttype() {
		return projecttype;
	}

	public void setProjecttype(String projecttype) {
		this.projecttype = projecttype;
	}

	public Double getConmoneycomp() {
		return conmoneycomp;
	}

	public void setConmoneycomp(Double conmoneycomp) {
		this.conmoneycomp = conmoneycomp;
	}

	public ContBalManage(String uids, String conid, Date createtime,
			Double applymoney, Double checkmoney, Double consultmoney,
			Double approvemoney, Double conmoneycomp, String pid,
			String projecttype,String auditState) {
		super();
		this.uids = uids;
		this.conid = conid;
		this.createtime = createtime;
		this.applymoney = applymoney;
		this.checkmoney = checkmoney;
		this.consultmoney = consultmoney;
		this.approvemoney = approvemoney;
		this.conmoneycomp = conmoneycomp;
		this.pid = pid;
		this.projecttype = projecttype;
		this.auditState = auditState;
	}

	public String getFlowbh() {
		return flowbh;
	}

	public void setFlowbh(String flowbh) {
		this.flowbh = flowbh;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getSjType() {
		return sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getAuditState() {
		return auditState;
	}

	public void setAuditState(String auditState) {
		this.auditState = auditState;
	}
	
	}
