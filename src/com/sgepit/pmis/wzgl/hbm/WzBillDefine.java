package com.sgepit.pmis.wzgl.hbm;

/**
 * WzBillDefine entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzBillDefine implements java.io.Serializable {

	// Fields

	private String uids;
	private String billName;
	private String billType;
	private String isvalid;

	// Constructors

	/** default constructor */
	public WzBillDefine() {
	}

	/** full constructor */
	public WzBillDefine(String billName, String billType, String isvalid) {
		this.billName = billName;
		this.billType = billType;
		this.isvalid = isvalid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getBillName() {
		return this.billName;
	}

	public void setBillName(String billName) {
		this.billName = billName;
	}

	public String getBillType() {
		return this.billType;
	}

	public void setBillType(String billType) {
		this.billType = billType;
	}

	public String getIsvalid() {
		return this.isvalid;
	}

	public void setIsvalid(String isvalid) {
		this.isvalid = isvalid;
	}

}