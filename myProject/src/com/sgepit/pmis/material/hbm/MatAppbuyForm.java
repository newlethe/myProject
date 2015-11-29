package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatAppbuyForm entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatAppbuyForm implements java.io.Serializable {

	// Fields

	private String uuid;
	private String no;
	private Date formDate;
	private String appMan;
	private String buyMan;
	private String remark;

	// Constructors

	/** default constructor */
	public MatAppbuyForm() {
	}

	/** full constructor */
	public MatAppbuyForm(String no, Date formDate, String appMan,
			String buyMan, String remark) {
		this.no = no;
		this.formDate = formDate;
		this.appMan = appMan;
		this.buyMan = buyMan;
		this.remark = remark;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getNo() {
		return this.no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public Date getFormDate() {
		return this.formDate;
	}

	public void setFormDate(Date formDate) {
		this.formDate = formDate;
	}

	public String getAppMan() {
		return this.appMan;
	}

	public void setAppMan(String appMan) {
		this.appMan = appMan;
	}

	public String getBuyMan() {
		return this.buyMan;
	}

	public void setBuyMan(String buyMan) {
		this.buyMan = buyMan;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}