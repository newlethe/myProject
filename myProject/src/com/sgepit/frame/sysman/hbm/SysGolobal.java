package com.sgepit.frame.sysman.hbm;
import java.io.Serializable;
import java.util.Date;

public class SysGolobal implements Serializable {
  private String uids;//主键
  private String pname;//属性key
  private String pvalue;//属性value
  private String pclass;//属性类
  private String pmodify;//属性修饰符
  private String descriptions;//该属性的描述
  private String filename;//
  private String filetype;
  private String operateuser;
  private Date   operatedate;
  private String types;
  private String filepath;
public String getUids() {
	return uids;
}
public void setUids(String uids) {
	this.uids = uids;
}
public String getPname() {
	return pname;
}
public void setPname(String pname) {
	this.pname = pname;
}
public String getPvalue() {
	return pvalue;
}
public void setPvalue(String pvalue) {
	this.pvalue = pvalue;
}
public String getPclass() {
	return pclass;
}
public void setPclass(String pclass) {
	this.pclass = pclass;
}
public String getPmodify() {
	return pmodify;
}
public void setPmodify(String pmodify) {
	this.pmodify = pmodify;
}
public String getDescriptions() {
	return descriptions;
}
public void setDescriptions(String descriptions) {
	this.descriptions = descriptions;
}
public String getFilename() {
	return filename;
}
public void setFilename(String filename) {
	this.filename = filename;
}
public String getFiletype() {
	return filetype;
}
public void setFiletype(String filetype) {
	this.filetype = filetype;
}
public String getOperateuser() {
	return operateuser;
}
public void setOperateuser(String operateuser) {
	this.operateuser = operateuser;
}
public Date getOperatedate() {
	return operatedate;
}
public void setOperatedate(Date operatedate) {
	this.operatedate = operatedate;
}
public String getTypes() {
	return types;
}
public void setTypes(String types) {
	this.types = types;
}
public String getFilepath() {
	return filepath;
}
public void setFilepath(String filepath) {
	this.filepath = filepath;
}

public SysGolobal() {
}
public SysGolobal(String uids, String pname, String pvalue, String pclass,
		String pmodify, String descriptions, String filename, String filetype,
		String operateuser, Date operatedate, String types, String filepath) {
	this.uids = uids;
	this.pname = pname;
	this.pvalue = pvalue;
	this.pclass = pclass;
	this.pmodify = pmodify;
	this.descriptions = descriptions;
	this.filename = filename;
	this.filetype = filetype;
	this.operateuser = operateuser;
	this.operatedate = operatedate;
	this.types = types;
	this.filepath = filepath;
}
  
}
