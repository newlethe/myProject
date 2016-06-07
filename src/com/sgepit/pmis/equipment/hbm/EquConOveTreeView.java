package com.sgepit.pmis.equipment.hbm;

import java.math.BigDecimal;

public class EquConOveTreeView  implements java.io.Serializable{
	private String uids;
	private String treeid;
	private String parentid;
	private String pid;
	private String name;
	private String conid;
	private Long isleaf;
	public EquConOveTreeView(){
		super();
	}
	public EquConOveTreeView(String uids,String treeid,String parentid,String name,String conid,Long isleaf,String pid){
		this.uids = uids;
		this.treeid = treeid;
		this.parentid = parentid;
		this.name = name;
		this.conid = conid;
		this.isleaf = isleaf;
		this.pid = pid;
	}
	
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getTreeid() {
		return treeid;
	}
	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}
	public String getParentid() {
		return parentid;
	}
	public void setParentid(String parentid) {
		this.parentid = parentid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public Long getIsleaf() {
		return isleaf;
	}
	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	
}
