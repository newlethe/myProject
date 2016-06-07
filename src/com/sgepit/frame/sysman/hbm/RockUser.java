package com.sgepit.frame.sysman.hbm;

import java.util.Date;

/**
 * RockUser entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockUser implements java.io.Serializable {

	// Fields

	private String userid;
	private String unitid;
	private String userpassword;
	private String realname;
	private String sex;
	private Date lastlogon;
	private Date createdon;
	private String phone;
	private String fax;
	private String homeaddress;
	private String homepostcode;
	private String homephone;
	private String mobile;
	private String useraccount;
	private String email;
	private String guidetype;
	private String deptId;
	private String userstate;
	private String posid;
	private String username;
	private String showtab;
	private String receiveSMS;
	
	//额外新增的属性，在信息发布的ExtGrid展示中需要用到
	private String unitname;
	private Date pubDate;
	private String pubState;

	// Constructors

	/** default constructor */
	public RockUser() {
	}

	/** full constructor */
	public RockUser(String unitid, String userpassword, String realname,
			String sex,  String phone, String fax,
			String homeaddress, String homepostcode, String homephone,
			String mobile, String useraccount, String email, String guidetype,
			String deptId, String userstate) {
		this.unitid = unitid;
		this.userpassword = userpassword;
		this.realname = realname;
		this.sex = sex;		
		this.phone = phone;
		this.fax = fax;
		this.homeaddress = homeaddress;
		this.homepostcode = homepostcode;
		this.homephone = homephone;
		this.mobile = mobile;
		this.useraccount = useraccount;
		this.email = email;
		this.guidetype = guidetype;
		this.deptId = deptId;
		this.userstate = userstate;
	}

	// Property accessors

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getUnitid() {
		return this.unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

	public String getUserpassword() {
		return this.userpassword;
	}

	public void setUserpassword(String userpassword) {
		this.userpassword = userpassword;
	}

	public String getRealname() {
		return this.realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	

	public Date getLastlogon() {
		return lastlogon;
	}

	public void setLastlogon(Date lastlogon) {
		this.lastlogon = lastlogon;
	}

	public Date getCreatedon() {
		return createdon;
	}

	public void setCreatedon(Date createdon) {
		this.createdon = createdon;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getFax() {
		return this.fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getHomeaddress() {
		return this.homeaddress;
	}

	public void setHomeaddress(String homeaddress) {
		this.homeaddress = homeaddress;
	}

	public String getHomepostcode() {
		return this.homepostcode;
	}

	public void setHomepostcode(String homepostcode) {
		this.homepostcode = homepostcode;
	}

	public String getHomephone() {
		return this.homephone;
	}

	public void setHomephone(String homephone) {
		this.homephone = homephone;
	}

	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getUseraccount() {
		return this.useraccount;
	}

	public void setUseraccount(String useraccount) {
		this.useraccount = useraccount;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getGuidetype() {
		return this.guidetype;
	}

	public void setGuidetype(String guidetype) {
		this.guidetype = guidetype;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getUserstate() {
		return this.userstate;
	}

	public void setUserstate(String userstate) {
		this.userstate = userstate;
	}
	

	public String getPosid() {
		return posid;
	}

	public void setPosid(String posid) {
		this.posid = posid;
	}

	public String getUnitname() {
		return unitname;
	}

	public Date getPubDate() {
		return pubDate;
	}

	public String getPubState() {
		return pubState;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public void setPubDate(Date pubDate) {
		this.pubDate = pubDate;
	}

	public void setPubState(String pubState) {
		this.pubState = pubState;
	}

	public String getUsername() {
		return getUseraccount();
	}

	public void setUsername(String username) {
		this.useraccount = username;
	}

	public String getShowtab() {
		return showtab;
	}

	public void setShowtab(String showtab) {
		this.showtab = showtab;
	}

	public String getReceiveSMS() {
		return receiveSMS;
	}

	public void setReceiveSMS(String receiveSMS) {
		this.receiveSMS = receiveSMS;
	}

}