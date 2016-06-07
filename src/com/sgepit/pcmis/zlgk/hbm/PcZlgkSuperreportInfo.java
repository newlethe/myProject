package com.sgepit.pcmis.zlgk.hbm;

import java.util.Date;

/**
 * PcZlgkSuperreportInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcZlgkSuperreportInfo implements java.io.Serializable {

	// Fields

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String uids;
	private String pid;
	private Date createdate;
	private String createperson;
	private Long type;
	private String reportname;
	private String memo;
	private Long reportStat;
	private String projectId;
	private String supercompa;

	// Constructors

	/** default constructor */
	public PcZlgkSuperreportInfo() {
	}

	/** minimal constructor */
	public PcZlgkSuperreportInfo(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public PcZlgkSuperreportInfo(String uids, String pid, Date createdate,
			String createperson, Long type, String reportname, String memo,
			Long reportStat, String projectId, String supercompa) {
		this.uids = uids;
		this.pid = pid;
		this.createdate = createdate;
		this.createperson = createperson;
		this.type = type;
		this.reportname = reportname;
		this.memo = memo;
		this.reportStat = reportStat;
		this.projectId = projectId;
		this.supercompa = supercompa;
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

	public Long getType() {
		return this.type;
	}

	public void setType(Long type) {
		this.type = type;
	}

	public String getReportname() {
		return this.reportname;
	}

	public void setReportname(String reportname) {
		this.reportname = reportname;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Long getReportStat() {
		return this.reportStat;
	}

	public void setReportStat(Long reportStat) {
		this.reportStat = reportStat;
	}

	public String getProjectId() {
		return this.projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getSupercompa() {
		return this.supercompa;
	}

	public void setSupercompa(String supercompa) {
		this.supercompa = supercompa;
	}

}