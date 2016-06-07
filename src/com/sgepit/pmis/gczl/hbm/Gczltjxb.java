package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

/**
 * Gczltjxb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class Gczltjxb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bh;
	private Long xh;
	private String yy;
	private String bz;
	private Date tjsj;
	private String jz;

	// Constructors

	/** default constructor */
	public Gczltjxb() {
	}

	/** full constructor */
	public Gczltjxb(String pid, String bh, Long xh, String yy, String bz,
			Date tjsj, String jz) {
		this.pid = pid;
		this.bh = bh;
		this.xh = xh;
		this.yy = yy;
		this.bz = bz;
		this.tjsj = tjsj;
		this.jz = jz;
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

	public Long getXh() {
		return this.xh;
	}

	public void setXh(Long xh) {
		this.xh = xh;
	}

	public String getYy() {
		return this.yy;
	}

	public void setYy(String yy) {
		this.yy = yy;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public Date getTjsj() {
		return this.tjsj;
	}

	public void setTjsj(Date tjsj) {
		this.tjsj = tjsj;
	}

	public String getJz() {
		return this.jz;
	}

	public void setJz(String jz) {
		this.jz = jz;
	}

}