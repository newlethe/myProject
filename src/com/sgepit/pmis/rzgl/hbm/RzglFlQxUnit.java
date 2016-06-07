package com.sgepit.pmis.rzgl.hbm;
import java.util.Date;

/**
 * RzglFlQxUnit entity. @author MyEclipse Persistence Tools
 */
public class RzglFlQxUnit implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	// Fields

	private String uids;
	private String createUser;
	private String qxFl;
	private String qxDept;
	private Date createDate;
	private String createDept;
	private String col1;
	private String col2;

	// Constructors

	/** default constructor */
	public RzglFlQxUnit() {
	}

	/** minimal constructor */
	public RzglFlQxUnit(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public RzglFlQxUnit(String uids, String createUser, String qxFl,
			String qxDept, Date createDate, String createDept,
			String col1, String col2) {
		this.uids = uids;
		this.createUser = createUser;
		this.qxFl = qxFl;
		this.qxDept = qxDept;
		this.createDate = createDate;
		this.createDept = createDept;
		this.col1 = col1;
		this.col2 = col2;
	}

	// Property accessors
	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCreateUser() {
		return this.createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getQxFl() {
		return this.qxFl;
	}

	public void setQxFl(String qxFl) {
		this.qxFl = qxFl;
	}

	public String getQxDept() {
		return this.qxDept;
	}

	public void setQxDept(String qxDept) {
		this.qxDept = qxDept;
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

	public String getCol1() {
		return this.col1;
	}

	public void setCol1(String col1) {
		this.col1 = col1;
	}

	public String getCol2() {
		return this.col2;
	}

	public void setCol2(String col2) {
		this.col2 = col2;
	}

}