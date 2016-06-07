package com.sgepit.frame.sysman.hbm;

import java.util.Date;

/**
 * AppBlobinfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class AppFileinfo implements java.io.Serializable {

	// Fields

	private String fileid;
	private String filename;
	private String filesource;
	private String mimetype;
	private String compressed;
	private Date filedate;
	private Long filesize;
	private String businessid;

	// Constructors

	/** default constructor */
	public AppFileinfo() {
	}

	/** minimal constructor */
	public AppFileinfo(String compressed) {
		this.compressed = compressed;
	}

	/** full constructor */
	public AppFileinfo(String blobname, String filesource, String mimetype,
			String compressed, Date filedate, Long filesize,String businessid) {
		this.filename = blobname;
		this.filesource = filesource;
		this.mimetype = mimetype;
		this.compressed = compressed;
		this.filedate = filedate;
		this.filesize = filesize;
		this.businessid = businessid;
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

	public String getFilesource() {
		return this.filesource;
	}

	public void setFilesource(String filesource) {
		this.filesource = filesource;
	}

	public String getMimetype() {
		return this.mimetype;
	}

	public void setMimetype(String mimetype) {
		this.mimetype = mimetype;
	}

	public String getCompressed() {
		return this.compressed;
	}

	public void setCompressed(String compressed) {
		this.compressed = compressed;
	}

	public Date getFiledate() {
		return this.filedate;
	}

	public void setFiledate(Date filedate) {
		this.filedate = filedate;
	}

	public Long getFilesize() {
		return this.filesize;
	}

	public void setFilesize(Long filesize) {
		this.filesize = filesize;
	}

	public String getBusinessid() {
		return businessid;
	}

	public void setBusinessid(String businessid) {
		this.businessid = businessid;
	}

}