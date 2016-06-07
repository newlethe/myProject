package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquSbdhZl entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquSbdhZl implements java.io.Serializable {

	// Fields

	private String uids;
	private String dhId;
	private String fileid;
	private String filename;
	private Date dateup;
	private Date dateremove;
	private String isremove;
	
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public EquSbdhZl() {
	}

	/** minimal constructor */
	public EquSbdhZl(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public EquSbdhZl(String uids, String dhId, String fileid, String filename,
			Date dateup, Date dateremove, String isremove) {
		this.uids = uids;
		this.dhId = dhId;
		this.fileid = fileid;
		this.filename = filename;
		this.dateup = dateup;
		this.dateremove = dateremove;
		this.isremove = isremove;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getDhId() {
		return this.dhId;
	}

	public void setDhId(String dhId) {
		this.dhId = dhId;
	}

	public String getFileid() {
		return this.fileid;
	}

	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

	public String getFilename() {
		return this.filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public Date getDateup() {
		return this.dateup;
	}

	public void setDateup(Date dateup) {
		this.dateup = dateup;
	}

	public Date getDateremove() {
		return this.dateremove;
	}

	public void setDateremove(Date dateremove) {
		this.dateremove = dateremove;
	}

	public String getIsremove() {
		return this.isremove;
	}

	public void setIsremove(String isremove) {
		this.isremove = isremove;
	}

}