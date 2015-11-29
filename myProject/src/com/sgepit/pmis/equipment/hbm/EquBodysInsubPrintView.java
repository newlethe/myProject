package com.sgepit.pmis.equipment.hbm;

import java.math.BigDecimal;
import java.util.Date;

/**
 * EquBodysInsubPrintViewId entity. @author MyEclipse Persistence Tools
 */

public class EquBodysInsubPrintView implements java.io.Serializable {

	// Fields

	private String uids;
	private String inuids;
	private String inno;
	private Date indate;
	private String pid;
	private String conno;
	private String conname;
	private String partb;
	private String invoiceno;
	private String intype;
	private String bodyname;
	private String ggxh;
	private String unit;
	private Double mustnum;
	private Double realnum;
	private BigDecimal taxrate;
	private Double unitprice;
	private Double amountmoney;
	private Double taxes;
	private Double freightmoney;
	private Double othermoney;
	private Double intomoney;
	private Double totalmoney;
	private String inplace;

	// Constructors

	/** default constructor */
	public EquBodysInsubPrintView() {
	}

	/** minimal constructor */
	public EquBodysInsubPrintView(String uids, String inuids, String pid) {
		this.uids = uids;
		this.inuids = inuids;
		this.pid = pid;
	}

	/** full constructor */
	public EquBodysInsubPrintView(String uids, String inuids, String inno,
			Date indate, String pid, String conno, String conname,
			String partb, String invoiceno, String intype, String bodyname,
			String ggxh, String unit, Double mustnum, Double realnum,
			BigDecimal taxrate, Double unitprice, Double amountmoney,
			Double taxes, Double freightmoney, Double othermoney,
			Double intomoney, Double totalmoney, String inplace) {
		this.uids = uids;
		this.inuids = inuids;
		this.inno = inno;
		this.indate = indate;
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.partb = partb;
		this.invoiceno = invoiceno;
		this.intype = intype;
		this.bodyname = bodyname;
		this.ggxh = ggxh;
		this.unit = unit;
		this.mustnum = mustnum;
		this.realnum = realnum;
		this.taxrate = taxrate;
		this.unitprice = unitprice;
		this.amountmoney = amountmoney;
		this.taxes = taxes;
		this.freightmoney = freightmoney;
		this.othermoney = othermoney;
		this.intomoney = intomoney;
		this.totalmoney = totalmoney;
		this.inplace = inplace;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getInuids() {
		return this.inuids;
	}

	public void setInuids(String inuids) {
		this.inuids = inuids;
	}

	public String getInno() {
		return this.inno;
	}

	public void setInno(String inno) {
		this.inno = inno;
	}

	public Date getIndate() {
		return this.indate;
	}

	public void setIndate(Date indate) {
		this.indate = indate;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConno() {
		return this.conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return this.conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getPartb() {
		return this.partb;
	}

	public void setPartb(String partb) {
		this.partb = partb;
	}

	public String getInvoiceno() {
		return this.invoiceno;
	}

	public void setInvoiceno(String invoiceno) {
		this.invoiceno = invoiceno;
	}

	public String getIntype() {
		return this.intype;
	}

	public void setIntype(String intype) {
		this.intype = intype;
	}

	public String getBodyname() {
		return this.bodyname;
	}

	public void setBodyname(String bodyname) {
		this.bodyname = bodyname;
	}

	public String getGgxh() {
		return this.ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getMustnum() {
		return this.mustnum;
	}

	public void setMustnum(Double mustnum) {
		this.mustnum = mustnum;
	}

	public Double getRealnum() {
		return this.realnum;
	}

	public void setRealnum(Double realnum) {
		this.realnum = realnum;
	}

	public BigDecimal getTaxrate() {
		return this.taxrate;
	}

	public void setTaxrate(BigDecimal taxrate) {
		this.taxrate = taxrate;
	}

	public Double getUnitprice() {
		return this.unitprice;
	}

	public void setUnitprice(Double unitprice) {
		this.unitprice = unitprice;
	}

	public Double getAmountmoney() {
		return this.amountmoney;
	}

	public void setAmountmoney(Double amountmoney) {
		this.amountmoney = amountmoney;
	}

	public Double getTaxes() {
		return this.taxes;
	}

	public void setTaxes(Double taxes) {
		this.taxes = taxes;
	}

	public Double getFreightmoney() {
		return this.freightmoney;
	}

	public void setFreightmoney(Double freightmoney) {
		this.freightmoney = freightmoney;
	}

	public Double getOthermoney() {
		return this.othermoney;
	}

	public void setOthermoney(Double othermoney) {
		this.othermoney = othermoney;
	}

	public Double getIntomoney() {
		return this.intomoney;
	}

	public void setIntomoney(Double intomoney) {
		this.intomoney = intomoney;
	}

	public Double getTotalmoney() {
		return this.totalmoney;
	}

	public void setTotalmoney(Double totalmoney) {
		this.totalmoney = totalmoney;
	}

	public String getInplace() {
		return this.inplace;
	}

	public void setInplace(String inplace) {
		this.inplace = inplace;
	}

}