package com.sgepit.pmis.finalAccounts.complete.hbm;


/**
 * FacompOtherAssetConView entity. @author MyEclipse Persistence Tools
 */

public class FacompOtherAssetConView implements java.io.Serializable {

	// Fields

	private String conid;
	private String pid;
	private String conno;
	private String conname;
	private String parentid;
	private Long isleaf;

	// Constructors

	/** default constructor */
	public FacompOtherAssetConView() {
	}

	/** full constructor */
	public FacompOtherAssetConView(String pid, String conno, String conname,
			String parentid, Long isleaf) {
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.parentid = parentid;
		this.isleaf = isleaf;
	}

	// Property accessors

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConno() {
		return this.conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return this.conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

}