package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzBodysOutPrintViewId entity. @author MyEclipse Persistence Tools
 */

public class WzBodysOutsubPrintView implements java.io.Serializable {

	// Fields

	private String uids;
	private String outuids;
	private String outno;
	private Date outdate;
	private String inno;
	private String pid;
	private String conno;
	private String conname;
	private String partb;
	private String outunit;
	private String outtype;
	private String bodyname;
	private String ggxh;
	private String unit;
	private Double outnum;
	private Double price;
	private Double amount;
	private String useparts;
	private String memo;
	private String special;

	// Constructors

	/** default constructor */
	public WzBodysOutsubPrintView() {
	}

	/** minimal constructor */
	public WzBodysOutsubPrintView(String uids, String outuids, String pid) {
		this.uids = uids;
		this.outuids = outuids;
		this.pid = pid;
	}

	/** full constructor */
	public WzBodysOutsubPrintView(String uids, String outuids, String outno,
			Date outdate, String inno, String pid, String conno,
			String conname, String partb, String outunit, String outtype,
			String bodyname, String ggxh, String unit, Double outnum,
			Double price, Double amount, String useparts, String memo,
			String special) {
		super();
		this.uids = uids;
		this.outuids = outuids;
		this.outno = outno;
		this.outdate = outdate;
		this.inno = inno;
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.partb = partb;
		this.outunit = outunit;
		this.outtype = outtype;
		this.bodyname = bodyname;
		this.ggxh = ggxh;
		this.unit = unit;
		this.outnum = outnum;
		this.price = price;
		this.amount = amount;
		this.useparts = useparts;
		this.memo = memo;
		this.special = special;
	}

	
	// Property accessors

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getOutuids() {
		return outuids;
	}

	public void setOutuids(String outuids) {
		this.outuids = outuids;
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

	public String getBodyname() {
		return bodyname;
	}

	public void setBodyname(String bodyname) {
		this.bodyname = bodyname;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getOutnum() {
		return outnum;
	}

	public void setOutnum(Double outnum) {
		this.outnum = outnum;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getUseparts() {
		return useparts;
	}

	public void setUseparts(String useparts) {
		this.useparts = useparts;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getSpecial() {
		return special;
	}

	public void setSpecial(String special) {
		this.special = special;
	}

}