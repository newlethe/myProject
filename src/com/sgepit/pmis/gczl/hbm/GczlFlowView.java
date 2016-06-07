package com.sgepit.pmis.gczl.hbm;

import java.io.Serializable;

/**
 * GczlFlowView entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlFlowView implements Serializable {

	// Fields

	private String flowid;
	private String flowtitle;
	private String uids;
	private Long isdefault;
	private String jyxmuids;
	private String xmbh;
	private String pid;

	// Constructors


	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public GczlFlowView() {
	}

	/** full constructor */
	public GczlFlowView(String flowid, String flowtitle, String uids, Long isdefault,String jyxmuids,String xmbh) {
		this.flowid = flowid;
		this.flowtitle = flowtitle;
		this.uids = uids;
		this.isdefault = isdefault;
		this.jyxmuids = jyxmuids;
		this.xmbh = xmbh;
	}

	// Property accessors

	public String getFlowid() {
		return this.flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getFlowtitle() {
		return this.flowtitle;
	}

	public void setFlowtitle(String flowtitle) {
		this.flowtitle = flowtitle;
	}

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}
	

	public Long getIsdefault() {
		return isdefault;
	}

	public void setIsdefault(Long isdefault) {
		this.isdefault = isdefault;
	}

	public String getJyxmuids() {
		return jyxmuids;
	}

	public void setJyxmuids(String jyxmuids) {
		this.jyxmuids = jyxmuids;
	}

	public String getXmbh() {
		return xmbh;
	}

	public void setXmbh(String xmbh) {
		this.xmbh = xmbh;
	}

}