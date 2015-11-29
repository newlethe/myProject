package com.sgepit.pmis.material.hbm;

import java.util.Date;

/**
 * MatAppbuyBuy entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatAppbuyBuy implements java.io.Serializable {

	// Fields

	private String uuid;
	private String buyNo;
	private String buyMan;
	private Date buyDate;

	// Constructors

	/** default constructor */
	public MatAppbuyBuy() {
	}

	/** full constructor */
	public MatAppbuyBuy(String buyNo, String buyMan, Date buyDate) {
		this.buyNo = buyNo;
		this.buyMan = buyMan;
		this.buyDate = buyDate;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getBuyNo() {
		return this.buyNo;
	}

	public void setBuyNo(String buyNo) {
		this.buyNo = buyNo;
	}

	public String getBuyMan() {
		return this.buyMan;
	}

	public void setBuyMan(String buyMan) {
		this.buyMan = buyMan;
	}

	public Date getBuyDate() {
		return this.buyDate;
	}

	public void setBuyDate(Date buyDate) {
		this.buyDate = buyDate;
	}

}