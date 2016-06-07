package com.sgepit.fileAndPublish.hbm;

import java.util.Date;

/**
 * ComFilePublishHistory entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ComFilePublishHistory implements java.io.Serializable {

	// Fields

	private String uids;
	private String fileId;
	private String publishType;
	private String receiver;
	private String publishUser;
	private String publishDept;
	private Date publishTime;
	
	//文件相关信息
	private String fileLsh;
	private String fileBh;
	private String fileTile;
	private String fileContent;
	private String fileSortName;
	private String fileAutherName;
	private String fileDeptName;
	private String billStateName;
	private String publisStateName;
	private Date fileCreatetime;
	private String publishUserName;
	private String publishTypeStr;
	//2012-4-12新增，发布人所属单位
	private String fileUnitName;

	// Constructors

	public String getFileUnitName() {
		return fileUnitName;
	}

	public void setFileUnitName(String fileUnitName) {
		this.fileUnitName = fileUnitName;
	}

	/** default constructor */
	public ComFilePublishHistory() {
	}

	/** minimal constructor */
	public ComFilePublishHistory(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public ComFilePublishHistory(String uids, String fileId,
			String publishType, String receiver, String publishUser,
			String publishDept, Date publishTime) {
		this.uids = uids;
		this.fileId = fileId;
		this.publishType = publishType;
		this.receiver = receiver;
		this.publishUser = publishUser;
		this.publishDept = publishDept;
		this.publishTime = publishTime;
		
		
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

	public String getPublishType() {
		return this.publishType;
	}
	public String getPublishTypeStr() {
		return this.publishTypeStr;
	}
	public void setPublishType(String publishType) {
		this.publishType = publishType;
		this.publishTypeStr = publishType.equals("group")?"发布到本部门的文件":"发布给我的文件";
	}

	public String getReceiver() {
		return this.receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public String getPublishUser() {
		return this.publishUser;
	}

	public void setPublishUser(String publishUser) {
		this.publishUser = publishUser;
	}

	public String getPublishDept() {
		return this.publishDept;
	}

	public void setPublishDept(String publishDept) {
		this.publishDept = publishDept;
	}

	public Date getPublishTime() {
		return this.publishTime;
	}

	public void setPublishTime(Date publishTime) {
		this.publishTime = publishTime;
	}

	public String getFileBh() {
		return fileBh;
	}

	public void setFileBh(String fileBh) {
		this.fileBh = fileBh;
	}

	public String getFileTile() {
		return fileTile;
	}

	public void setFileTile(String fileTile) {
		this.fileTile = fileTile;
	}

	public String getFileContent() {
		return fileContent;
	}

	public void setFileContent(String fileContent) {
		this.fileContent = fileContent;
	}

	public String getFileSortName() {
		return fileSortName;
	}

	public void setFileSortName(String fileSortName) {
		this.fileSortName = fileSortName;
	}

	public String getFileAutherName() {
		return fileAutherName;
	}

	public void setFileAutherName(String fileAutherName) {
		this.fileAutherName = fileAutherName;
	}

	public String getFileDeptName() {
		return fileDeptName;
	}

	public void setFileDeptName(String fileDeptName) {
		this.fileDeptName = fileDeptName;
	}

	public String getBillStateName() {
		return billStateName;
	}

	public void setBillStateName(String billStateName) {
		this.billStateName = billStateName;
	}

	public String getPublisStateName() {
		return publisStateName;
	}

	public void setPublisStateName(String publisStateName) {
		this.publisStateName = publisStateName;
	}

	public Date getFileCreatetime() {
		return fileCreatetime;
	}

	public void setFileCreatetime(Date fileCreatetime) {
		this.fileCreatetime = fileCreatetime;
	}

	public String getPublishUserName() {
		return publishUserName;
	}

	public void setPublishUserName(String publishUserName) {
		this.publishUserName = publishUserName;
	}


	public String getFileLsh() {
		return fileLsh;
	}

	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}

}