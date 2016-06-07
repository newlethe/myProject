package com.sgepit.pcmis.aqgk.hbm;

import java.util.Date;

/**
 * PcAqgkAccidenrInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcAqgkAccidenrInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String accidentunit;
	private String accidentType;
	private Date accidenttime;
	private String accidentaddr;
	private String parties;
	private String accidentno;
	private String accidentreason;
	private String measure;
	private String recunit;
	private String dutyperson;
	private Long reportStatus;

	// Constructors

	/** default constructor */
	public PcAqgkAccidenrInfo() {
	}

	/** minimal constructor */
	public PcAqgkAccidenrInfo(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcAqgkAccidenrInfo(String pid, String accidentunit,
			String accidentType, Date accidenttime, String accidentaddr,
			String parties, String accidentno, String accidentreason,
			String measure, String recunit, String dutyperson, Long reportStatus) {
		this.pid = pid;
		this.accidentunit = accidentunit;
		this.accidentType = accidentType;
		this.accidenttime = accidenttime;
		this.accidentaddr = accidentaddr;
		this.parties = parties;
		this.accidentno = accidentno;
		this.accidentreason = accidentreason;
		this.measure = measure;
		this.recunit = recunit;
		this.dutyperson = dutyperson;
		this.reportStatus = reportStatus;
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

	public String getAccidentunit() {
		return this.accidentunit;
	}

	public void setAccidentunit(String accidentunit) {
		this.accidentunit = accidentunit;
	}

	public String getAccidentType() {
		return this.accidentType;
	}

	public void setAccidentType(String accidentType) {
		this.accidentType = accidentType;
	}

	public Date getAccidenttime() {
		return this.accidenttime;
	}

	public void setAccidenttime(Date accidenttime) {
		this.accidenttime = accidenttime;
	}

	public String getAccidentaddr() {
		return this.accidentaddr;
	}

	public void setAccidentaddr(String accidentaddr) {
		this.accidentaddr = accidentaddr;
	}

	public String getParties() {
		return this.parties;
	}

	public void setParties(String parties) {
		this.parties = parties;
	}

	public String getAccidentno() {
		return this.accidentno;
	}

	public void setAccidentno(String accidentno) {
		this.accidentno = accidentno;
	}

	public String getAccidentreason() {
		return this.accidentreason;
	}

	public void setAccidentreason(String accidentreason) {
		this.accidentreason = accidentreason;
	}

	public String getMeasure() {
		return this.measure;
	}

	public void setMeasure(String measure) {
		this.measure = measure;
	}

	public String getRecunit() {
		return this.recunit;
	}

	public void setRecunit(String recunit) {
		this.recunit = recunit;
	}

	public String getDutyperson() {
		return this.dutyperson;
	}

	public void setDutyperson(String dutyperson) {
		this.dutyperson = dutyperson;
	}

	public Long getReportStatus() {
		return this.reportStatus;
	}

	public void setReportStatus(Long reportStatus) {
		this.reportStatus = reportStatus;
	}

}