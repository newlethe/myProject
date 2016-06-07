package com.sgepit.pmis.contract.hbm;

import java.util.Date;

/**
 * ConCha entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConCha implements java.io.Serializable {

	// Fields

	private String chaid;
	private String pid;
	private String chano;
	private String actionman;
	private Date chadate;
	private Double chamoney;
	private String chareason;
	private String remark;
	private String chatype;
	private String filelsh;
	private String conid;
	private Long billstate;
	private Double changeappmoney;
	// Constructors

	/** default constructor */
	public ConCha() {
	}

	/** minimal constructor */
	public ConCha(String chaid, String pid, String conid) {
		this.chaid = chaid;
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public ConCha(String chaid, String pid, String chano, String actionman,
			Date chadate, Double chamoney, String chareason, String remark,
			String chatype, String filelsh, String conid, Long billstate) {
		this.chaid = chaid;
		this.pid = pid;
		this.chano = chano;
		this.actionman = actionman;
		this.chadate = chadate;
		this.chamoney = chamoney;
		this.chareason = chareason;
		this.remark = remark;
		this.chatype = chatype;
		this.filelsh = filelsh;
		this.conid = conid;
		this.billstate = billstate;
	}

	// Property accessors

	public String getChaid() {
		return this.chaid;
	}

	public void setChaid(String chaid) {
		this.chaid = chaid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getChano() {
		return this.chano;
	}

	public void setChano(String chano) {
		this.chano = chano;
	}

	public String getActionman() {
		return this.actionman;
	}

	public void setActionman(String actionman) {
		this.actionman = actionman;
	}

	public Date getChadate() {
		return this.chadate;
	}

	public void setChadate(Date chadate) {
		this.chadate = chadate;
	}

	public Double getChamoney() {
		return this.chamoney;
	}

	public void setChamoney(Double chamoney) {
		this.chamoney = chamoney;
	}

	public String getChareason() {
		return this.chareason;
	}

	public void setChareason(String chareason) {
		this.chareason = chareason;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getChatype() {
		return this.chatype;
	}

	public void setChatype(String chatype) {
		this.chatype = chatype;
	}

	public String getFilelsh() {
		return this.filelsh;
	}

	public void setFilelsh(String filelsh) {
		this.filelsh = filelsh;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Long getBillstate() {
		return billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public Double getChangeappmoney() {
		return changeappmoney;
	}

	public void setChangeappmoney(Double changeappmoney) {
		this.changeappmoney = changeappmoney;
	}

}