package com.sgepit.pmis.contract.hbm;

import java.util.Date;

/**
 * ConBre entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConBre implements java.io.Serializable {

	// Fields

	private String breid;
	private String pid;
	private String breno;
	private String brereason;
	private Date bredate;
	private Double dedmoney;
	private String bretype;
	private String remark;
	private String filelsh;
	private String conid;
	private String brework;
	private Long billstate;
	
	//extend
    private Double breachappmoney;
	// Constructors

	public ConBre(String breid, String pid, String breno, String brereason,
			Date bredate, Double dedmoney, String bretype, String remark,
			String filelsh, String conid, String brework, Long billstate) {
		super();
		this.breid = breid;
		this.pid = pid;
		this.breno = breno;
		this.brereason = brereason;
		this.bredate = bredate;
		this.dedmoney = dedmoney;
		this.bretype = bretype;
		this.remark = remark;
		this.filelsh = filelsh;
		this.conid = conid;
		this.brework = brework;
		this.billstate = billstate;
	}

	/** default constructor */
	public ConBre() {
	}

	/** minimal constructor */
	public ConBre(String breid, String pid, String conid) {
		this.breid = breid;
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */

	// Property accessors

	public String getBreid() {
		return this.breid;
	}

	public void setBreid(String breid) {
		this.breid = breid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBreno() {
		return this.breno;
	}

	public void setBreno(String breno) {
		this.breno = breno;
	}

	public String getBrereason() {
		return this.brereason;
	}

	public void setBrereason(String brereason) {
		this.brereason = brereason;
	}

	public Date getBredate() {
		return this.bredate;
	}

	public void setBredate(Date bredate) {
		this.bredate = bredate;
	}

	public Double getDedmoney() {
		return this.dedmoney;
	}

	public void setDedmoney(Double dedmoney) {
		this.dedmoney = dedmoney;
	}

	public String getBretype() {
		return this.bretype;
	}

	public void setBretype(String bretype) {
		this.bretype = bretype;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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

	public String getBrework() {
		return brework;
	}

	public void setBrework(String brework) {
		this.brework = brework;
	}

	public Long getBillstate() {
		return billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public Double getBreachappmoney() {
		return breachappmoney;
	}

	public void setBreachappmoney(Double breachappmoney) {
		this.breachappmoney = breachappmoney;
	}
}