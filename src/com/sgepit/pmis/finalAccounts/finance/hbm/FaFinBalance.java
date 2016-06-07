package com.sgepit.pmis.finalAccounts.finance.hbm;

import java.math.BigDecimal;

/**
 * FaFinBalance entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FaFinBalance implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String accountId;
	private String subYear;
	private String period;
	private String subNo;
	private BigDecimal beginningBalance;
	private BigDecimal termEndBalance;
	private BigDecimal debitAmount;
	private BigDecimal creditAmount;
	private BigDecimal debitAmountAddup;
	private BigDecimal creditAmountAddup;

	// Constructors

	/** default constructor */
	public FaFinBalance() {
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getAccountId() {
		return this.accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

	public String getSubYear() {
		return this.subYear;
	}

	public void setSubYear(String subYear) {
		this.subYear = subYear;
	}

	public String getPeriod() {
		return this.period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public String getSubNo() {
		return this.subNo;
	}

	public void setSubNo(String subNo) {
		this.subNo = subNo;
	}

	public BigDecimal getBeginningBalance() {
		return beginningBalance;
	}

	public void setBeginningBalance(BigDecimal beginningBalance) {
		this.beginningBalance = beginningBalance;
	}

	public BigDecimal getTermEndBalance() {
		return termEndBalance;
	}

	public void setTermEndBalance(BigDecimal termEndBalance) {
		this.termEndBalance = termEndBalance;
	}

	public BigDecimal getDebitAmount() {
		return debitAmount;
	}

	public void setDebitAmount(BigDecimal debitAmount) {
		this.debitAmount = debitAmount;
	}

	public BigDecimal getCreditAmount() {
		return creditAmount;
	}

	public void setCreditAmount(BigDecimal creditAmount) {
		this.creditAmount = creditAmount;
	}

	public BigDecimal getDebitAmountAddup() {
		return debitAmountAddup;
	}

	public void setDebitAmountAddup(BigDecimal debitAmountAddup) {
		this.debitAmountAddup = debitAmountAddup;
	}

	public BigDecimal getCreditAmountAddup() {
		return creditAmountAddup;
	}

	public void setCreditAmountAddup(BigDecimal creditAmountAddup) {
		this.creditAmountAddup = creditAmountAddup;
	}

	
}