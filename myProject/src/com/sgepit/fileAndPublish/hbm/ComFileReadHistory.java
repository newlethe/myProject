package com.sgepit.fileAndPublish.hbm;

import java.util.Date;

/**
 * ComFileReadHistory entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ComFileReadHistory implements java.io.Serializable {

	// Fields

	private String uids;
	private String fileId;
	private String fileReader;
	private Date fileReadLasttime;

	// Constructors

	/** default constructor */
	public ComFileReadHistory() {
	}

	/** minimal constructor */
	public ComFileReadHistory(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public ComFileReadHistory(String uids, String fileId, String fileReader,
			Date fileReadLasttime) {
		this.uids = uids;
		this.fileId = fileId;
		this.fileReader = fileReader;
		this.fileReadLasttime = fileReadLasttime;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getFileId() {
		return this.fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	public String getFileReader() {
		return this.fileReader;
	}

	public void setFileReader(String fileReader) {
		this.fileReader = fileReader;
	}

	public Date getFileReadLasttime() {
		return this.fileReadLasttime;
	}

	public void setFileReadLasttime(Date fileReadLasttime) {
		this.fileReadLasttime = fileReadLasttime;
	}

}