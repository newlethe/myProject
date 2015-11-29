package com.sgepit.frame.sysman.hbm;

import java.util.Date;

/**
 * AppTemplate entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class AppTemplate implements java.io.Serializable {

	// Fields
	private String templateid;
	private String fileid;
	private String filename;
	private String powerpk;
	private String author;
	private Date lastmodify;
	private String doctype;
	private String templatecode;
	private Date datecreated;
	// Constructors

	/** default constructor */
	public AppTemplate() {
	}

	/** minimal constructor */
	public AppTemplate(String templateCode) {
		this.templatecode = templateCode;
	}

	/** full constructor */
	public AppTemplate(String fileid, String filename, String powerpk, String author,
			Date lastmodify, Date datecreated, String doctype, String templateCode) {
		this.fileid = fileid;
		this.filename = filename;
		this.powerpk = powerpk;
		this.author = author;
		this.lastmodify = lastmodify;
		this.datecreated = datecreated;
		this.doctype = doctype;
		this.templatecode = templateCode;
	}

	// Property accessors

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

	public String getPowerpk() {
		return this.powerpk;
	}

	public void setPowerpk(String powerpk) {
		this.powerpk = powerpk;
	}

	public String getAuthor() {
		return this.author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public Date getLastmodify() {
		return this.lastmodify;
	}

	public void setLastmodify(Date lastmodify) {
		this.lastmodify = lastmodify;
	}

	public String getDoctype() {
		return this.doctype;
	}

	public void setDoctype(String doctype) {
		this.doctype = doctype;
	}

	public String getTemplatecode() {
		return templatecode;
	}

	public void setTemplatecode(String templatecode) {
		this.templatecode = templatecode;
	}

	public Date getDatecreated() {
		return datecreated;
	}

	public void setDatecreated(Date datecreated) {
		this.datecreated = datecreated;
	}

	public String getTemplateid() {
		return templateid;
	}

	public void setTemplateid(String templateid) {
		this.templateid = templateid;
	}

}