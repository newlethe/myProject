package com.sgepit.pmis.wzgl.hbm;

public class WzConBodyTreeView  implements java.io.Serializable{
	private String uids;
	private String treeid;
	private String parentid;
	private String name;
	private String conid;
	private Long isleaf;
	public WzConBodyTreeView(){
		super();
	}
	public WzConBodyTreeView(String uids,String treeid,String parentid,String name,String conid,Long isleaf){
		this.uids = uids;
		this.treeid = treeid;
		this.parentid = parentid;
		this.name = name;
		this.conid = conid;
		this.isleaf = isleaf;
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
}
