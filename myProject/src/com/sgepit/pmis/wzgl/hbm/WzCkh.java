package com.sgepit.pmis.wzgl.hbm;

/**
 * WzCkh entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCkh implements java.io.Serializable {

	// Fields

	private String uids;
	private String ckh;
	private String ckmc;
	private String bz;
	
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public WzCkh() {
	}

	/** minimal constructor */
	public WzCkh(String ckh, String ckmc) {
		this.ckh = ckh;
		this.ckmc = ckmc;
	}

	/** full constructor */
	public WzCkh(String ckh, String ckmc, String bz) {
		this.ckh = ckh;
		this.ckmc = ckmc;
		this.bz = bz;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCkh() {
		return this.ckh;
	}

	public void setCkh(String ckh) {
		this.ckh = ckh;
	}

	public String getCkmc() {
		return this.ckmc;
	}

	public void setCkmc(String ckmc) {
		this.ckmc = ckmc;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

}