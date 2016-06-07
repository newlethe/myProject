package com.sgepit.pmis.rlzj.hbm;

public class KqDaysOvertime implements java.io.Serializable {
  /*保存考勤加班情况的表
   * */
  private String uids;
  private String masterlsh;
  private String monthstr;
  private String deptstr;
  private String realname;
  private String datetimestr;
  private String zbseqno;
  private String kqcontent;
  private String pid;
  private String memo;
  private String sjtype;
  private String sjtypedetail;
  private String upunit;
  private String unitid;
  private String kojbtype;
  private String isboss;
  
	/** default constructor */
	public KqDaysOvertime() {
	}  
public String getUids() {
	return uids;
}
public void setUids(String uids) {
	this.uids = uids;
}
public String getMasterlsh() {
	return masterlsh;
}
public void setMasterlsh(String masterlsh) {
	this.masterlsh = masterlsh;
}
public String getMonthstr() {
	return monthstr;
}
public void setMonthstr(String monthstr) {
	this.monthstr = monthstr;
}
public String getDeptstr() {
	return deptstr;
}
public void setDeptstr(String deptstr) {
	this.deptstr = deptstr;
}
public String getRealname() {
	return realname;
}
public void setRealname(String realname) {
	this.realname = realname;
}
public String getDatetimestr() {
	return datetimestr;
}
public void setDatetimestr(String datetimestr) {
	this.datetimestr = datetimestr;
}

public String getKqcontent() {
	return kqcontent;
}
public void setKqcontent(String kqcontent) {
	this.kqcontent = kqcontent;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public String getMemo() {
	return memo;
}
public void setMemo(String memo) {
	this.memo = memo;
}
public KqDaysOvertime(String uids, String masterlsh, String monthstr,
		String deptstr, String realname, String datetimestr, String zbseqno,
		String kqcontent, String pid, String memo) {
	super();
	this.uids = uids;
	this.masterlsh = masterlsh;
	this.monthstr = monthstr;
	this.deptstr = deptstr;
	this.realname = realname;
	this.datetimestr = datetimestr;
	this.zbseqno = zbseqno;
	this.kqcontent = kqcontent;
	this.pid = pid;
	this.memo = memo;
}
public String getSjtype() {
	return sjtype;
}
public void setSjtype(String sjtype) {
	this.sjtype = sjtype;
}
public String getUnitid() {
	return unitid;
}
public void setUnitid(String unitid) {
	this.unitid = unitid;
}
public String getZbseqno() {
	return zbseqno;
}
public void setZbseqno(String zbseqno) {
	this.zbseqno = zbseqno;
}
public String getSjtypedetail() {
	return sjtypedetail;
}
public void setSjtypedetail(String sjtypedetail) {
	this.sjtypedetail = sjtypedetail;
}
public String getUpunit() {
	return upunit;
}
public void setUpunit(String upunit) {
	this.upunit = upunit;
}
public String getKojbtype() {
	return kojbtype;
}
public void setKojbtype(String kojbtype) {
	this.kojbtype = kojbtype;
}
public String getIsboss() {
	return isboss;
}
public void setIsboss(String isboss) {
	this.isboss = isboss;
}
	
}
