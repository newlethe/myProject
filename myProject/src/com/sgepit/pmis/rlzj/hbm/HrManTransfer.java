package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrManTransfer entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManTransfer implements java.io.Serializable {

	// Fields

	private String transferid;
	private String userid;
	private Date transferdate;
	private String olddeptid;
	private String newdeptid;
	private String oldpro;
	private String newpro;
	private String newpost;
	private String oldpost;
	private String reason;
	private String handleruserid;
	private String demo;
	private String transfertype;
	private String pid;
	private String posttrasnstype;

	// Constructors

	/** default constructor */
	public HrManTransfer() {
	}

	/** minimal constructor */
	public HrManTransfer(String transfertype) {
		this.transfertype = transfertype;
	}

	/** full constructor */
	public HrManTransfer(String userid, Date transferdate, String olddeptid,
			String newdeptid, String oldpro, String newpro, String newpost,
			String oldpost, String reason, String handleruserid, String demo,
			String transfertype, String pid, String posttrasnstype) {
		this.userid = userid;
		this.transferdate = transferdate;
		this.olddeptid = olddeptid;
		this.newdeptid = newdeptid;
		this.oldpro = oldpro;
		this.newpro = newpro;
		this.newpost = newpost;
		this.oldpost = oldpost;
		this.reason = reason;
		this.handleruserid = handleruserid;
		this.demo = demo;
		this.transfertype = transfertype;
		this.pid = pid;
		this.posttrasnstype = posttrasnstype;
	}

	// Property accessors

	public String getTransferid() {
		return this.transferid;
	}

	public void setTransferid(String transferid) {
		this.transferid = transferid;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public Date getTransferdate() {
		return this.transferdate;
	}

	public void setTransferdate(Date transferdate) {
		this.transferdate = transferdate;
	}

	public String getOlddeptid() {
		return this.olddeptid;
	}

	public void setOlddeptid(String olddeptid) {
		this.olddeptid = olddeptid;
	}

	public String getNewdeptid() {
		return this.newdeptid;
	}

	public void setNewdeptid(String newdeptid) {
		this.newdeptid = newdeptid;
	}

	public String getOldpro() {
		return this.oldpro;
	}

	public void setOldpro(String oldpro) {
		this.oldpro = oldpro;
	}

	public String getNewpro() {
		return this.newpro;
	}

	public void setNewpro(String newpro) {
		this.newpro = newpro;
	}

	public String getNewpost() {
		return this.newpost;
	}

	public void setNewpost(String newpost) {
		this.newpost = newpost;
	}

	public String getOldpost() {
		return this.oldpost;
	}

	public void setOldpost(String oldpost) {
		this.oldpost = oldpost;
	}

	public String getReason() {
		return this.reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getHandleruserid() {
		return this.handleruserid;
	}

	public void setHandleruserid(String handleruserid) {
		this.handleruserid = handleruserid;
	}

	public String getDemo() {
		return this.demo;
	}

	public void setDemo(String demo) {
		this.demo = demo;
	}

	public String getTransfertype() {
		return this.transfertype;
	}

	public void setTransfertype(String transfertype) {
		this.transfertype = transfertype;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getPosttrasnstype() {
		return posttrasnstype;
	}

	public void setPosttrasnstype(String posttrasnstype) {
		this.posttrasnstype = posttrasnstype;
	}

}