package com.sgepit.pmis.routine.hbm;

import java.util.Date;

/**
 * ZdGl entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ZdGl implements java.io.Serializable {

	// Fields

	private String zdid;
	private String pid;
	private String indexid;
	private String mc;
	private Date bzrq;
	private String sl;
	private String bz;
	private String filelsh;
	private String filename;
	private String bzr;
	private String zdbh;
	private String bm;

	// Constructors

	/** default constructor */
	public ZdGl() {
	}

	/** minimal constructor */
	public ZdGl(String zdid, String pid) {
		this.zdid = zdid;
		this.pid = pid;
	}

	/** full constructor */
	public ZdGl(String zdid, String pid, String indexid, String mc, Date bzrq,
			String sl, String bz, String filelsh, String filename, String bzr,
			String zdbh,String bm) {
		this.zdid = zdid;
		this.pid = pid;
		this.indexid = indexid;
		this.mc = mc;
		this.bzrq = bzrq;
		this.sl = sl;
		this.bz = bz;
		this.filelsh = filelsh;
		this.filename = filename;
		this.bzr = bzr;
		this.zdbh = zdbh;
		this.bm=bm;
	}

	// Property accessors

	public String getZdid() {
		return this.zdid;
	}

	public void setZdid(String zdid) {
		this.zdid = zdid;
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

	public String getZdbh() {
		return this.zdbh;
	}

	public void setZdbh(String zdbh) {
		this.zdbh = zdbh;
	}

	public String getBm() {
		return bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

}