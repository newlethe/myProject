package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompFixedAssetBdgNum entity. @author MyEclipse Persistence Tools
 */

public class FacompFixedAssetBdgNum implements java.io.Serializable {

	// Fields
	private static final long serialVersionUID = 1L;
	private String uids;
	private String fixeduids;
	private String proappid;
	private String conid;
	private Double gcl;
	private Double je;
	private String isper;
	private String bdgidtype;
	
	// Constructors

	/** default constructor */
	public FacompFixedAssetBdgNum() {
	}

	/** full constructor */
	public FacompFixedAssetBdgNum(String fixeduids, String proappid,
			String conid, Double gcl, Double je, String isper, String bdgidtype) {
		this.fixeduids = fixeduids;
		this.proappid = proappid;
		this.conid = conid;
		this.gcl = gcl;
		this.je = je;
		this.isper = isper;
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

	public String getProappid() {
		return this.proappid;
	}

	public void setProappid(String proappid) {
		this.proappid = proappid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getGcl() {
		return this.gcl;
	}

	public void setGcl(Double gcl) {
		this.gcl = gcl;
	}

	public Double getJe() {
		return this.je;
	}

	public void setJe(Double je) {
		this.je = je;
	}

	public String getIsper() {
		return isper;
	}

	public void setIsper(String isper) {
		this.isper = isper;
	}

	public String getBdgidtype() {
		return bdgidtype;
	}

	public void setBdgidtype(String bdgidtype) {
		this.bdgidtype = bdgidtype;
	}

}