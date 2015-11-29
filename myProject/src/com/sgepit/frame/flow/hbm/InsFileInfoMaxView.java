package com.sgepit.frame.flow.hbm;

import java.util.Date;

/**
 * InsFileInfoMaxView entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class InsFileInfoMaxView implements java.io.Serializable {

	// Fields
	private Date filedate;
	private String insid;
	private String filename;

	// Constructors

	/** default constructor */
	public InsFileInfoMaxView() {
	}


	// Property accessors

	public InsFileInfoMaxView (Date filedate, String insid, String filename) {
		this.filedate = filedate;
		this.insid = insid;
		this.filename = filename;
	}


	public Date getFiledate() {
		return filedate;
	}


	public void setFiledate(Date filedate) {
		this.filedate = filedate;
	}


	public String getInsid() {
		return insid;
	}


	public void setInsid(String insid) {
		this.insid = insid;
	}


	public String getFilename() {
		return filename;
	}


	public void setFilename(String filename) {
		this.filename = filename;
	}


}