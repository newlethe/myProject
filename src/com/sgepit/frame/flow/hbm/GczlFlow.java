package com.sgepit.frame.flow.hbm;

import java.util.Date;

/**
 * GczlFlow entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlFlow implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String jyxmUids;
	private String xmbh;
	private String flowid;
	private String flowuser;
	private Date flowdate;
	private Long isdefault;

	// Constructors

	/** default constructor */
	public GczlFlow() {
	}

	/** minimal constructor */
	public GczlFlow(String jyxmUids, String flowid) {
		this.jyxmUids = jyxmUids;
		this.flowid = flowid;
	}

	/** full constructor */
	public GczlFlow(String pid, String jyxmUids, String xmbh, String flowid,
			String flowuser, Date flowdate, Long isdefault) {
		this.pid = pid;
		this.jyxmUids = jyxmUids;
		this.xmbh = xmbh;
		this.flowid = flowid;
		this.flowuser = flowuser;
		this.flowdate = flowdate;
		this.isdefault = isdefault;
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

	public String getJyxmUids() {
		return this.jyxmUids;
	}

	public void setJyxmUids(String jyxmUids) {
		this.jyxmUids = jyxmUids;
	}

	public String getFlowid() {
		return flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getFlowuser() {
		return this.flowuser;
	}

	public void setFlowuser(String flowuser) {
		this.flowuser = flowuser;
	}

	public Date getFlowdate() {
		return this.flowdate;
	}

	public void setFlowdate(Date flowdate) {
		this.flowdate = flowdate;
	}

	public Long getIsdefault() {
		return this.isdefault;
	}

	public void setIsdefault(Long isdefault) {
		this.isdefault = isdefault;
	}

	public String getXmbh() {
		return xmbh;
	}

	public void setXmbh(String xmbh) {
		this.xmbh = xmbh;
	}
}