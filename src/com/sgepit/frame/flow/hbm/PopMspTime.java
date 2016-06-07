package com.sgepit.frame.flow.hbm;

/**
 * 短信发送时间信息表
 * @author pengy 2013-10-23
 */

public class PopMspTime implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String schemName;
	private String beginTime;
	private String endTime;
	private String schemTime;
	private String isWeekendSend;
	private String isUsing;
	private String isOpen;
	private String timeout;

	// Constructors

	/** default constructor */
	public PopMspTime() {
	}

	/** full constructor */
	public PopMspTime(String pid, String schemName, String beginTime,
			String endTime, String schemTime, String isWeekendSend,
			String isUsing, String isOpen, String timeout) {
		this.pid = pid;
		this.schemName = schemName;
		this.beginTime = beginTime;
		this.endTime = endTime;
		this.schemTime = schemTime;
		this.isWeekendSend = isWeekendSend;
		this.isUsing = isUsing;
		this.isOpen = isOpen;
		this.timeout = timeout;
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

	public String getSchemName() {
		return this.schemName;
	}

	public void setSchemName(String schemName) {
		this.schemName = schemName;
	}

	public String getBeginTime() {
		return this.beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String getSchemTime() {
		return this.schemTime;
	}

	public void setSchemTime(String schemTime) {
		this.schemTime = schemTime;
	}

	public String getIsWeekendSend() {
		return this.isWeekendSend;
	}

	public void setIsWeekendSend(String isWeekendSend) {
		this.isWeekendSend = isWeekendSend;
	}

	public String getIsUsing() {
		return this.isUsing;
	}

	public void setIsUsing(String isUsing) {
		this.isUsing = isUsing;
	}

	public String getIsOpen() {
		return this.isOpen;
	}

	public void setIsOpen(String isOpen) {
		this.isOpen = isOpen;
	}

	public String getTimeout() {
		return this.timeout;
	}

	public void setTimeout(String timeout) {
		this.timeout = timeout;
	}

}