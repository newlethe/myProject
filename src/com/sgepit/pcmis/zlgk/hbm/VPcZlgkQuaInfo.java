package com.sgepit.pcmis.zlgk.hbm;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * PcZlgkQuaInfo entity. @author MyEclipse Persistence Tools
 */

public class VPcZlgkQuaInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String projectId;
	private Date createdate;
	private String createperson;
	private String sjType;
	private String reportname;
	private Double reportStatus;
	private String memo;
	private String unitTypeId;
	private String unitname;
	private String unitUsername;
	private String countUsername;
	private String reportPerson;
	private String reportPersonTel;

	// Constructors

	/** default constructor */
	public VPcZlgkQuaInfo() {
	}

	/** minimal constructor */
	public VPcZlgkQuaInfo(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public VPcZlgkQuaInfo(String pid, String projectId, Date createdate,
			String createperson, String sjType, String reportname,
			Double reportStatus, String memo, String unitUsername,String countUsername,
			String reportPerson,String reportPersonTel) {
		this.pid = pid;
		this.projectId = projectId;
		this.createdate = createdate;
		this.createperson = createperson;
		this.sjType = sjType;
		this.reportname = reportname;
		this.reportStatus = reportStatus;
		this.memo = memo;
		this.unitUsername=unitUsername;
		this.countUsername=countUsername;
		this.reportPerson=reportPerson;
		this.reportPersonTel=reportPersonTel;
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

	public String getProjectId() {
		return this.projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public Date getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}

	public String getCreateperson() {
		return this.createperson;
	}

	public void setCreateperson(String createperson) {
		this.createperson = createperson;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getReportname() {
		return this.reportname;
	}

	public void setReportname(String reportname) {
		this.reportname = reportname;
	}

	public Double getReportStatus() {
		return this.reportStatus;
	}

	public void setReportStatus(Double reportStatus) {
		this.reportStatus = reportStatus;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getUnitTypeId() {
		return unitTypeId;
	}

	public void setUnitTypeId(String unitTypeId) {
		this.unitTypeId = unitTypeId;
	}

	public String getUnitname() {
		return unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getUnitUsername() {
		return unitUsername;
	}

	public void setUnitUsername(String unitUsername) {
		this.unitUsername = unitUsername;
	}

	public String getCountUsername() {
		return countUsername;
	}

	public void setCountUsername(String countUsername) {
		this.countUsername = countUsername;
	}

	public String getReportPerson() {
		return reportPerson;
	}

	public void setReportPerson(String reportPerson) {
		this.reportPerson = reportPerson;
	}

	public String getReportPersonTel() {
		return reportPersonTel;
	}

	public void setReportPersonTel(String reportPersonTel) {
		this.reportPersonTel = reportPersonTel;
	}
	
	
}