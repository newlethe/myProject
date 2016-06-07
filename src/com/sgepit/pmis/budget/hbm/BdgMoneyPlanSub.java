package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * BdgMoneyPlanSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgMoneyPlanSub implements java.io.Serializable {

	// Fields

	private String id;
	private String mainid;
	private String pid;
	private String bdgid;
	private String bdgconids;
	private Double planmoney;
	private Date plantime;
	private Long isleaf;
	private String parent;
	private String remark;
	
	//extends  表中只存储了主键
	private String bdgno;
	private String bdgname;
	private String connames;      //某个概算分摊的合同名称的集合
	private Double bdgmoney;	  //概算金额
	private Double totalappmoney; //某个概算的分摊总金额

	// Constructors

	/** default constructor */
	public BdgMoneyPlanSub() {
	}

	/** full constructor */
	public BdgMoneyPlanSub(String mainid, String pid, String bdgid,
			String bdgconids, Double planmoney, Date plantime, Long isleaf,
			String parent, String remark) {
		this.mainid = mainid;
		this.pid = pid;
		this.bdgid = bdgid;
		this.bdgconids = bdgconids;
		this.planmoney = planmoney;
		this.plantime = plantime;
		this.isleaf = isleaf;
		this.parent = parent;
		this.remark = remark;
	}

	// Property accessors

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMainid() {
		return this.mainid;
	}

	public void setMainid(String mainid) {
		this.mainid = mainid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgconids() {
		return this.bdgconids;
	}

	public void setBdgconids(String bdgconids) {
		this.bdgconids = bdgconids;
	}

	public Double getPlanmoney() {
		return this.planmoney;
	}

	public void setPlanmoney(Double planmoney) {
		this.planmoney = planmoney;
	}

	public Date getPlantime() {
		return this.plantime;
	}

	public void setPlantime(Date plantime) {
		this.plantime = plantime;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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

	public String getConnames() {
		return connames;
	}

	public void setConnames(String connames) {
		this.connames = connames;
	}

	public Double getBdgmoney() {
		return bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public Double getTotalappmoney() {
		return totalappmoney;
	}

	public void setTotalappmoney(Double totalappmoney) {
		this.totalappmoney = totalappmoney;
	}

}