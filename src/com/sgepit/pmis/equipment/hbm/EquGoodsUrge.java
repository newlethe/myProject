package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsUrge entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsUrge implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String jzDateUids;
	private String urgeUser;
	private Date urgeDate;
	private String urgeInfo;
	private Date requireDate;
	private String remark;

	// Constructors

	/** default constructor */
	public EquGoodsUrge() {
	}

	/** minimal constructor */
	public EquGoodsUrge(String pid, String jzDateUids) {
		this.pid = pid;
		this.jzDateUids = jzDateUids;
	}

	/** full constructor */
	public EquGoodsUrge(String pid, String jzDateUids, String urgeUser,
			Date urgeDate, String urgeInfo, Date requireDate, String remark) {
		this.pid = pid;
		this.jzDateUids = jzDateUids;
		this.urgeUser = urgeUser;
		this.urgeDate = urgeDate;
		this.urgeInfo = urgeInfo;
		this.requireDate = requireDate;
		this.remark = remark;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getJzDateUids() {
		return this.jzDateUids;
	}

	public void setJzDateUids(String jzDateUids) {
		this.jzDateUids = jzDateUids;
	}

	public String getUrgeUser() {
		return this.urgeUser;
	}

	public void setUrgeUser(String urgeUser) {
		this.urgeUser = urgeUser;
	}

	public Date getUrgeDate() {
		return this.urgeDate;
	}

	public void setUrgeDate(Date urgeDate) {
		this.urgeDate = urgeDate;
	}

	public String getUrgeInfo() {
		return this.urgeInfo;
	}

	public void setUrgeInfo(String urgeInfo) {
		this.urgeInfo = urgeInfo;
	}

	public Date getRequireDate() {
		return this.requireDate;
	}

	public void setRequireDate(Date requireDate) {
		this.requireDate = requireDate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}