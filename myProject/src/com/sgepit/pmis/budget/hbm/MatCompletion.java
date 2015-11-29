package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * MatCompletion entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatCompletion implements java.io.Serializable {

	// Fields

	private String uuid;
	private Date opdate;
	private Double money;
	private String remark;
	private String pid;

	// Constructors

	/** default constructor */
	public MatCompletion() {
	}

	/** full constructor */
	public MatCompletion(Date opdate, Double money, String remark, String pid) {
		this.opdate = opdate;
		this.money = money;
		this.remark = remark;
		this.pid = pid;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Date getOpdate() {
		return this.opdate;
	}

	public void setOpdate(Date opdate) {
		this.opdate = opdate;
	}

	public Double getMoney() {
		return this.money;
	}

	public void setMoney(Double money) {
		this.money = money;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}