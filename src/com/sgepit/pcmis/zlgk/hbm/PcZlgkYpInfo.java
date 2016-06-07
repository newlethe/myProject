package com.sgepit.pcmis.zlgk.hbm;

import java.util.Date;

/**
 * PcZlgkYpInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcZlgkYpInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String projectId;
	private Date createdate;
	private String createperson;
	private String yeardate;
	private String reportname;
	private Long reportStat;
	private String memo;

	// Constructors

	/** default constructor */
	public PcZlgkYpInfo() {
	}

	/** minimal constructor */
	public PcZlgkYpInfo(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public PcZlgkYpInfo(String uids, String pid, String projectId,
			Date createdate, String createperson, String yeardate,
			String reportname, Long reportStat, String memo) {
		this.uids = uids;
		this.pid = pid;
		this.projectId = projectId;
		this.createdate = createdate;
		this.createperson = createperson;
		this.yeardate = yeardate;
		this.reportname = reportname;
		this.reportStat = reportStat;
		this.memo = memo;
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

	public String getYeardate() {
		return this.yeardate;
	}

	public void setYeardate(String yeardate) {
		this.yeardate = yeardate;
	}

	public String getReportname() {
		return this.reportname;
	}

	public void setReportname(String reportname) {
		this.reportname = reportname;
	}

	public Long getReportStat() {
		return this.reportStat;
	}

	public void setReportStat(Long reportStat) {
		this.reportStat = reportStat;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}