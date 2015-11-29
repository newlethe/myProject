package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquCont entity. @author MyEclipse Persistence Tools
 */

public class EquCont implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private Double equnum;
	private Date receivedate;
	private String planuser;
	private String storageuser;

	// Constructors

	/** default constructor */
	public EquCont() {
	}

	/** minimal constructor */
	public EquCont(String pid, String conid) {
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public EquCont(String pid, String conid, Double equnum, Date receivedate,
			String planuser, String storageuser) {
		this.pid = pid;
		this.conid = conid;
		this.equnum = equnum;
		this.receivedate = receivedate;
		this.planuser = planuser;
		this.storageuser = storageuser;
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

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getEqunum() {
		return this.equnum;
	}

	public void setEqunum(Double equnum) {
		this.equnum = equnum;
	}

	public Date getReceivedate() {
		return this.receivedate;
	}

	public void setReceivedate(Date receivedate) {
		this.receivedate = receivedate;
	}

	public String getPlanuser() {
		return this.planuser;
	}

	public void setPlanuser(String planuser) {
		this.planuser = planuser;
	}

	public String getStorageuser() {
		return this.storageuser;
	}

	public void setStorageuser(String storageuser) {
		this.storageuser = storageuser;
	}

}