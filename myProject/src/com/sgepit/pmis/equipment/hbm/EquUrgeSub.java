package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquUrgeSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquUrgeSub implements java.io.Serializable {

	// Fields

	private String urgesubid;
	private String urgeid;
	private String pid;
	private Date urgedate;
	private String urgeNote;
	private String backNote;
	private String getCircs;

	// Constructors

	/** default constructor */
	public EquUrgeSub() {
	}

	/** minimal constructor */
	public EquUrgeSub(String urgeid, String pid) {
		this.urgeid = urgeid;
		this.pid = pid;
	}

	/** full constructor */
	public EquUrgeSub(String urgeid, String pid, Date urgedate,
			String urgeNote, String backNote, String getCircs) {
		this.urgeid = urgeid;
		this.pid = pid;
		this.urgedate = urgedate;
		this.urgeNote = urgeNote;
		this.backNote = backNote;
		this.getCircs = getCircs;
	}

	// Property accessors

	public String getUrgesubid() {
		return this.urgesubid;
	}

	public void setUrgesubid(String urgesubid) {
		this.urgesubid = urgesubid;
	}

	public String getUrgeid() {
		return this.urgeid;
	}

	public void setUrgeid(String urgeid) {
		this.urgeid = urgeid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Date getUrgedate() {
		return this.urgedate;
	}

	public void setUrgedate(Date urgedate) {
		this.urgedate = urgedate;
	}

	public String getUrgeNote() {
		return this.urgeNote;
	}

	public void setUrgeNote(String urgeNote) {
		this.urgeNote = urgeNote;
	}

	public String getBackNote() {
		return this.backNote;
	}

	public void setBackNote(String backNote) {
		this.backNote = backNote;
	}

	public String getGetCircs() {
		return this.getCircs;
	}

	public void setGetCircs(String getCircs) {
		this.getCircs = getCircs;
	}

}