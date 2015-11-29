package com.sgepit.fileAndPublish.hbm;

import java.util.Date;

/**
 * ComFileInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ComFileInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String fileId;
	private String fileSortId;
	private String fileTile;
	private String fileContent;
	private String fileAuther;
	private Date fileCreatetime;
	private Long billState;
	private Long statePublish;
	private String fileLsh;
	private String fileName;
	private String fileDept;
	private String fileSuffix;
	private Integer reportStatus;	//上报状态
	
	

	//extend
	private String fileSortName;
	private String fileAutherName;
	private String fileDeptName;
	private String billStateName;
	private String publisStateName;
	private String fileCreatetimeStr;
	
	
	

	//文件移交状态
	private Boolean isTransfered;

	private String pid;
	
	//2012-4-12 新增文件所属单位
	private String fileUnitName;
	
	public String getFileUnitName() {
		return fileUnitName;
	}

	public void setFileUnitName(String fileUnitName) {
		this.fileUnitName = fileUnitName;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Boolean getIsTransfered() {
		return isTransfered;
	}

	public void setIsTransfered(Boolean isTransfered) {
		this.isTransfered = isTransfered;
	}

	/** default constructor */
	public ComFileInfo() {
	}

	/** minimal constructor */
	public ComFileInfo(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public ComFileInfo(String uids, String fileId, String fileSortId,
			String fileTile, String fileContent, String fileAuther,
			Date fileCreatetime, Long billState, Long statePublish,
			String fileLsh, String fileName, String fileDept,String fileSuffix) {
		this.uids = uids;
		this.fileId = fileId;
		this.fileSortId = fileSortId;
		this.fileTile = fileTile;
		this.fileContent = fileContent;
		this.fileAuther = fileAuther;
		this.fileCreatetime = fileCreatetime;
		this.billState = billState;
		this.statePublish = statePublish;
		this.fileLsh = fileLsh;
		this.fileName = fileName;
		this.fileDept = fileDept;
		this.fileSuffix = fileSuffix;
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

	public String getFileSortId() {
		return this.fileSortId;
	}

	public void setFileSortId(String fileSortId) {
		this.fileSortId = fileSortId;
		
	}

	public String getFileTile() {
		return this.fileTile;
	}

	public void setFileTile(String fileTile) {
		this.fileTile = fileTile;
	}

	public String getFileContent() {
		return this.fileContent;
	}

	public void setFileContent(String fileContent) {
		this.fileContent = fileContent;
	}

	public String getFileAuther() {
		return this.fileAuther;
	}

	public void setFileAuther(String fileAuther) {
		this.fileAuther = fileAuther;
	}

	public Date getFileCreatetime() {
		return this.fileCreatetime;
	}

	public void setFileCreatetime(Date fileCreatetime) {
		this.fileCreatetime = fileCreatetime;
	}

	public Long getBillState() {
		return this.billState;
	}

	public void setBillState(Long billState) {
		this.billState = billState;
	}

	public Long getStatePublish() {
		return this.statePublish;
	}

	public void setStatePublish(Long statePublish) {
		this.statePublish = statePublish;
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

	public String getFileDept() {
		return this.fileDept;
	}

	public void setFileDept(String fileDept) {
		this.fileDept = fileDept;
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

	public String getFileSuffix() {
		return fileSuffix;
	}

	public void setFileSuffix(String fileSuffix) {
		this.fileSuffix = fileSuffix;
	}

	public String getFileCreatetimeStr() {
		return fileCreatetimeStr;
	}

	public void setFileCreatetimeStr(String fileCreatetimeStr) {
		this.fileCreatetimeStr = fileCreatetimeStr;
	}
	
	public Integer getReportStatus() {
		return reportStatus;
	}

	public void setReportStatus(Integer reportStatus) {
		this.reportStatus = reportStatus;
	}

}