package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * BdgPayApp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgPayApp implements java.io.Serializable {

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
	private Long isleaf;
	private String parent;
	
	//extend 
	private Double bdgmoney;
	private String bdgno;
	private String bdgname;
	private Double realbdgmoney;
	private Double sumfactpay;
	// Constructors

	public Double getSumfactpay() {
		return sumfactpay;
	}

	public void setSumfactpay(Double sumfactpay) {
		this.sumfactpay = sumfactpay;
	}

	public Double getBdgmoney() {
		return bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	/** default constructor */
	public BdgPayApp() {
	}

	/** minimal constructor */
	public BdgPayApp(String bdgid, String pid, String conid) {
		this.bdgid = bdgid;
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public BdgPayApp(String payappno, String bdgid, String pid, String conid,
			String proname, Date actiondate, Date begindate, Date enddate,
			Double applypay, Double auditing, Double factpay, Double passpay,
			String remark, Long isleaf, String parent) {
		this.payappno = payappno;
		this.bdgid = bdgid;
		this.pid = pid;
		this.conid = conid;
		this.proname = proname;
		this.actiondate = actiondate;
		this.begindate = begindate;
		this.enddate = enddate;
		this.applypay = applypay;
		this.auditing = auditing;
		this.factpay = factpay;
		this.passpay = passpay;
		this.remark = remark;
		this.isleaf = isleaf;
		this.parent = parent;
	}

	// Property accessors

	public String getPayappid() {
		return this.payappid;
	}

	public void setPayappid(String payappid) {
		this.payappid = payappid;
	}

	public String getPayappno() {
		return this.payappno;
	}

	public void setPayappno(String payappno) {
		this.payappno = payappno;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getProname() {
		return this.proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

	public Date getActiondate() {
		return this.actiondate;
	}

	public void setActiondate(Date actiondate) {
		this.actiondate = actiondate;
	}

	public Date getBegindate() {
		return this.begindate;
	}

	public void setBegindate(Date begindate) {
		this.begindate = begindate;
	}

	public Date getEnddate() {
		return this.enddate;
	}

	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}

	public Double getApplypay() {
		return this.applypay;
	}

	public void setApplypay(Double applypay) {
		this.applypay = applypay;
	}

	public Double getAuditing() {
		return this.auditing;
	}

	public void setAuditing(Double auditing) {
		this.auditing = auditing;
	}

	public Double getFactpay() {
		return this.factpay;
	}

	public void setFactpay(Double factpay) {
		this.factpay = factpay;
	}

	public Double getPasspay() {
		return this.passpay;
	}

	public void setPasspay(Double passpay) {
		this.passpay = passpay;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Double getRealbdgmoney() {
		return realbdgmoney;
	}

	public void setRealbdgmoney(Double realbdgmoney) {
		this.realbdgmoney = realbdgmoney;
	}

}