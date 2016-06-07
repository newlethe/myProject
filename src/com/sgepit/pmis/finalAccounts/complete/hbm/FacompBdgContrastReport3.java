package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompBdgContrastReport3 entity. @author MyEclipse Persistence Tools
 */

public class FacompBdgContrastReport3 implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String treeid;
	private String bdgno;
	private String bdgname;
	private Long isleaf;
	private String parentid;
	private Double buildbdgmoney;
	private Double equipbdgmoney;
	private Double installbdgmoney;
	private Double otherbdgmoney;
	private Double bdgMoneyTotal;
	private Double buildprojectmoney;
	private Double buildclmoney;
	private Double buildoutmoney;
	private Double buildMoneyTotal;
	private Double installprojectmoney;
	private Double installclmoney;
	private Double installMoneyTotal;
	private Double equipbuymoney;
	private Double othercostmoney;
	private Double othercostoutmoney;
	private Double otherMoneyTotal;
	private Double realMoneyTotal;
	private Double upordownMoney;
	private String upordownRate;

	// Constructors

	/** default constructor */
	public FacompBdgContrastReport3() {
	}

	/** full constructor */
	public FacompBdgContrastReport3(String pid, String treeid, String bdgno,
			String bdgname, Long isleaf, String parentid,
			Double buildbdgmoney, Double equipbdgmoney, Double installbdgmoney,
			Double otherbdgmoney, Double bdgMoneyTotal,
			Double buildprojectmoney, Double buildclmoney,
			Double buildoutmoney, Double buildMoneyTotal,
			Double installprojectmoney, Double installclmoney,
			Double installMoneyTotal, Double equipbuymoney,
			Double othercostmoney, Double othercostoutmoney,
			Double otherMoneyTotal, Double realMoneyTotal,
			Double upordownMoney, String upordownRate) {
		this.pid = pid;
		this.treeid = treeid;
		this.bdgno = bdgno;
		this.bdgname = bdgname;
		this.isleaf = isleaf;
		this.parentid = parentid;
		this.buildbdgmoney = buildbdgmoney;
		this.equipbdgmoney = equipbdgmoney;
		this.installbdgmoney = installbdgmoney;
		this.otherbdgmoney = otherbdgmoney;
		this.bdgMoneyTotal = bdgMoneyTotal;
		this.buildprojectmoney = buildprojectmoney;
		this.buildclmoney = buildclmoney;
		this.buildoutmoney = buildoutmoney;
		this.buildMoneyTotal = buildMoneyTotal;
		this.installprojectmoney = installprojectmoney;
		this.installclmoney = installclmoney;
		this.installMoneyTotal = installMoneyTotal;
		this.equipbuymoney = equipbuymoney;
		this.othercostmoney = othercostmoney;
		this.othercostoutmoney = othercostoutmoney;
		this.otherMoneyTotal = otherMoneyTotal;
		this.realMoneyTotal = realMoneyTotal;
		this.upordownMoney = upordownMoney;
		this.upordownRate = upordownRate;
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

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getBdgno() {
		return this.bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return this.bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Double getBuildbdgmoney() {
		return this.buildbdgmoney;
	}

	public void setBuildbdgmoney(Double buildbdgmoney) {
		this.buildbdgmoney = buildbdgmoney;
	}

	public Double getEquipbdgmoney() {
		return this.equipbdgmoney;
	}

	public void setEquipbdgmoney(Double equipbdgmoney) {
		this.equipbdgmoney = equipbdgmoney;
	}

	public Double getInstallbdgmoney() {
		return this.installbdgmoney;
	}

	public void setInstallbdgmoney(Double installbdgmoney) {
		this.installbdgmoney = installbdgmoney;
	}

	public Double getOtherbdgmoney() {
		return this.otherbdgmoney;
	}

	public void setOtherbdgmoney(Double otherbdgmoney) {
		this.otherbdgmoney = otherbdgmoney;
	}

	public Double getBdgMoneyTotal() {
		return this.bdgMoneyTotal;
	}

	public void setBdgMoneyTotal(Double bdgMoneyTotal) {
		this.bdgMoneyTotal = bdgMoneyTotal;
	}

	public Double getBuildprojectmoney() {
		return this.buildprojectmoney;
	}

	public void setBuildprojectmoney(Double buildprojectmoney) {
		this.buildprojectmoney = buildprojectmoney;
	}

	public Double getBuildclmoney() {
		return this.buildclmoney;
	}

	public void setBuildclmoney(Double buildclmoney) {
		this.buildclmoney = buildclmoney;
	}

	public Double getBuildoutmoney() {
		return this.buildoutmoney;
	}

	public void setBuildoutmoney(Double buildoutmoney) {
		this.buildoutmoney = buildoutmoney;
	}

	public Double getBuildMoneyTotal() {
		return this.buildMoneyTotal;
	}

	public void setBuildMoneyTotal(Double buildMoneyTotal) {
		this.buildMoneyTotal = buildMoneyTotal;
	}

	public Double getInstallprojectmoney() {
		return this.installprojectmoney;
	}

	public void setInstallprojectmoney(Double installprojectmoney) {
		this.installprojectmoney = installprojectmoney;
	}

	public Double getInstallclmoney() {
		return this.installclmoney;
	}

	public void setInstallclmoney(Double installclmoney) {
		this.installclmoney = installclmoney;
	}

	public Double getInstallMoneyTotal() {
		return this.installMoneyTotal;
	}

	public void setInstallMoneyTotal(Double installMoneyTotal) {
		this.installMoneyTotal = installMoneyTotal;
	}

	public Double getEquipbuymoney() {
		return this.equipbuymoney;
	}

	public void setEquipbuymoney(Double equipbuymoney) {
		this.equipbuymoney = equipbuymoney;
	}

	public Double getOthercostmoney() {
		return this.othercostmoney;
	}

	public void setOthercostmoney(Double othercostmoney) {
		this.othercostmoney = othercostmoney;
	}

	public Double getOthercostoutmoney() {
		return this.othercostoutmoney;
	}

	public void setOthercostoutmoney(Double othercostoutmoney) {
		this.othercostoutmoney = othercostoutmoney;
	}

	public Double getOtherMoneyTotal() {
		return this.otherMoneyTotal;
	}

	public void setOtherMoneyTotal(Double otherMoneyTotal) {
		this.otherMoneyTotal = otherMoneyTotal;
	}

	public Double getRealMoneyTotal() {
		return this.realMoneyTotal;
	}

	public void setRealMoneyTotal(Double realMoneyTotal) {
		this.realMoneyTotal = realMoneyTotal;
	}

	public Double getUpordownMoney() {
		return this.upordownMoney;
	}

	public void setUpordownMoney(Double upordownMoney) {
		this.upordownMoney = upordownMoney;
	}

	public String getUpordownRate() {
		return this.upordownRate;
	}

	public void setUpordownRate(String upordownRate) {
		this.upordownRate = upordownRate;
	}

}