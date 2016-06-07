package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

/**
 * GczlJyxm entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlJyxmApproval implements java.io.Serializable {
	String uids;
	String pid;
	String jymbUids;
	String grade;
	String result;
	Date checkDate;
	String approvalStatus;
	String approvalResult;
	String remark;
	
	//extend
	String mbname;//文件名称
	Date filedate;
	String fileid;
	Long filesize;
	String fileuser;
	String jyxmBh;
	String jyxmUids;
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getJyxmUids() {
		return jyxmUids;
	}
	public void setJyxmUids(String jyxmUids) {
		this.jyxmUids = jyxmUids;
	}
	public String getGrade() {
		return grade;
	}
	public void setGrade(String grade) {
		this.grade = grade;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public Date getCheckDate() {
		return checkDate;
	}
	public void setCheckDate(Date checkDate) {
		this.checkDate = checkDate;
	}
	public String getApprovalStatus() {
		return approvalStatus;
	}
	public void setApprovalStatus(String approvalStatus) {
		this.approvalStatus = approvalStatus;
	}
	public String getApprovalResult() {
		return approvalResult;
	}
	public void setApprovalResult(String approvalResult) {
		this.approvalResult = approvalResult;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getMbname() {
		return mbname;
	}
	public void setMbname(String mbname) {
		this.mbname = mbname;
	}
	public Date getFiledate() {
		return filedate;
	}
	public void setFiledate(Date filedate) {
		this.filedate = filedate;
	}
	public String getFileid() {
		return fileid;
	}
	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

	public String getFileuser() {
		return fileuser;
	}
	public void setFileuser(String fileuser) {
		this.fileuser = fileuser;
	}
	public String getJyxmBh() {
		return jyxmBh;
	}
	public void setJyxmBh(String jyxmBh) {
		this.jyxmBh = jyxmBh;
	}
	public Long getFilesize() {
		return filesize;
	}
	public void setFilesize(Long filesize) {
		this.filesize = filesize;
	}
	public String getJymbUids() {
		return jymbUids;
	}
	public void setJymbUids(String jymbUids) {
		this.jymbUids = jymbUids;
	}
}