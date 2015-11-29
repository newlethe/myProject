package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

/**
 * GczlXnxb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlXnxb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String xmbh;
	private String bh;
	private String khxm;
	private String jldw;
	private String bzz;
	private String sjz;
	private String bz;
	private Date rq;
	private String jz;
	private String bzxmbh;

	// Constructors

	/** default constructor */
	public GczlXnxb() {
	}

	/** full constructor */
	public GczlXnxb(String pid, String xmbh, String bh, String khxm,
			String jldw, String bzz, String sjz, String bz, Date rq, String jz,
			String bzxmbh) {
		this.pid = pid;
		this.xmbh = xmbh;
		this.bh = bh;
		this.khxm = khxm;
		this.jldw = jldw;
		this.bzz = bzz;
		this.sjz = sjz;
		this.bz = bz;
		this.rq = rq;
		this.jz = jz;
		this.bzxmbh = bzxmbh;
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

	public String getXmbh() {
		return this.xmbh;
	}

	public void setXmbh(String xmbh) {
		this.xmbh = xmbh;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getKhxm() {
		return this.khxm;
	}

	public void setKhxm(String khxm) {
		this.khxm = khxm;
	}

	public String getJldw() {
		return this.jldw;
	}

	public void setJldw(String jldw) {
		this.jldw = jldw;
	}

	public String getBzz() {
		return this.bzz;
	}

	public void setBzz(String bzz) {
		this.bzz = bzz;
	}

	public String getSjz() {
		return this.sjz;
	}

	public void setSjz(String sjz) {
		this.sjz = sjz;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
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

	public String getBzxmbh() {
		return this.bzxmbh;
	}

	public void setBzxmbh(String bzxmbh) {
		this.bzxmbh = bzxmbh;
	}

}