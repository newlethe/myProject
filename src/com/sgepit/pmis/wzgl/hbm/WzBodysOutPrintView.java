package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzBodysOutPrintViewId entity. @author MyEclipse Persistence Tools
 */

public class WzBodysOutPrintView implements java.io.Serializable {

	// Fields

	private String uids;
	private String outno;
	private Date outdate;
	private String inno;
	private String pid;
	private String conno;
	private String conname;
	private String partb;
	private String outunit;
	private String outtype;

	// Constructors

	/** default constructor */
	public WzBodysOutPrintView() {
	}

	/** minimal constructor */
	public WzBodysOutPrintView(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public WzBodysOutPrintView(String uids, String outno, Date outdate,
			String inno, String pid, String conno, String conname,
			String partb, String outunit, String outtype) {
		this.uids = uids;
		this.outno = outno;
		this.outdate = outdate;
		this.inno = inno;
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.partb = partb;
		this.outunit = outunit;
		this.outtype = outtype;
	}

	
	
	// Property accessors

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getOutno() {
		return outno;
	}

	public void setOutno(String outno) {
		this.outno = outno;
	}

	public Date getOutdate() {
		return outdate;
	}

	public void setOutdate(Date outdate) {
		this.outdate = outdate;
	}

	public String getInno() {
		return inno;
	}

	public void setInno(String inno) {
		this.inno = inno;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConno() {
		return conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getPartb() {
		return partb;
	}

	public void setPartb(String partb) {
		this.partb = partb;
	}

	public String getOutunit() {
		return outunit;
	}

	public void setOutunit(String outunit) {
		this.outunit = outunit;
	}

	public String getOuttype() {
		return outtype;
	}

	public void setOuttype(String outtype) {
		this.outtype = outtype;
	}


}