package com.sgepit.fileAndPublish.hbm;

import java.util.Date;

/**
 * ComFileSortTemplate entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ComFileSortTemplate implements java.io.Serializable {

	// Fields

	private String uids;
	private String fileSortId;
	private String templateName;
	private String templateBh;
	private String fileLsh;
	private String fileName;
	private String templateAuther;
	private Date templateCreatetime;
	private String isUse;
	private String memo;

	// Constructors

	/** default constructor */
	public ComFileSortTemplate() {
	}

	/** minimal constructor */
	public ComFileSortTemplate(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public ComFileSortTemplate(String uids, String fileSortId,
			String templateName, String templateBh, String fileLsh,
			String fileName, String templateAuther, Date templateCreatetime,
			String isUse, String memo) {
		this.uids = uids;
		this.fileSortId = fileSortId;
		this.templateName = templateName;
		this.templateBh = templateBh;
		this.fileLsh = fileLsh;
		this.fileName = fileName;
		this.templateAuther = templateAuther;
		this.templateCreatetime = templateCreatetime;
		this.isUse = isUse;
		this.memo = memo;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getFileSortId() {
		return this.fileSortId;
	}

	public void setFileSortId(String fileSortId) {
		this.fileSortId = fileSortId;
	}

	public String getTemplateName() {
		return this.templateName;
	}

	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}

	public String getTemplateBh() {
		return this.templateBh;
	}

	public void setTemplateBh(String templateBh) {
		this.templateBh = templateBh;
	}

	public String getFileLsh() {
		return this.fileLsh;
	}

	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}

	public String getFileName() {
		return this.fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getTemplateAuther() {
		return this.templateAuther;
	}

	public void setTemplateAuther(String templateAuther) {
		this.templateAuther = templateAuther;
	}

	public Date getTemplateCreatetime() {
		return this.templateCreatetime;
	}

	public void setTemplateCreatetime(Date templateCreatetime) {
		this.templateCreatetime = templateCreatetime;
	}

	public String getIsUse() {
		return this.isUse;
	}

	public void setIsUse(String isUse) {
		this.isUse = isUse;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}