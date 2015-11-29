package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * VHrManInfoId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VHrManInfo implements java.io.Serializable {

	// Fields

	private String userid;
	private String realname;
	private String usernum;
	private String orgid;
	private String posid;//部门编号
	private String orgname;
	private String postname;
	private String posname;//岗位名称
	private String postcode;
	private String onthejob;
	private String sex;
	private Date birthday;
	private Date entrydate;
	private Date signeddate;
	private Date enddate;
	private Date leftdate;
	private String emptypecode;
	private String emptypename;

	// Constructors


	public VHrManInfo(String userid, String realname, String usernum,
			String orgid, String posid, String orgname, String postname,
			String posname, String postcode, String onthejob, String sex,
			Date birthday, Date entrydate, Date signeddate, Date enddate,
			Date leftdate, String emptypecode, String emptypename) {
		super();
		this.userid = userid;
		this.realname = realname;
		this.usernum = usernum;
		this.orgid = orgid;
		this.posid = posid;
		this.orgname = orgname;
		this.postname = postname;
		this.posname = posname;
		this.postcode = postcode;
		this.onthejob = onthejob;
		this.sex = sex;
		this.birthday = birthday;
		this.entrydate = entrydate;
		this.signeddate = signeddate;
		this.enddate = enddate;
		this.leftdate = leftdate;
		this.emptypecode = emptypecode;
		this.emptypename = emptypename;
	}

	/** default constructor */
	public VHrManInfo() {
	}

	/** minimal constructor */
	public VHrManInfo(String userid) {
		this.userid = userid;
	}


	// Property accessors


	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getRealname() {
		return this.realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getUsernum() {
		return this.usernum;
	}

	public void setUsernum(String usernum) {
		this.usernum = usernum;
	}

	public String getOrgid() {
		return this.orgid;
	}

	public void setOrgid(String orgid) {
		this.orgid = orgid;
	}

	public String getOrgname() {
		return this.orgname;
	}

	public void setOrgname(String orgname) {
		this.orgname = orgname;
	}

	public String getPostname() {
		return this.postname;
	}

	public void setPostname(String postname) {
		this.postname = postname;
	}

	public String getPostcode() {
		return this.postcode;
	}

	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}

	public String getOnthejob() {
		return this.onthejob;
	}

	public void setOnthejob(String onthejob) {
		this.onthejob = onthejob;
	}

	public Date getBirthday() {
		return this.birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public Date getEntrydate() {
		return this.entrydate;
	}

	public void setEntrydate(Date entrydate) {
		this.entrydate = entrydate;
	}

	public Date getSigneddate() {
		return this.signeddate;
	}

	public void setSigneddate(Date signeddate) {
		this.signeddate = signeddate;
	}

	public Date getEnddate() {
		return this.enddate;
	}

	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}

	public Date getLeftdate() {
		return this.leftdate;
	}

	public void setLeftdate(Date leftdate) {
		this.leftdate = leftdate;
	}

	public String getEmptypecode() {
		return emptypecode;
	}

	public void setEmptypecode(String emptypecode) {
		this.emptypecode = emptypecode;
	}

	public String getEmptypename() {
		return emptypename;
	}

	public void setEmptypename(String emptypename) {
		this.emptypename = emptypename;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getPosname() {
		return posname;
	}

	public void setPosname(String posname) {
		this.posname = posname;
	}

	public String getPosid() {
		return posid;
	}

	public void setPosid(String posid) {
		this.posid = posid;
	}

}