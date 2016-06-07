package com.sgepit.pmis.finalAccounts.complete.hbm;
/**
 * 工程类型表
 * @author pengy
 * @createtime 2013-06-27
 */
public class FACompGcType {
	private String uids;
	private String pid;
	private String treeid;
	private String gcTypeName;
	private String gcTypeBm;
	private String remark;
	private String parentid;
	private Long isleaf;
	
	public FACompGcType() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FACompGcType(String uids, String pid, String treeid, String gcTypeName,
			String gcTypeBm, String remark, String parentid, Long isleaf) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.treeid = treeid;
		this.gcTypeName = gcTypeName;
		this.gcTypeBm = gcTypeBm;
		this.remark = remark;
		this.parentid = parentid;
		this.isleaf = isleaf;
	}

	public String getTreeid() {
		return treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
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

	public String getGcTypeName() {
		return gcTypeName;
	}

	public void setGcTypeName(String gcTypeName) {
		this.gcTypeName = gcTypeName;
	}

	public String getGcTypeBm() {
		return gcTypeBm;
	}

	public void setGcTypeBm(String gcTypeBm) {
		this.gcTypeBm = gcTypeBm;
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

}