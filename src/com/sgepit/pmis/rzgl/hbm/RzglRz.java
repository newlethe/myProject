package com.sgepit.pmis.rzgl.hbm;

import java.util.Date;


/**
 * RzglRz entity. @author MyEclipse Persistence Tools
 */

public class RzglRz implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	// Fields

	private String uids;
	private String flUids;
	private String createUser;
	private Date createDate;
	private String createDept;
	private String workContent;
	private String fjStr;

	// Constructors

	/** default constructor */
	public RzglRz() {
	}

	/** minimal constructor */
    public RzglRz(String uids) {
        this.uids = uids;
    }
	/** full constructor */
	public RzglRz(String uids,String flUids, String createUser, Date createDate,
			String createDept, String workContent, String fjStr) {
		this.uids = uids;
		this.flUids = flUids;
		this.createUser = createUser;
		this.createDate = createDate;
		this.createDept = createDept;
		this.workContent = workContent;
		this.fjStr = fjStr;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getFlUids() {
		return this.flUids;
	}

	public void setFlUids(String flUids) {
		this.flUids = flUids;
	}

	public String getCreateUser() {
		return this.createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateDept() {
		return this.createDept;
	}

	public void setCreateDept(String createDept) {
		this.createDept = createDept;
	}

	public String getWorkContent() {
		return this.workContent;
	}

	public void setWorkContent(String workContent) {
		this.workContent = workContent;
	}

	public String getFjStr() {
		return this.fjStr;
	}

	public void setFjStr(String fjStr) {
		this.fjStr = fjStr;
	}

}