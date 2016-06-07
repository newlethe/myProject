package com.sgepit.pmis.contract.hbm;

import java.util.Date;

/**
 * ConBal entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConBal implements java.io.Serializable {

	// Entity Fields
	private String balid;
	private String pid;
	private String actman;
	private Date baldate;
	private String remark;
	private Long billstate;
	private String conid;
	private Double balappmoney;
	private Double actpaymoney;
	
	// Adds Fields
	private String conno;
	private String conname;
	private Double convalue;
	
	// Constructors

	/** default constructor */
	public ConBal() {
	}

	/** minimal constructor */
	public ConBal(String pid, String conid) {
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public ConBal(String pid, String actman, Date baldate, String remark,
			Long billstate, String conid, Double balappmoney, Double actpaymoney,
			String conno, String conname, Double convalue) {
		// Entity Fields
		this.pid = pid;
		this.actman = actman;
		this.baldate = baldate;
		this.remark = remark;
		this.billstate = billstate;
		this.conid = conid;
		this.balappmoney = balappmoney;
		this.actpaymoney = actpaymoney;
		
		// Adds Fields
		this.conno = conno;
		this.conname = conname;
		this.convalue = convalue;
	}

	// Property accessors

	public String getBalid() {
		return this.balid;
	}

	public void setBalid(String balid) {
		this.balid = balid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getActman() {
		return this.actman;
	}

	public void setActman(String actman) {
		this.actman = actman;
	}

	public Date getBaldate() {
		return this.baldate;
	}

	public void setBaldate(Date baldate) {
		this.baldate = baldate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getBalappmoney() {
		return this.balappmoney;
	}

	public void setBalappmoney(Double balappmoney) {
		this.balappmoney = balappmoney;
	}

	public String getConno() {
		return conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public Double getConvalue() {
		return convalue;
	}

	public void setConvalue(Double convalue) {
		this.convalue = convalue;
	}

	public Double getActpaymoney() {
		return actpaymoney;
	}

	public void setActpaymoney(Double actpaymoney) {
		this.actpaymoney = actpaymoney;
	}

}