package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatStoreIn entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatStoreInReplace implements java.io.Serializable {

	// Fields
	private String uids;
	private String pid;
	private String bh;
	private String bm;
	private String tdBm;
	private Double tdNum;

	// Constructors

	/** default constructor */
	public MatStoreInReplace() {
	}

	/** full constructor */
	public MatStoreInReplace(String pid, String bm, String bh, String tdBm,
			Double tdNum) {
		this.pid = pid;
		this.bh = bh;
		this.bm = bm;
		this.tdBm = tdBm;
		this.tdNum = tdNum;
	}

	// Property accessors
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBh() {
		return bh;
	}
	
	public void setBh(String bh) {
		this.bh = bh;
	}
	
	public String getBm() {
		return bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getTdBm() {
		return tdBm;
	}

	public void setTdBm(String tdBm) {
		this.tdBm = tdBm;
	}

	public Double getTdNum() {
		return tdNum;
	}

	public void setTdNum(Double tdNum) {
		this.tdNum = tdNum;
	}

}