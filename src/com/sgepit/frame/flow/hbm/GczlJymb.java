package com.sgepit.frame.flow.hbm;

import java.util.Date;

/**
 * GczlJymb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlJymb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String jyxmUids;
	private String jyxmBh;
	private String mbname;
	private String remark;
	private String fileid;
	private Long filesize;
	private String fileuser;
	private Date filedate;
	private Long isdefault;
	private Long isstart;
	private Long mborder;

	// Constructors

	/** default constructor */
	public GczlJymb() {
	}

	/** minimal constructor */
	public GczlJymb(String jyxmUids) {
		this.jyxmUids = jyxmUids;
	}

	/** full constructor */
	public GczlJymb(String pid, String jyxmUids, String jyxmBh, String mbname,
			String remark, String fileid, Long filesize, String fileuser, Date filedate,
			Long isdefault, Long isstart, Long mborder) {
		this.pid = pid;
		this.jyxmUids = jyxmUids;
		this.jyxmBh = jyxmBh;
		this.mbname = mbname;
		this.remark = remark;
		this.fileid = fileid;
		this.filesize = filesize;
		this.fileuser = fileuser;
		this.filedate = filedate;
		this.isdefault = isdefault;
		this.isstart = isstart;
		this.mborder = mborder;
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

	public String getJyxmUids() {
		return this.jyxmUids;
	}

	public void setJyxmUids(String jyxmUids) {
		this.jyxmUids = jyxmUids;
	}

	public String getJyxmBh() {
		return this.jyxmBh;
	}

	public void setJyxmBh(String jyxmBh) {
		this.jyxmBh = jyxmBh;
	}

	public String getMbname() {
		return this.mbname;
	}

	public void setMbname(String mbname) {
		this.mbname = mbname;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getFilesize() {
		return this.filesize;
	}

	public void setFilesize(Long filesize) {
		this.filesize = filesize;
	}

	public String getFileuser() {
		return this.fileuser;
	}

	public void setFileuser(String fileuser) {
		this.fileuser = fileuser;
	}

	public Date getFiledate() {
		return this.filedate;
	}

	public void setFiledate(Date filedate) {
		this.filedate = filedate;
	}

	public Long getIsdefault() {
		return this.isdefault;
	}

	public void setIsdefault(Long isdefault) {
		this.isdefault = isdefault;
	}

	public Long getIsstart() {
		return this.isstart;
	}

	public void setIsstart(Long isstart) {
		this.isstart = isstart;
	}

	public Long getMborder() {
		return this.mborder;
	}

	public void setMborder(Long mborder) {
		this.mborder = mborder;
	}

	public String getFileid() {
		return fileid;
	}

	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

}