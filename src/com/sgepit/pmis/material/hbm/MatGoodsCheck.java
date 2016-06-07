package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatGoodsCheck entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatGoodsCheck implements java.io.Serializable {

	// Fields

	private String uuid;
	private String checkNo;
	private String formid;
	private String conid;
	private String offerDept;
	private Date arriDate;
	private Date realDate;
	private String transDept;
	private String remark;

	// Constructors

	/** default constructor */
	public MatGoodsCheck() {
	}

	/** full constructor */
	public MatGoodsCheck(String checkNo, String formid, String conid,
			String offerDept, Date arriDate, Date realDate, String transDept,
			String remark) {
		this.checkNo = checkNo;
		this.formid = formid;
		this.conid = conid;
		this.offerDept = offerDept;
		this.arriDate = arriDate;
		this.realDate = realDate;
		this.transDept = transDept;
		this.remark = remark;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getCheckNo() {
		return this.checkNo;
	}

	public void setCheckNo(String checkNo) {
		this.checkNo = checkNo;
	}

	public String getFormid() {
		return this.formid;
	}

	public void setFormid(String formid) {
		this.formid = formid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getOfferDept() {
		return this.offerDept;
	}

	public void setOfferDept(String offerDept) {
		this.offerDept = offerDept;
	}

	public Date getArriDate() {
		return this.arriDate;
	}

	public void setArriDate(Date arriDate) {
		this.arriDate = arriDate;
	}

	public Date getRealDate() {
		return this.realDate;
	}

	public void setRealDate(Date realDate) {
		this.realDate = realDate;
	}

	public String getTransDept() {
		return this.transDept;
	}

	public void setTransDept(String transDept) {
		this.transDept = transDept;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}