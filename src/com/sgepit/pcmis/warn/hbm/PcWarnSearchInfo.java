package com.sgepit.pcmis.warn.hbm;

import java.util.Date;

/**
 * PcWarnSearchInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcWarnSearchInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String warninfoid;
	private Date searchtime;
	private String comments;
	private String searchperson;
	private String searchunits;
	private Date sendtime;
	private String sendperson;
	private String searchtype;

	// Constructors

	/** default constructor */
	public PcWarnSearchInfo() {
	}

	/** minimal constructor */
	public PcWarnSearchInfo(String pid, String warninfoid) {
		this.pid = pid;
		this.warninfoid = warninfoid;
	}

	/** full constructor */
	public PcWarnSearchInfo(String pid, String warninfoid, Date searchtime,
			String comments, String searchperson, String searchunits,
			Date sendtime, String sendperson, String searchtype) {
		this.pid = pid;
		this.warninfoid = warninfoid;
		this.searchtime = searchtime;
		this.comments = comments;
		this.searchperson = searchperson;
		this.searchunits = searchunits;
		this.sendtime = sendtime;
		this.sendperson = sendperson;
		this.searchtype = searchtype;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getWarninfoid() {
		return this.warninfoid;
	}

	public void setWarninfoid(String warninfoid) {
		this.warninfoid = warninfoid;
	}

	public Date getSearchtime() {
		return this.searchtime;
	}

	public void setSearchtime(Date searchtime) {
		this.searchtime = searchtime;
	}

	public String getComments() {
		return this.comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getSearchperson() {
		return this.searchperson;
	}

	public void setSearchperson(String searchperson) {
		this.searchperson = searchperson;
	}

	public String getSearchunits() {
		return this.searchunits;
	}

	public void setSearchunits(String searchunits) {
		this.searchunits = searchunits;
	}

	public Date getSendtime() {
		return this.sendtime;
	}

	public void setSendtime(Date sendtime) {
		this.sendtime = sendtime;
	}

	public String getSendperson() {
		return this.sendperson;
	}

	public void setSendperson(String sendperson) {
		this.sendperson = sendperson;
	}

	public String getSearchtype() {
		return this.searchtype;
	}

	public void setSearchtype(String searchtype) {
		this.searchtype = searchtype;
	}

}