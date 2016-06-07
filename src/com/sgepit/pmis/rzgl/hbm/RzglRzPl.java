package com.sgepit.pmis.rzgl.hbm;

import java.util.Date;


/**
 * RzglRzPl entity. @author MyEclipse Persistence Tools
 */

public class RzglRzPl implements java.io.Serializable {

	// Fields

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String uids;
	private String rzUids;
	private Date createDate;
	private String createUser;
	private String plContent;
	private String fjStr;
	private String col1;

	// Constructors

	/** default constructor */
	public RzglRzPl() {
	}

	/** minimal constructor */
    public RzglRzPl(String uids) {
        this.uids = uids;
    }
	/** full constructor */
	public RzglRzPl(String uids,String rzUids, Date createDate, String createUser, String plContent,
			String fjStr, String col1) {
		this.uids = uids;
		this.rzUids = rzUids;
		this.createDate = createDate;
		this.createUser = createUser;
		this.plContent = plContent;
		this.fjStr = fjStr;
		this.col1 = col1;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	
	public String getRzUids() {
		return rzUids;
	}

	public void setRzUids(String rzUids) {
		this.rzUids = rzUids;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateUser() {
		return this.createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getPlContent() {
		return this.plContent;
	}

	public void setPlContent(String plContent) {
		this.plContent = plContent;
	}

	public String getFjStr() {
		return this.fjStr;
	}

	public void setFjStr(String fjStr) {
		this.fjStr = fjStr;
	}

	public String getCol1() {
		return this.col1;
	}

	public void setCol1(String col1) {
		this.col1 = col1;
	}

}