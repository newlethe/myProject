package com.sgepit.pcmis.aqgk.hbm;

import java.util.Date;

/**
 * PcAqgkFeedbackInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcAqgkFeedbackInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String feedbackType;
	private Date feedtime;
	private String feedperson;
	private String feedcontent;
	private String infoId;

	// Constructors

	/** default constructor */
	public PcAqgkFeedbackInfo() {
	}

	/** minimal constructor */
	public PcAqgkFeedbackInfo(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcAqgkFeedbackInfo(String pid, String feedbackType, Date feedtime,
			String feedperson, String feedcontent, String infoId) {
		this.pid = pid;
		this.feedbackType = feedbackType;
		this.feedtime = feedtime;
		this.feedperson = feedperson;
		this.feedcontent = feedcontent;
		this.infoId = infoId;
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

	public String getFeedbackType() {
		return this.feedbackType;
	}

	public void setFeedbackType(String feedbackType) {
		this.feedbackType = feedbackType;
	}

	public Date getFeedtime() {
		return this.feedtime;
	}

	public void setFeedtime(Date feedtime) {
		this.feedtime = feedtime;
	}

	public String getFeedperson() {
		return this.feedperson;
	}

	public void setFeedperson(String feedperson) {
		this.feedperson = feedperson;
	}

	public String getFeedcontent() {
		return this.feedcontent;
	}

	public void setFeedcontent(String feedcontent) {
		this.feedcontent = feedcontent;
	}

	public String getInfoId() {
		return this.infoId;
	}

	public void setInfoId(String infoId) {
		this.infoId = infoId;
	}

}