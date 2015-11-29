package com.sgepit.pcmis.approvl.hbm;

import java.util.Date;

/**
 * PcPwApprovalAdvise entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcPwApprovalAdvise implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String mgmUids;
	private String username;
	private String adviseContent;
	private Date adviseDate;
	private String userid;
	private String userdep;

	// Constructors

	/** default constructor */
	public PcPwApprovalAdvise() {
	}

	/** minimal constructor */
	public PcPwApprovalAdvise(String uids, String pid, String mgmUids) {
		this.uids = uids;
		this.pid = pid;
		this.mgmUids = mgmUids;
	}

	/** full constructor */
	public PcPwApprovalAdvise(String uids, String pid, String mgmUids,
			String username, String adviseContent, Date adviseDate,
			String userid, String userdep) {
		this.uids = uids;
		this.pid = pid;
		this.mgmUids = mgmUids;
		this.username = username;
		this.adviseContent = adviseContent;
		this.adviseDate = adviseDate;
		this.userid = userid;
		this.userdep = userdep;
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

	public String getMgmUids() {
		return this.mgmUids;
	}

	public void setMgmUids(String mgmUids) {
		this.mgmUids = mgmUids;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getAdviseContent() {
		return this.adviseContent;
	}

	public void setAdviseContent(String adviseContent) {
		this.adviseContent = adviseContent;
	}

	public Date getAdviseDate() {
		return this.adviseDate;
	}

	public void setAdviseDate(Date adviseDate) {
		this.adviseDate = adviseDate;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getUserdep() {
		return this.userdep;
	}

	public void setUserdep(String userdep) {
		this.userdep = userdep;
	}

}