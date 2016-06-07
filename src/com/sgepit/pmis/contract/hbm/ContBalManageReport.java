package com.sgepit.pmis.contract.hbm;

/**
 * ContBalManageReport entity. @author MyEclipse Persistence Tools
 */

public class ContBalManageReport implements java.io.Serializable {

	// Fields

	private String uids;
	private String conid;
	private String pid;
	private String bdgid;
	private String treeid;
	private String proid;
	private String masterId;
	private Double lastMon;
	private Double sgdwSbGcl;
	private Double jlgsShGcl;
	private Double jsdwShGcl;
	private Double zjzxShGcl;
	private Double thisMon;
	private Double lastMonComp;
	private Double sgdwSbJdk;
	private Double jlgsShJdk;
	private Double jsdwShJdk;
	private Double zjzxShJdk;
	private Double thisMonComp;
	private String remark;
	
	private String isper;
	// Constructors

	/** default constructor */
	public ContBalManageReport() {
	}

	/** full constructor */
	public ContBalManageReport(String conid, String pid, String proid,
			Double lastMon, Double sgdwSbGcl, Double jlgsShGcl,
			Double jsdwShGcl, Double zjzxShGcl, Double thisMon,
			Double lastMonComp, Double sgdwSbJdk, Double jlgsShJdk,
			Double jsdwShJdk, Double zjzxShJdk, Double thisMonComp,
			String remark, String isper) {
		this.conid = conid;
		this.pid = pid;
		this.proid = proid;
		this.lastMon = lastMon;
		this.sgdwSbGcl = sgdwSbGcl;
		this.jlgsShGcl = jlgsShGcl;
		this.jsdwShGcl = jsdwShGcl;
		this.zjzxShGcl = zjzxShGcl;
		this.thisMon = thisMon;
		this.lastMonComp = lastMonComp;
		this.sgdwSbJdk = sgdwSbJdk;
		this.jlgsShJdk = jlgsShJdk;
		this.jsdwShJdk = jsdwShJdk;
		this.zjzxShJdk = zjzxShJdk;
		this.thisMonComp = thisMonComp;
		this.remark = remark;
		this.isper = isper;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getProid() {
		return this.proid;
	}

	public void setProid(String proid) {
		this.proid = proid;
	}

	public Double getLastMon() {
		return this.lastMon;
	}

	public void setLastMon(Double lastMon) {
		this.lastMon = lastMon;
	}

	public Double getSgdwSbGcl() {
		return this.sgdwSbGcl;
	}

	public void setSgdwSbGcl(Double sgdwSbGcl) {
		this.sgdwSbGcl = sgdwSbGcl;
	}

	public Double getJlgsShGcl() {
		return this.jlgsShGcl;
	}

	public void setJlgsShGcl(Double jlgsShGcl) {
		this.jlgsShGcl = jlgsShGcl;
	}

	public Double getJsdwShGcl() {
		return this.jsdwShGcl;
	}

	public void setJsdwShGcl(Double jsdwShGcl) {
		this.jsdwShGcl = jsdwShGcl;
	}

	public Double getZjzxShGcl() {
		return this.zjzxShGcl;
	}

	public void setZjzxShGcl(Double zjzxShGcl) {
		this.zjzxShGcl = zjzxShGcl;
	}

	public Double getThisMon() {
		return this.thisMon;
	}

	public void setThisMon(Double thisMon) {
		this.thisMon = thisMon;
	}

	public Double getLastMonComp() {
		return this.lastMonComp;
	}

	public void setLastMonComp(Double lastMonComp) {
		this.lastMonComp = lastMonComp;
	}

	public Double getSgdwSbJdk() {
		return this.sgdwSbJdk;
	}

	public void setSgdwSbJdk(Double sgdwSbJdk) {
		this.sgdwSbJdk = sgdwSbJdk;
	}

	public Double getJlgsShJdk() {
		return this.jlgsShJdk;
	}

	public void setJlgsShJdk(Double jlgsShJdk) {
		this.jlgsShJdk = jlgsShJdk;
	}

	public Double getJsdwShJdk() {
		return this.jsdwShJdk;
	}

	public void setJsdwShJdk(Double jsdwShJdk) {
		this.jsdwShJdk = jsdwShJdk;
	}

	public Double getZjzxShJdk() {
		return this.zjzxShJdk;
	}

	public void setZjzxShJdk(Double zjzxShJdk) {
		this.zjzxShJdk = zjzxShJdk;
	}

	public Double getThisMonComp() {
		return this.thisMonComp;
	}

	public void setThisMonComp(Double thisMonComp) {
		this.thisMonComp = thisMonComp;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getMasterId() {
		return masterId;
	}

	public void setMasterId(String masterId) {
		this.masterId = masterId;
	}

	public String getBdgid() {
		return bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getTreeid() {
		return treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getIsper() {
		return isper;
	}

	public void setIsper(String isper) {
		this.isper = isper;
	}

}