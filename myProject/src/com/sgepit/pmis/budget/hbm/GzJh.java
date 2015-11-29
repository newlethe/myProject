package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * GzJh entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GzJh implements java.io.Serializable {

	// Fields

	private String uids;
	private String content;
	private Date month;
	private String gzhbr;
	private String shr;
	private String unitid;

	// Constructors

	/** default constructor */
	public GzJh() {
	}

	/** minimal constructor */
	public GzJh(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public GzJh(String uids, String content, String unitid, Date month, String gzhbr, String shr) {
		this.uids = uids;
		this.content = content;
		this.month = month;
		this.gzhbr = gzhbr;
		this.shr = shr;
		this.unitid = unitid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}


	public Date getMonth() {
		return this.month;
	}

	public void setMonth(Date month) {
		this.month = month;
	}

	public String getGzhbr() {
		return this.gzhbr;
	}

	public void setGzhbr(String gzhbr) {
		this.gzhbr = gzhbr;
	}

	public String getShr() {
		return this.shr;
	}

	public void setShr(String shr) {
		this.shr = shr;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getUnitid() {
		return unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

}