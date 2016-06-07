package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * KqDaysDeptZbLog entity. @author MyEclipse Persistence Tools
 */

public class KqDaysDeptZbLog implements java.io.Serializable {

	// Fields

	private String uuid;
	private String fromUser;
	private String toUser;
	private String kqLsh;
	private Date postTime;
	private String status;
	private String remark;

	// Constructors

	/** default constructor */
	public KqDaysDeptZbLog() {
	}

	/** minimal constructor */
	public KqDaysDeptZbLog(String remark) {
		this.remark = remark;
	}

	/** full constructor */
	public KqDaysDeptZbLog(String fromUser, String toUser, String kqLsh,
			Date postTime, String status, String remark) {
		this.fromUser = fromUser;
		this.toUser = toUser;
		this.kqLsh = kqLsh;
		this.postTime = postTime;
		this.status = status;
		this.remark = remark;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getFromUser() {
		return this.fromUser;
	}

	public void setFromUser(String fromUser) {
		this.fromUser = fromUser;
	}

	public String getToUser() {
		return this.toUser;
	}

	public void setToUser(String toUser) {
		this.toUser = toUser;
	}

	public String getKqLsh() {
		return this.kqLsh;
	}

	public void setKqLsh(String kqLsh) {
		this.kqLsh = kqLsh;
	}

	public Date getPostTime() {
		return this.postTime;
	}

	public void setPostTime(Date postTime) {
		this.postTime = postTime;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}