package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

/**
 * GczlXnzb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlXnzb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bh;
	private Date rq;
	private String jz;
	private Date rq1;
	private Date rq2;

	// Constructors

	/** default constructor */
	public GczlXnzb() {
	}

	/** full constructor */
	public GczlXnzb(String pid, String bh, Date rq, String jz, Date rq1,
			Date rq2) {
		this.pid = pid;
		this.bh = bh;
		this.rq = rq;
		this.jz = jz;
		this.rq1 = rq1;
		this.rq2 = rq2;
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

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public Date getRq() {
		return this.rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public String getJz() {
		return this.jz;
	}

	public void setJz(String jz) {
		this.jz = jz;
	}

	public Date getRq1() {
		return this.rq1;
	}

	public void setRq1(Date rq1) {
		this.rq1 = rq1;
	}

	public Date getRq2() {
		return this.rq2;
	}

	public void setRq2(Date rq2) {
		this.rq2 = rq2;
	}

}