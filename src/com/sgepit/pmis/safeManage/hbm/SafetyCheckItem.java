package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafetyCheckItem entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafetyCheckItem implements java.io.Serializable {

	// Fields

	private String uuid;
	private String itembh;
	private String itemname;
	private String checkresult;
	private Date checktime;
	private String responsibleuser;
	private String pid;

	// Constructors

	/** default constructor */
	public SafetyCheckItem() {
	}

	/** minimal constructor */
	public SafetyCheckItem(String itemname, String checkresult) {
		this.itemname = itemname;
		this.checkresult = checkresult;
	}

	/** full constructor */
	public SafetyCheckItem(String itembh, String itemname, String checkresult, Date checktime, String responsibleuser) {
		this.itembh = itembh;
		this.itemname = itemname;
		this.checkresult = checkresult;
		this.checktime = checktime;
		this.responsibleuser = responsibleuser;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getItembh() {
		return this.itembh;
	}

	public void setItembh(String itembh) {
		this.itembh = itembh;
	}

	public String getItemname() {
		return this.itemname;
	}

	public void setItemname(String itemname) {
		this.itemname = itemname;
	}

	public String getCheckresult() {
		return this.checkresult;
	}

	public void setCheckresult(String checkresult) {
		this.checkresult = checkresult;
	}

	public Date getChecktime() {
		return this.checktime;
	}

	public void setChecktime(Date checktime) {
		this.checktime = checktime;
	}

	public String getResponsibleuser() {
		return responsibleuser;
	}

	public void setResponsibleuser(String responsibleuser) {
		this.responsibleuser = responsibleuser;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}