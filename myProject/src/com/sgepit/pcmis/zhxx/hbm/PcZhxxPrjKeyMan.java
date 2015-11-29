package com.sgepit.pcmis.zhxx.hbm;


/**
 * PcZhxxPrjKeyMan entity. @author MyEclipse Persistence Tools
 */

public class PcZhxxPrjKeyMan implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String postname;
	private String image;
	private String userid;
	private String deptid;
	private String posid;
	private Long viewOrderNum;
	private String resume;
	private String username;
	private String contact;

	// Constructors

	/** default constructor */
	public PcZhxxPrjKeyMan() {
	}

	/** minimal constructor */
	public PcZhxxPrjKeyMan(String pid, String username) {
		this.pid = pid;
		this.username = username;
	}

	/** full constructor */
	public PcZhxxPrjKeyMan(String pid, String postname, String image,
			String userid, String deptid, String posid,
			Long viewOrderNum, String resume, String username) {
		this.pid = pid;
		this.postname = postname;
		this.image = image;
		this.userid = userid;
		this.deptid = deptid;
		this.posid = posid;
		this.viewOrderNum = viewOrderNum;
		this.resume = resume;
		this.username = username;
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

	public String getPostname() {
		return this.postname;
	}

	public void setPostname(String postname) {
		this.postname = postname;
	}

	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getDeptid() {
		return this.deptid;
	}

	public void setDeptid(String deptid) {
		this.deptid = deptid;
	}

	public String getPosid() {
		return this.posid;
	}

	public void setPosid(String posid) {
		this.posid = posid;
	}

	public Long getViewOrderNum() {
		return this.viewOrderNum;
	}

	public void setViewOrderNum(Long viewOrderNum) {
		this.viewOrderNum = viewOrderNum;
	}

	public String getResume() {
		return this.resume;
	}

	public void setResume(String resume) {
		this.resume = resume;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

}