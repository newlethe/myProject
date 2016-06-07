package com.sgepit.frame.util.sms.vo;

import java.util.Date;

/**
 * PopMsp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PopMsp implements java.io.Serializable {

	// Fields

	private String lsh;
	private Date sendTime;
	private String sendName;
	private String recieveName;
	private String sendNote;
	private Long msgState;
	private String recieveUser;
	private String moduleName;
	private Long memoN1;
	private Long memoN2;
	private String memoC1;
	private String memoC2;

	// Constructors

	/** default constructor */
	public PopMsp() {
	}

	/** minimal constructor */
	public PopMsp(String lsh) {
		this.lsh = lsh;
	}

	/** full constructor */
	public PopMsp(String lsh, Date sendTime, String sendName,
			String recieveName, String sendNote, Long msgState,
			String recieveUser, String moduleName, Long memoN1, Long memoN2,
			String memoC1, String memoC2) {
		this.lsh = lsh;
		this.sendTime = sendTime;
		this.sendName = sendName;
		this.recieveName = recieveName;
		this.sendNote = sendNote;
		this.msgState = msgState;
		this.recieveUser = recieveUser;
		this.moduleName = moduleName;
		this.memoN1 = memoN1;
		this.memoN2 = memoN2;
		this.memoC1 = memoC1;
		this.memoC2 = memoC2;
	}

	// Property accessors

	public String getLsh() {
		return this.lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
	}

	public Date getSendTime() {
		return sendTime;
	}

	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}

	public String getSendName() {
		return this.sendName;
	}

	public void setSendName(String sendName) {
		this.sendName = sendName;
	}

	public String getRecieveName() {
		return this.recieveName;
	}

	public void setRecieveName(String recieveName) {
		this.recieveName = recieveName;
	}

	public String getSendNote() {
		return this.sendNote;
	}

	public void setSendNote(String sendNote) {
		this.sendNote = sendNote;
	}

	public Long getMsgState() {
		return this.msgState;
	}

	public void setMsgState(Long msgState) {
		this.msgState = msgState;
	}

	public String getRecieveUser() {
		return this.recieveUser;
	}

	public void setRecieveUser(String recieveUser) {
		this.recieveUser = recieveUser;
	}

	public String getModuleName() {
		return this.moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public Long getMemoN1() {
		return this.memoN1;
	}

	public void setMemoN1(Long memoN1) {
		this.memoN1 = memoN1;
	}

	public Long getMemoN2() {
		return this.memoN2;
	}

	public void setMemoN2(Long memoN2) {
		this.memoN2 = memoN2;
	}

	public String getMemoC1() {
		return this.memoC1;
	}

	public void setMemoC1(String memoC1) {
		this.memoC1 = memoC1;
	}

	public String getMemoC2() {
		return this.memoC2;
	}

	public void setMemoC2(String memoC2) {
		this.memoC2 = memoC2;
	}

}