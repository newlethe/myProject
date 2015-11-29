package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsStoreTkViewId entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsStoreTkView implements java.io.Serializable {

	// Fields

	private String uids;
	private String tkNo;
	private Date tkDate;
	private String outNo;
	private String remark;
	private String conno;
	private String conname;
	private String profession;
	private String jzNo;
	private String lyDw;

	// Constructors

	

	/** default constructor */
	public EquGoodsStoreTkView() {
	}

	/** minimal constructor */
	public EquGoodsStoreTkView(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public EquGoodsStoreTkView(String uids, String tkNo, Date tkDate,
			String outNo, String remark, String conno, String conname,
			String profession, String jzNo, String lyDw) {
		this.uids = uids;
		this.tkNo = tkNo;
		this.tkDate = tkDate;
		this.outNo = outNo;
		this.remark = remark;
		this.conno = conno;
		this.conname = conname;
		this.profession = profession;
		this.jzNo = jzNo;
		this.lyDw = lyDw;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTkNo() {
		return this.tkNo;
	}

	public void setTkNo(String tkNo) {
		this.tkNo = tkNo;
	}

	public Date getTkDate() {
		return this.tkDate;
	}

	public void setTkDate(Date tkDate) {
		this.tkDate = tkDate;
	}

	public String getOutNo() {
		return this.outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getConno() {
		return this.conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return this.conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getProfession() {
		return this.profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	public String getJzNo() {
		return this.jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
	}
	public String getLyDw() {
		return lyDw;
	}

	public void setLyDw(String lyDw) {
		this.lyDw = lyDw;
	}

}