package com.sgepit.pmis.budget.hbm;
/**
 * BdgInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */
public class VBdgLibrary implements java.io.Serializable {
	//Field
	private String bdgid;
	private String parent;
	private String conid;
	private String pid;
	//extend 
	private Double bdgmoney;
	private String bdgno;
	private String bdgname;
	private Double realmoney;
	private Long isleaf;
	private Boolean ischeck;//勾选标致
	public String getBdgid() {
		return bdgid;
	}
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public Double getBdgmoney() {
		return bdgmoney;
	}
	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}
	public String getBdgno() {
		return bdgno;
	}
	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}
	public String getBdgname() {
		return bdgname;
	}
	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}
	public Double getRealmoney() {
		return realmoney;
	}
	public void setRealmoney(Double realmoney) {
		this.realmoney = realmoney;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public Boolean getIscheck() {
		return ischeck;
	}
	public void setIscheck(Boolean ischeck) {
		this.ischeck = ischeck;
	}
	public Long getIsleaf() {
		return isleaf;
	}
	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}
}
