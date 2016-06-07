package com.sgepit.pcmis.warn.hbm;

import java.io.Serializable;

public class UserBean implements Serializable {
private String userid;
private String username;
private String realname ;
private String sex ;
private String dowithperson;
private String dowithtype;
private String searchperson;
private String searchtype;
private String pid;
private String warninfoid;
private String guidecomments;//指导意见
public UserBean() {
	super();
}

public UserBean(String userid, String username, String realname, String sex,
		String dowithperson, String dowithtype, String searchperson,
		String searchtype, String pid, String warninfoid, String guidecomments) {
	super();
	this.userid = userid;
	this.username = username;
	this.realname = realname;
	this.sex = sex;
	this.dowithperson = dowithperson;
	this.dowithtype = dowithtype;
	this.searchperson = searchperson;
	this.searchtype = searchtype;
	this.pid = pid;
	this.warninfoid = warninfoid;
	this.guidecomments = guidecomments;
}

public String getGuidecomments() {
	return guidecomments;
}
public void setGuidecomments(String guidecomments) {
	this.guidecomments = guidecomments;
}
public String getDowithtype() {
	return dowithtype;
}

public void setDowithtype(String dowithtype) {
	this.dowithtype = dowithtype;
}

public String getSearchtype() {
	return searchtype;
}

public void setSearchtype(String searchtype) {
	this.searchtype = searchtype;
}

public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public String getWarninfoid() {
	return warninfoid;
}
public void setWarninfoid(String warninfoid) {
	this.warninfoid = warninfoid;
}
public String getUsername() {
	return username;
}

public void setUsername(String username) {
	this.username = username;
}

public String getUserid() {
	return userid;
}
public void setUserid(String userid) {
	this.userid = userid;
}
public String getRealname() {
	return realname;
}
public void setRealname(String realname) {
	this.realname = realname;
}
public String getSex() {
	return sex;
}
public void setSex(String sex) {
	this.sex = sex;
}
public String getDowithperson() {
	return dowithperson;
}
public void setDowithperson(String dowithperson) {
	this.dowithperson = dowithperson;
}
public String getSearchperson() {
	return searchperson;
}
public void setSearchperson(String searchperson) {
	this.searchperson = searchperson;
}

}
