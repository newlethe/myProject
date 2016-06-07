package com.sgepit.pmis.contract.hbm;

import java.util.Date;

/**
 * 新合同付款台账视图
 * @author pengy 2014-06-12
 */

public class ConPayAccountView implements java.io.Serializable {

	// Fields

	private String conid;
	private String pid;
	private String conno;
	private String conname;
	private String condivno;
	private String sort;
	private String partybno;
	private String partyb;
	private Double conmoney;
	private Date signdate;
	private String payper;
	private Double performanceMoney;
	private Date performancedate;
	private Long billstate;
	private Double convaluemoney;
	private Double coninvoicemoney;
	private Double conpay;

	// Constructors

	public ConPayAccountView() {
	}

	public ConPayAccountView(String conid, String pid, String conno,
			String conname, String condivno, String sort, String partybno,
			String partyb, Double conmoney, Date signdate, String payper,
			Double performanceMoney, Date performancedate, Long billstate,
			Double convaluemoney, Double coninvoicemoney, Double conpay) {
		super();
		this.conid = conid;
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.condivno = condivno;
		this.sort = sort;
		this.partybno = partybno;
		this.partyb = partyb;
		this.conmoney = conmoney;
		this.signdate = signdate;
		this.payper = payper;
		this.performanceMoney = performanceMoney;
		this.performancedate = performancedate;
		this.billstate = billstate;
		this.convaluemoney = convaluemoney;
		this.coninvoicemoney = coninvoicemoney;
		this.conpay = conpay;
	}

	// Property accessors

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
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

	public String getCondivno() {
		return condivno;
	}

	public void setCondivno(String condivno) {
		this.condivno = condivno;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public String getPartybno() {
		return this.partybno;
	}

	public void setPartybno(String partybno) {
		this.partybno = partybno;
	}

	public String getPartyb() {
		return this.partyb;
	}

	public void setPartyb(String partyb) {
		this.partyb = partyb;
	}

	public Double getConmoney() {
		return this.conmoney;
	}

	public void setConmoney(Double conmoney) {
		this.conmoney = conmoney;
	}

	public Date getSigndate() {
		return this.signdate;
	}

	public void setSigndate(Date signdate) {
		this.signdate = signdate;
	}

	public String getPayper() {
		return this.payper;
	}

	public void setPayper(String payper) {
		this.payper = payper;
	}

	public Double getPerformanceMoney() {
		return this.performanceMoney;
	}

	public void setPerformanceMoney(Double performanceMoney) {
		this.performanceMoney = performanceMoney;
	}

	public Date getPerformancedate() {
		return this.performancedate;
	}

	public void setPerformancedate(Date performancedate) {
		this.performancedate = performancedate;
	}

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public Double getConvaluemoney() {
		return this.convaluemoney;
	}

	public void setConvaluemoney(Double convaluemoney) {
		this.convaluemoney = convaluemoney;
	}

	public Double getConinvoicemoney() {
		return this.coninvoicemoney;
	}

	public void setConinvoicemoney(Double coninvoicemoney) {
		this.coninvoicemoney = coninvoicemoney;
	}

	public Double getConpay() {
		return this.conpay;
	}

	public void setConpay(Double conpay) {
		this.conpay = conpay;
	}

}