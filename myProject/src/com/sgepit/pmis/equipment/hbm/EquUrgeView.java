package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquUrgeView implements java.io.Serializable {

	// Fields
	private String urgeid;
	private String sbId;
	private String pid;
	private Date yjdhrq;
	private Date sjdhrq;
	private String ycjhyy;
	private String fzr;
	private String sbMc;
	private String conid;
	private String conname;
	private String conno;
	private String condivno;
	private String sort;
	public String getUrgeid() {
		return urgeid;
	}
	public void setUrgeid(String urgeid) {
		this.urgeid = urgeid;
	}
	public String getSbId() {
		return sbId;
	}
	public void setSbId(String sbId) {
		this.sbId = sbId;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public Date getYjdhrq() {
		return yjdhrq;
	}
	public void setYjdhrq(Date yjdhrq) {
		this.yjdhrq = yjdhrq;
	}
	public Date getSjdhrq() {
		return sjdhrq;
	}
	public void setSjdhrq(Date sjdhrq) {
		this.sjdhrq = sjdhrq;
	}
	public String getYcjhyy() {
		return ycjhyy;
	}
	public void setYcjhyy(String ycjhyy) {
		this.ycjhyy = ycjhyy;
	}
	public String getFzr() {
		return fzr;
	}
	public void setFzr(String fzr) {
		this.fzr = fzr;
	}
	public String getSbMc() {
		return sbMc;
	}
	public void setSbMc(String sbMc) {
		this.sbMc = sbMc;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public String getConname() {
		return conname;
	}
	public void setConname(String conname) {
		this.conname = conname;
	}
	public String getConno() {
		return conno;
	}
	public void setConno(String conno) {
		this.conno = conno;
	}
	public String getCondivno() {
		return condivno;
	}
	public void setCondivno(String condivno) {
		this.condivno = condivno;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	
}