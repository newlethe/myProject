package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzCjspbHz entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCjspbHz implements java.io.Serializable {

	// Fields

	private String uids;
	private String flowid;
	private Date hzdate;
	private String hzdept;
	private String hzuser;
	private Double hzmoney;
	private String hzwzflbm;
	private String billState;
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public WzCjspbHz() {
	}

	/** full constructor */
	public WzCjspbHz(String flowid, Date hzdate, String hzdept, String hzuser,
			Double hzmoney, String hzwzflbm, String billState) {
		this.flowid = flowid;
		this.hzdate = hzdate;
		this.hzdept = hzdept;
		this.hzuser = hzuser;
		this.hzmoney = hzmoney;
		this.hzwzflbm = hzwzflbm;
		this.billState = billState;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getFlowid() {
		return this.flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public Date getHzdate() {
		return this.hzdate;
	}

	public void setHzdate(Date hzdate) {
		this.hzdate = hzdate;
	}

	public String getHzdept() {
		return this.hzdept;
	}

	public void setHzdept(String hzdept) {
		this.hzdept = hzdept;
	}

	public String getHzuser() {
		return this.hzuser;
	}

	public void setHzuser(String hzuser) {
		this.hzuser = hzuser;
	}

	public Double getHzmoney() {
		return this.hzmoney;
	}

	public void setHzmoney(Double hzmoney) {
		this.hzmoney = hzmoney;
	}

	public String getHzwzflbm() {
		return this.hzwzflbm;
	}

	public void setHzwzflbm(String hzwzflbm) {
		this.hzwzflbm = hzwzflbm;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}
}