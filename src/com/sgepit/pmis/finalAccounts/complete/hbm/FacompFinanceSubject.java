package com.sgepit.pmis.finalAccounts.complete.hbm;
/**
 * 财务科目表
 * @author pengy
 * @createtime 2013-06-27
 */
public class FacompFinanceSubject {
	private String uids;
	private String pid;
	private String treeid;
	private String subjectName;
	private String subjectBm;
	private String subjectAllname;
	private String remark;
	private String parentid;
	private Long isleaf;
	
	public FacompFinanceSubject() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FacompFinanceSubject(String uids, String pid, String treeid,
			String subjectName, String subjectBm, String subjectAllname,
			String remark, String parentid, Long isleaf) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.treeid = treeid;
		this.subjectName = subjectName;
		this.subjectBm = subjectBm;
		this.subjectAllname = subjectAllname;
		this.remark = remark;
		this.parentid = parentid;
		this.isleaf = isleaf;
	}

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

	public String getTreeid() {
		return treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getSubjectName() {
		return subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	public String getSubjectBm() {
		return subjectBm;
	}

	public void setSubjectBm(String subjectBm) {
		this.subjectBm = subjectBm;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getSubjectAllname() {
		return subjectAllname;
	}

	public void setSubjectAllname(String subjectAllname) {
		this.subjectAllname = subjectAllname;
	}

}