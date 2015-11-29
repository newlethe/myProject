package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquSupervisionReport entity. @author MyEclipse Persistence Tools
 */

public class EquSupervisionReport implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private Date createdate;
	private String createperson;
	private String type;
	private String reportname;
	private String reportunit;
	private String memo;
	private String reportStat;

	// Constructors

	/** default constructor */
	public EquSupervisionReport() {
	}

	/** minimal constructor */
	public EquSupervisionReport(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public EquSupervisionReport(String pid, Date createdate,
			String createperson, String type, String reportname,
			String reportunit, String memo, String reportStat) {
		this.pid = pid;
		this.createdate = createdate;
		this.createperson = createperson;
		this.type = type;
		this.reportname = reportname;
		this.reportunit = reportunit;
		this.memo = memo;
		this.reportStat = reportStat;
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

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getReportname() {
		return this.reportname;
	}

	public void setReportname(String reportname) {
		this.reportname = reportname;
	}

	public String getReportunit() {
		return this.reportunit;
	}

	public void setReportunit(String reportunit) {
		this.reportunit = reportunit;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getReportStat() {
		return this.reportStat;
	}

	public void setReportStat(String reportStat) {
		this.reportStat = reportStat;
	}

}