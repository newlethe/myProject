package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatGoodsInvoice entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatGoodsInvoice implements java.io.Serializable {

	// Fields

	private String uuid;
	private String sequ;
	private Date invDate;
	private String invNo;
	private String partyb;
	private String conid;
	private Double buyFare;
	private Double transFare;
	private Double otherFare;
	private Double sum;
	private String remark;

	// Constructors

	/** default constructor */
	public MatGoodsInvoice() {
	}

	/** full constructor */
	public MatGoodsInvoice(String sequ, Date invDate, String invNo,
			String partyb, String conid, Double buyFare, Double transFare,
			Double otherFare, Double sum, String remark) {
		this.sequ = sequ;
		this.invDate = invDate;
		this.invNo = invNo;
		this.partyb = partyb;
		this.conid = conid;
		this.buyFare = buyFare;
		this.transFare = transFare;
		this.otherFare = otherFare;
		this.sum = sum;
		this.remark = remark;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getSequ() {
		return this.sequ;
	}

	public void setSequ(String sequ) {
		this.sequ = sequ;
	}

	public Date getInvDate() {
		return this.invDate;
	}

	public void setInvDate(Date invDate) {
		this.invDate = invDate;
	}

	public String getInvNo() {
		return this.invNo;
	}

	public void setInvNo(String invNo) {
		this.invNo = invNo;
	}

	public String getPartyb() {
		return this.partyb;
	}

	public void setPartyb(String partyb) {
		this.partyb = partyb;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getBuyFare() {
		return this.buyFare;
	}

	public void setBuyFare(Double buyFare) {
		this.buyFare = buyFare;
	}

	public Double getTransFare() {
		return this.transFare;
	}

	public void setTransFare(Double transFare) {
		this.transFare = transFare;
	}

	public Double getOtherFare() {
		return this.otherFare;
	}

	public void setOtherFare(Double otherFare) {
		this.otherFare = otherFare;
	}

	public Double getSum() {
		return this.sum;
	}

	public void setSum(Double sum) {
		this.sum = sum;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}