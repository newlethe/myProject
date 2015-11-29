package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompFixedAssetWzoutNum entity. @author MyEclipse Persistence Tools
 */

public class FacompFixedAssetSbbodysNum implements java.io.Serializable {

	// Fields

	private String uids;
	private String fixeduids;
	private String outuids;
	private String conid;
	private Double money;
	private String bdgidtype;

	// Constructors

	/** default constructor */
	public FacompFixedAssetSbbodysNum() {
	}

	/** full constructor */
	public FacompFixedAssetSbbodysNum(String fixeduids, String outuids,
			String conid, Double money, String bdgidtype) {
		this.fixeduids = fixeduids;
		this.outuids = outuids;
		this.conid = conid;
		this.money = money;
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


	public Double getMoney() {
		return this.money;
	}

	public void setMoney(Double money) {
		this.money = money;
	}

	public String getBdgidtype() {
		return bdgidtype;
	}

	public void setBdgidtype(String bdgidtype) {
		this.bdgidtype = bdgidtype;
	}

}