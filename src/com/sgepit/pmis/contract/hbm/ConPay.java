package com.sgepit.pmis.contract.hbm;

import java.util.Date;

/**
 * ConPay entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConPay implements java.io.Serializable {

	// Fields

	private String payid;
	private String pid;
	private String payno;
	private String actman;
	private Date paydate;
	private String paytype;
	private String payins;
	private Long billstate;
	private String filelsh;
	private String conid;
	private Double appmoney;
	private Double demoney;
	private Double paymoney;
	private String invoiceno;
	private Double invoicemoney;
	private String cashuse;
	private Double passmoney;  
	private Double planmoney;  
	private String remark;
	private String payway;//付款方式
	private String paymentno;//付款凭证号
	private String invoicerecord;//发票入账票证号
	private String applydept;//申请付款部门
	private String applyuser;//申请付款人
	private Date applydate;//申请付款时间
	private String approveuser;//批准付款人;
	private Date approvedate;//批准付款时间
	private String actualuser;//实际支付人员;

	private String fundsPlanId; //计划付款与资金计划关联
	private Double factpaymoney;//实际付款分摊金额
	private String applyFileid;//付款申请单主键
	private String invoiceFileid;//增值税专用发票收据单主键
	private Date invoiceDate;//发票日期

	public String getFundsPlanId() {
		return fundsPlanId;
	}

	public void setFundsPlanId(String fundsPlanId) {
		this.fundsPlanId = fundsPlanId;
	}

	// Constructors
	public ConPay(String payid, String pid, String payno, String actman,
			Date paydate, String paytype, String payins, Long billstate,
			String filelsh, String conid, Double appmoney, Double demoney,
			Double paymoney, String invoiceno, Double invoicemoney,
			String cashuse, Double passmoney, Double planmoney, String remark,
			String payway, String paymentno, String invoicerecord,
			String applydept, String applyuser, Date applydate,
			String approveuser, Date approvedate, String actualuser,
			String fundsPlanId, Double factpaymoney, String applyFileid,
			String invoiceFileid, Date invoiceDate) {
		super();
		this.payid = payid;
		this.pid = pid;
		this.payno = payno;
		this.actman = actman;
		this.paydate = paydate;
		this.paytype = paytype;
		this.payins = payins;
		this.billstate = billstate;
		this.filelsh = filelsh;
		this.conid = conid;
		this.appmoney = appmoney;
		this.demoney = demoney;
		this.paymoney = paymoney;
		this.invoiceno = invoiceno;
		this.invoicemoney = invoicemoney;
		this.cashuse = cashuse;
		this.passmoney = passmoney;
		this.planmoney = planmoney;
		this.remark = remark;
		this.payway = payway;
		this.paymentno = paymentno;
		this.invoicerecord = invoicerecord;
		this.applydept = applydept;
		this.applyuser = applyuser;
		this.applydate = applydate;
		this.approveuser = approveuser;
		this.approvedate = approvedate;
		this.actualuser = actualuser;
		this.fundsPlanId = fundsPlanId;
		this.factpaymoney = factpaymoney;
		this.applyFileid = applyFileid;
		this.invoiceFileid = invoiceFileid;
		this.invoiceDate = invoiceDate;
	}

	/** default constructor */
	public ConPay() {
	}

	/** minimal constructor */
	public ConPay(String pid, String conid) {
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */

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

	public String getPayno() {
		return this.payno;
	}

	public void setPayno(String payno) {
		this.payno = payno;
	}

	public String getActman() {
		return this.actman;
	}

	public void setActman(String actman) {
		this.actman = actman;
	}

	public Date getPaydate() {
		return this.paydate;
	}

	public void setPaydate(Date paydate) {
		this.paydate = paydate;
	}

	public String getPaytype() {
		return this.paytype;
	}

	public void setPaytype(String paytype) {
		this.paytype = paytype;
	}

	public String getPayins() {
		return this.payins;
	}

	public void setPayins(String payins) {
		this.payins = payins;
	}

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public String getFilelsh() {
		return this.filelsh;
	}

	public void setFilelsh(String filelsh) {
		this.filelsh = filelsh;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getAppmoney() {
		return this.appmoney;
	}

	public void setAppmoney(Double appmoney) {
		this.appmoney = appmoney;
	}

	public Double getPaymoney() {
		return this.paymoney;
	}

	public void setPaymoney(Double paymoney) {
		this.paymoney = paymoney;
	}

	public String getInvoiceno() {
		return this.invoiceno;
	}

	public void setInvoiceno(String invoiceno) {
		this.invoiceno = invoiceno;
	}

	public Double getInvoicemoney() {
		return this.invoicemoney;
	}

	public void setInvoicemoney(Double invoicemoney) {
		this.invoicemoney = invoicemoney;
	}

	public String getCashuse() {
		return this.cashuse;
	}

	public void setCashuse(String cashuse) {
		this.cashuse = cashuse;
	}

	public Double getPassmoney() {
		return this.passmoney;
	}

	public void setPassmoney(Double passmoney) {
		this.passmoney = passmoney;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Double getDemoney() {
		return demoney;
	}

	public void setDemoney(Double demoney) {
		this.demoney = demoney;
	}

	public Double getPlanmoney() {
		return planmoney;
	}

	public void setPlanmoney(Double planmoney) {
		this.planmoney = planmoney;
	}

	public String getPayway() {
		return payway;
	}

	public void setPayway(String payway) {
		this.payway = payway;
	}

	public String getPaymentno() {
		return paymentno;
	}

	public void setPaymentno(String paymentno) {
		this.paymentno = paymentno;
	}

	public String getInvoicerecord() {
		return invoicerecord;
	}

	public void setInvoicerecord(String invoicerecord) {
		this.invoicerecord = invoicerecord;
	}

	public String getApplydept() {
		return applydept;
	}

	public void setApplydept(String applydept) {
		this.applydept = applydept;
	}

	public String getApplyuser() {
		return applyuser;
	}

	public void setApplyuser(String applyuser) {
		this.applyuser = applyuser;
	}

	public Date getApplydate() {
		return applydate;
	}

	public void setApplydate(Date applydate) {
		this.applydate = applydate;
	}

	public String getApproveuser() {
		return approveuser;
	}

	public void setApproveuser(String approveuser) {
		this.approveuser = approveuser;
	}

	public Date getApprovedate() {
		return approvedate;
	}

	public void setApprovedate(Date approvedate) {
		this.approvedate = approvedate;
	}

	public String getActualuser() {
		return actualuser;
	}

	public void setActualuser(String actualuser) {
		this.actualuser = actualuser;
	}

	public Double getFactpaymoney() {
		return factpaymoney;
	}

	public void setFactpaymoney(Double factpaymoney) {
		this.factpaymoney = factpaymoney;
	}

	public String getApplyFileid() {
		return applyFileid;
	}

	public void setApplyFileid(String applyFileid) {
		this.applyFileid = applyFileid;
	}

	public String getInvoiceFileid() {
		return invoiceFileid;
	}

	public void setInvoiceFileid(String invoiceFileid) {
		this.invoiceFileid = invoiceFileid;
	}

	public Date getInvoiceDate() {
		return invoiceDate;
	}

	public void setInvoiceDate(Date invoiceDate) {
		this.invoiceDate = invoiceDate;
	}

}