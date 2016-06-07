package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzBodysInPrintViewId entity. @author MyEclipse Persistence Tools
 */

public class WzBodysInPrintView implements java.io.Serializable {

	// Fields

	private String uids;
	private String inno;
	private Date indate;
	private String pid;
	private String conno;
	private String conname;
	private String partb;
	private String invoiceno;
	private String intype;
	private String special;

	// Constructors

	/** default constructor */
	public WzBodysInPrintView() {
	}

	/** minimal constructor */
	public WzBodysInPrintView(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public WzBodysInPrintView(String uids, String inno, Date indate,
			String pid, String conno, String conname, String partb,
			String invoiceno, String intype, String special) {
		super();
		this.uids = uids;
		this.inno = inno;
		this.indate = indate;
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.partb = partb;
		this.invoiceno = invoiceno;
		this.intype = intype;
		this.special = special;
	}
	

	// Property accessors

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getInno() {
		return inno;
	}

	public void setInno(String inno) {
		this.inno = inno;
	}

	public Date getIndate() {
		return indate;
	}

	public void setIndate(Date indate) {
		this.indate = indate;
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

	public String getInvoiceno() {
		return invoiceno;
	}

	public void setInvoiceno(String invoiceno) {
		this.invoiceno = invoiceno;
	}

	public String getIntype() {
		return intype;
	}

	public void setIntype(String intype) {
		this.intype = intype;
	}

	public String getSpecial() {
		return special;
	}

	public void setSpecial(String special) {
		this.special = special;
	}

}