package com.sgepit.pmis.finalAccounts.bdgStructure.hbm;

public class FAGcType {
	private String uids;
	private String pid;
	private String gcTypeName;
	private Integer bdgLevel;
	private Integer faBdgLevel;
	private String parent;
	private Boolean isLeaf;
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
	public Integer getBdgLevel() {
		return bdgLevel;
	}
	public void setBdgLevel(Integer bdgLevel) {
		this.bdgLevel = bdgLevel;
	}
	public Integer getFaBdgLevel() {
		return faBdgLevel;
	}
	public void setFaBdgLevel(Integer faBdgLevel) {
		this.faBdgLevel = faBdgLevel;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public Boolean getIsLeaf() {
		return isLeaf;
	}
	public void setIsLeaf(Boolean isLeaf) {
		this.isLeaf = isLeaf;
	}
	
}