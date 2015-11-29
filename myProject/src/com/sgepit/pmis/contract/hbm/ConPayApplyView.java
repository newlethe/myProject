package com.sgepit.pmis.contract.hbm;

/**
 * 合同付款打印付款申请单和增值税专用发票收具单
 * @author pengy 2013-12-02
 */

public class ConPayApplyView {

	// Fields

	private String payid;
	private String pid;
	private String conname;
	private String nowdate;
	private Double convaluemoney;
	private Double paymoney;
	private Double alreadypaymoney;
	private String payway;
	private String partyb;
	private String partybbank;
	private String partybbankno;
	private Double invoicemoney;
	private Double coninvoicemoney;

	// Constructors

	/** default constructor */
	public ConPayApplyView() {
	}

	/** minimal constructor */
	public ConPayApplyView(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public ConPayApplyView(String pid, String conname, String nowdate,
			Double convaluemoney, Double paymoney,
			Double alreadypaymoney, String payway, String partyb,
			String partybbank, String partybbankno, Double invoicemoney,
			Double coninvoicemoney) {
		this.pid = pid;
		this.conname = conname;
		this.nowdate = nowdate;
		this.convaluemoney = convaluemoney;
		this.paymoney = paymoney;
		this.alreadypaymoney = alreadypaymoney;
		this.payway = payway;
		this.partyb = partyb;
		this.partybbank = partybbank;
		this.partybbankno = partybbankno;
		this.invoicemoney = invoicemoney;
		this.coninvoicemoney = coninvoicemoney;
	}

	// Property accessors

	public String getPayid() {
		return this.payid;
	}

	public void setPayid(String payid) {
		this.payid = payid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConname() {
		return this.conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getNowdate() {
		return this.nowdate;
	}

	public void setNowdate(String nowdate) {
		this.nowdate = nowdate;
	}

	public Double getConvaluemoney() {
		return this.convaluemoney;
	}

	public void setConvaluemoney(Double convaluemoney) {
		this.convaluemoney = convaluemoney;
	}

	public Double getPaymoney() {
		return this.paymoney;
	}

	public void setPaymoney(Double paymoney) {
		this.paymoney = paymoney;
	}

	public Double getAlreadypaymoney() {
		return this.alreadypaymoney;
	}

	public void setAlreadypaymoney(Double alreadypaymoney) {
		this.alreadypaymoney = alreadypaymoney;
	}

	public String getPayway() {
		return this.payway;
	}

	public void setPayway(String payway) {
		this.payway = payway;
	}

	public String getPartyb() {
		return this.partyb;
	}

	public void setPartyb(String partyb) {
		this.partyb = partyb;
	}

	public String getPartybbank() {
		return this.partybbank;
	}

	public void setPartybbank(String partybbank) {
		this.partybbank = partybbank;
	}

	public String getPartybbankno() {
		return this.partybbankno;
	}

	public void setPartybbankno(String partybbankno) {
		this.partybbankno = partybbankno;
	}

	public Double getInvoicemoney() {
		return this.invoicemoney;
	}

	public void setInvoicemoney(Double invoicemoney) {
		this.invoicemoney = invoicemoney;
	}

	public Double getConinvoicemoney() {
		return this.coninvoicemoney;
	}

	public void setConinvoicemoney(Double coninvoicemoney) {
		this.coninvoicemoney = coninvoicemoney;
	}

}