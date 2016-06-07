package com.sgepit.pmis.gczl.hbm;

/**
 * Gczljjzbxb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class Gczljjzbxb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bh;
	private String mc;
	private Long lvl;
	private String bzz;
	private String sjz;
	private String bz;
	private String yy;
	private String jz;
	private String bzxmbh;

	// Constructors

	/** default constructor */
	public Gczljjzbxb() {
	}

	/** full constructor */
	public Gczljjzbxb(String pid, String bh, String mc, Long lvl, String bzz,
			String sjz, String bz, String yy, String jz, String bzxmbh) {
		this.pid = pid;
		this.bh = bh;
		this.mc = mc;
		this.lvl = lvl;
		this.bzz = bzz;
		this.sjz = sjz;
		this.bz = bz;
		this.yy = yy;
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

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getMc() {
		return this.mc;
	}

	public void setMc(String mc) {
		this.mc = mc;
	}

	public Long getLvl() {
		return this.lvl;
	}

	public void setLvl(Long lvl) {
		this.lvl = lvl;
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

	public String getYy() {
		return this.yy;
	}

	public void setYy(String yy) {
		this.yy = yy;
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