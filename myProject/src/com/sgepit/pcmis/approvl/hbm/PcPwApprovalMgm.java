package com.sgepit.pcmis.approvl.hbm;

import java.util.Date;

/**
 * PcPwApprovalMgm entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcPwApprovalMgm implements java.io.Serializable {

	// Fields

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String uids;
	private String pid;
	private String sortUids;
	private String pwNo;
	private String pwName;
	private String pwFileId;
	private String pwFileName;
	private String fileId;
	private String mgmStatus;
	private Double rateStatus;
	private String dealStatus;
	private String mgmUser;
	private Date planStartDate;
	private Date planEndDate;
	private Date realStartDate;
	private Date realEndDate;
	private String nodepath;
	private String pwFileOverview;
	private Date inputDate;

	// Constructors

	/** default constructor */
	public PcPwApprovalMgm() {
	}

	/** minimal constructor */
	public PcPwApprovalMgm(String uids, String pid, String sortUids) {
		this.uids = uids;
		this.pid = pid;
		this.sortUids = sortUids;
	}

	/** full constructor */
	public PcPwApprovalMgm(String uids, String pid, String sortUids,
			String pwNo, String pwName, String pwFileId, String pwFileName,
			String fileId, String mgmStatus, Double rateStatus,
			String dealStatus, String mgmUser, Date planStartDate,
			Date planEndDate, Date realStartDate, Date realEndDate, 
			String pwFileOverview,Date inputDate) {
		this.uids = uids;
		this.pid = pid;
		this.sortUids = sortUids;
		this.pwNo = pwNo;
		this.pwName = pwName;
		this.pwFileId = pwFileId;
		this.pwFileName = pwFileName;
		this.fileId = fileId;
		this.mgmStatus = mgmStatus;
		this.rateStatus = rateStatus;
		this.dealStatus = dealStatus;
		this.mgmUser = mgmUser;
		this.planStartDate = planStartDate;
		this.planEndDate = planEndDate;
		this.realStartDate = realStartDate;
		this.realEndDate = realEndDate;
		this.pwFileOverview = pwFileOverview;
		this.inputDate = inputDate;
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

	public String getSortUids() {
		return this.sortUids;
	}

	public void setSortUids(String sortUids) {
		this.sortUids = sortUids;
	}

	public String getPwNo() {
		return this.pwNo;
	}

	public void setPwNo(String pwNo) {
		this.pwNo = pwNo;
	}

	public String getPwName() {
		return this.pwName;
	}

	public void setPwName(String pwName) {
		this.pwName = pwName;
	}

	public String getPwFileId() {
		return this.pwFileId;
	}

	public void setPwFileId(String pwFileId) {
		this.pwFileId = pwFileId;
	}

	public String getPwFileName() {
		return this.pwFileName;
	}

	public void setPwFileName(String pwFileName) {
		this.pwFileName = pwFileName;
	}

	public String getFileId() {
		return this.fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	public String getMgmStatus() {
		return this.mgmStatus;
	}

	public void setMgmStatus(String mgmStatus) {
		this.mgmStatus = mgmStatus;
	}

	public Double getRateStatus() {
		return this.rateStatus;
	}

	public void setRateStatus(Double rateStatus) {
		this.rateStatus = rateStatus;
	}

	public String getDealStatus() {
		return this.dealStatus;
	}

	public void setDealStatus(String dealStatus) {
		this.dealStatus = dealStatus;
	}

	public String getMgmUser() {
		return this.mgmUser;
	}

	public void setMgmUser(String mgmUser) {
		this.mgmUser = mgmUser;
	}

	public Date getPlanStartDate() {
		return this.planStartDate;
	}

	public void setPlanStartDate(Date planStartDate) {
		this.planStartDate = planStartDate;
	}

	public Date getPlanEndDate() {
		return this.planEndDate;
	}

	public void setPlanEndDate(Date planEndDate) {
		this.planEndDate = planEndDate;
	}

	public Date getRealStartDate() {
		return this.realStartDate;
	}

	public void setRealStartDate(Date realStartDate) {
		this.realStartDate = realStartDate;
	}

	public Date getRealEndDate() {
		return this.realEndDate;
	}

	public void setRealEndDate(Date realEndDate) {
		this.realEndDate = realEndDate;
	}

	public String getNodepath() {
		return nodepath;
	}

	public void setNodepath(String nodepath) {
		this.nodepath = nodepath;
	}

	public String getPwFileOverview() {
		return pwFileOverview;
	}

	public void setPwFileOverview(String pwFileOverview) {
		this.pwFileOverview = pwFileOverview;
	}

	public Date getInputDate() {
		return inputDate;
	}

	public void setInputDate(Date inputDate) {
		this.inputDate = inputDate;
	}

}