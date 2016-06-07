package com.sgepit.pmis.design.hbm;

import java.util.Date;

/**
 * DesignInfoGl entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class DesignInfoGl implements java.io.Serializable {

	// Fields

	private String infoid;
	private String pid;
	private String indexid;
	private String mc;
	private Date bzrq;
	private String sl;
	private String bz;
	private String filelsh;
	private String filename;
	private String bzr;
	private String infobh;
	private String isremove;
	private String bm;

	// Constructors

	/** default constructor */
	public DesignInfoGl() {
	}

	/** minimal constructor */
	public DesignInfoGl(String infoid) {
		this.infoid = infoid;
	}

	/** full constructor */
	public DesignInfoGl(String infoid, String pid, String indexid, String mc,
			Date bzrq, String sl, String bz, String filelsh, String filename,
			String bzr, String infobh, String isremove, String bm) {
		this.infoid = infoid;
		this.pid = pid;
		this.indexid = indexid;
		this.mc = mc;
		this.bzrq = bzrq;
		this.sl = sl;
		this.bz = bz;
		this.filelsh = filelsh;
		this.filename = filename;
		this.bzr = bzr;
		this.infobh = infobh;
		this.isremove = isremove;
		this.bm = bm;
	}

	// Property accessors

	public String getInfoid() {
		return this.infoid;
	}

	public void setInfoid(String infoid) {
		this.infoid = infoid;
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

	public String getInfobh() {
		return this.infobh;
	}

	public void setInfobh(String infobh) {
		this.infobh = infobh;
	}

	public String getIsremove() {
		return this.isremove;
	}

	public void setIsremove(String isremove) {
		this.isremove = isremove;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

}