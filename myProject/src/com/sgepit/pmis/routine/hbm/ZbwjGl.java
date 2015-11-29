package com.sgepit.pmis.routine.hbm;

import java.util.Date;

/**
 * ZbwjGl entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ZbwjGl implements java.io.Serializable {

	// Fields

	private String zbid;
	private String pid;
	private String indexid;
	private String mc;
	private Date bzrq;
	private String sl;
	private String bz;
	private String filelsh;
	private String filename;
	private String bzr;
	private String zbbh;
	private String isremove;
	private String bm;
	

	// Constructors

	public ZbwjGl(String zbid, String pid, String indexid, String mc,
			Date bzrq, String sl, String bz, String filelsh, String filename,
			String bzr, String zbbh, String isremove,String bm) {
		super();
		this.zbid = zbid;
		this.pid = pid;
		this.indexid = indexid;
		this.mc = mc;
		this.bzrq = bzrq;
		this.sl = sl;
		this.bz = bz;
		this.filelsh = filelsh;
		this.filename = filename;
		this.bzr = bzr;
		this.zbbh = zbbh;
		this.isremove = isremove;
		this.bm=bm;
	}

	/** default constructor */
	public ZbwjGl() {
	}

	/** minimal constructor */
	public ZbwjGl(String zbid) {
		this.zbid = zbid;
	}

	/** full constructor */

	// Property accessors

	public String getZbid() {
		return this.zbid;
	}

	public void setZbid(String zbid) {
		this.zbid = zbid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getIndexid() {
		return this.indexid;
	}

	public void setIndexid(String indexid) {
		this.indexid = indexid;
	}

	public String getMc() {
		return this.mc;
	}

	public void setMc(String mc) {
		this.mc = mc;
	}

	public Date getBzrq() {
		return this.bzrq;
	}

	public void setBzrq(Date bzrq) {
		this.bzrq = bzrq;
	}

	public String getSl() {
		return this.sl;
	}

	public void setSl(String sl) {
		this.sl = sl;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getFilelsh() {
		return this.filelsh;
	}

	public void setFilelsh(String filelsh) {
		this.filelsh = filelsh;
	}

	public String getFilename() {
		return this.filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getBzr() {
		return this.bzr;
	}

	public void setBzr(String bzr) {
		this.bzr = bzr;
	}

	public String getZbbh() {
		return this.zbbh;
	}

	public void setZbbh(String zbbh) {
		this.zbbh = zbbh;
	}

	public String getIsremove() {
		return isremove;
	}

	public void setIsremove(String isremove) {
		this.isremove = isremove;
	}

	public String getBm() {
		return bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

}