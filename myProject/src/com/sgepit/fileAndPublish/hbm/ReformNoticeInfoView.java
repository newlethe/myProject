package com.sgepit.fileAndPublish.hbm;

import java.math.BigDecimal;
import java.util.Date;

/**
 * ReformNoticeInfoView entity. @author MyEclipse Persistence Tools
 */

public class ReformNoticeInfoView implements java.io.Serializable {

	// Fields

	private String comfileUids;
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
	private String pid;
	private String reformUids;
	private Long isreform;
	private Date reformTime;
	private String reformOpinion;
	private String reportState;

	//extend
	private String fileSortName;
	private String fileAutherName;
	private String fileDeptName;
	private String billStateName;
	private String publisStateName;
	private String fileCreatetimeStr;
	//文件移交状态
	private Boolean isTransfered;
	//2012-4-12 新增文件所属单位
	private String fileUnitName;


	public ReformNoticeInfoView() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public ReformNoticeInfoView(String comfileUids, String fileId, String fileSortId,
			String fileTile, String fileContent, String fileAuther,
			Date fileCreatetime, Long billState, Long statePublish,
			String fileLsh, String fileName, String fileDept,
			String fileSuffix, Integer reportStatus, String pid,
			String reformUids, Long isreform, Date reformTime,
			String reformOpinion, String reportState, String fileSortName,
			String fileAutherName, String fileDeptName, String billStateName,
			String publisStateName, String fileCreatetimeStr,
			Boolean isTransfered, String fileUnitName) {
		super();
		this.comfileUids = comfileUids;
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
		this.reportStatus = reportStatus;
		this.pid = pid;
		this.reformUids = reformUids;
		this.isreform = isreform;
		this.reformTime = reformTime;
		this.reformOpinion = reformOpinion;
		this.reportState = reportState;
		this.fileSortName = fileSortName;
		this.fileAutherName = fileAutherName;
		this.fileDeptName = fileDeptName;
		this.billStateName = billStateName;
		this.publisStateName = publisStateName;
		this.fileCreatetimeStr = fileCreatetimeStr;
		this.isTransfered = isTransfered;
		this.fileUnitName = fileUnitName;
	}

	public String getComfileUids() {
		return comfileUids;
	}

	public void setComfileUids(String comfileUids) {
		this.comfileUids = comfileUids;
	}

	public String getFileId() {
		return fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	public String getFileSortId() {
		return fileSortId;
	}

	public void setFileSortId(String fileSortId) {
		this.fileSortId = fileSortId;
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

	public String getFileAuther() {
		return fileAuther;
	}

	public void setFileAuther(String fileAuther) {
		this.fileAuther = fileAuther;
	}

	public Date getFileCreatetime() {
		return fileCreatetime;
	}

	public void setFileCreatetime(Date fileCreatetime) {
		this.fileCreatetime = fileCreatetime;
	}

	public Long getBillState() {
		return billState;
	}

	public void setBillState(Long billState) {
		this.billState = billState;
	}

	public Long getStatePublish() {
		return statePublish;
	}

	public void setStatePublish(Long statePublish) {
		this.statePublish = statePublish;
	}

	public Integer getReportStatus() {
		return reportStatus;
	}

	public void setReportStatus(Integer reportStatus) {
		this.reportStatus = reportStatus;
	}

	public String getFileLsh() {
		return fileLsh;
	}

	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileDept() {
		return fileDept;
	}

	public void setFileDept(String fileDept) {
		this.fileDept = fileDept;
	}

	public String getFileSuffix() {
		return fileSuffix;
	}

	public void setFileSuffix(String fileSuffix) {
		this.fileSuffix = fileSuffix;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getReformUids() {
		return reformUids;
	}

	public void setReformUids(String reformUids) {
		this.reformUids = reformUids;
	}

	public Long getIsreform() {
		return isreform;
	}

	public void setIsreform(Long isreform) {
		this.isreform = isreform;
	}

	public Date getReformTime() {
		return reformTime;
	}

	public void setReformTime(Date reformTime) {
		this.reformTime = reformTime;
	}

	public String getReformOpinion() {
		return reformOpinion;
	}

	public void setReformOpinion(String reformOpinion) {
		this.reformOpinion = reformOpinion;
	}

	public String getReportState() {
		return reportState;
	}

	public void setReportState(String reportState) {
		this.reportState = reportState;
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

	public String getFileCreatetimeStr() {
		return fileCreatetimeStr;
	}

	public void setFileCreatetimeStr(String fileCreatetimeStr) {
		this.fileCreatetimeStr = fileCreatetimeStr;
	}

	public Boolean getIsTransfered() {
		return isTransfered;
	}

	public void setIsTransfered(Boolean isTransfered) {
		this.isTransfered = isTransfered;
	}

	public String getFileUnitName() {
		return fileUnitName;
	}

	public void setFileUnitName(String fileUnitName) {
		this.fileUnitName = fileUnitName;
	}

}