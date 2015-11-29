package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * OtherCompletion entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class OtherCompletion implements java.io.Serializable {

	// Fields

	private String uuid;
	private Date comDate;

	// Constructors

	/** default constructor */
	public OtherCompletion() {
	}

	/** full constructor */
	public OtherCompletion(Date comDate) {
		this.comDate = comDate;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Date getComDate() {
		return this.comDate;
	}

	public void setComDate(Date comDate) {
		this.comDate = comDate;
	}

}