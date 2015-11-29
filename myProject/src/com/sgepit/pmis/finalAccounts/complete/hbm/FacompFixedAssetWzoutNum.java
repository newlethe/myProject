package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompFixedAssetWzoutNum entity. @author MyEclipse Persistence Tools
 */

public class FacompFixedAssetWzoutNum implements java.io.Serializable {

	// Fields

	private String uids;
	private String fixeduids;
	private String outuids;
	private String conid;
	private Double usenum;
	private Double usemoney;
	private String bdgidtype;

	// Constructors

	/** default constructor */
	public FacompFixedAssetWzoutNum() {
	}

	/** full constructor */
	public FacompFixedAssetWzoutNum(String fixeduids, String outuids,
			String conid, Double usenum, Double usemoney, String bdgidtype) {
		this.fixeduids = fixeduids;
		this.outuids = outuids;
		this.conid = conid;
		this.usenum = usenum;
		this.usemoney = usemoney;
		this.bdgidtype = bdgidtype;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getFixeduids() {
		return this.fixeduids;
	}

	public void setFixeduids(String fixeduids) {
		this.fixeduids = fixeduids;
	}

	public String getOutuids() {
		return this.outuids;
	}

	public void setOutuids(String outuids) {
		this.outuids = outuids;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getUsenum() {
		return this.usenum;
	}

	public void setUsenum(Double usenum) {
		this.usenum = usenum;
	}

	public Double getUsemoney() {
		return this.usemoney;
	}

	public void setUsemoney(Double usemoney) {
		this.usemoney = usemoney;
	}

	public String getBdgidtype() {
		return bdgidtype;
	}

	public void setBdgidtype(String bdgidtype) {
		this.bdgidtype = bdgidtype;
	}

}