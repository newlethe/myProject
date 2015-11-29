package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompBdgInfoReport2 entity. @author MyEclipse Persistence Tools
 */

public class FacompBdgInfoReport2 implements java.io.Serializable {

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
	private Double buildbdgsbjzmoney;
	private Double buildMoneyTotal;
	private Double installMoneyTotal;
	private Double equipbuymoney;
	private Double otherMoneyTotal;
	private Double buildrealsbjzmoney;
	private Double realMoneyTotal;
	private Double upordownMoney;
	private String upordownRate;

	// Constructors

	/** default constructor */
	public FacompBdgInfoReport2() {
	}

	/** full constructor */
	public FacompBdgInfoReport2(String pid, String treeid, String bdgno,
			String bdgname, Long isleaf, String parentid,
			Double buildbdgmoney, Double equipbdgmoney, Double installbdgmoney,
			Double otherbdgmoney, Double bdgMoneyTotal,
			Double buildbdgsbjzmoney, Double buildMoneyTotal,
			Double installMoneyTotal, Double equipbuymoney,
			Double otherMoneyTotal, Double buildrealsbjzmoney,
			Double realMoneyTotal, Double upordownMoney, String upordownRate) {
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
		this.buildbdgsbjzmoney = buildbdgsbjzmoney;
		this.buildMoneyTotal = buildMoneyTotal;
		this.installMoneyTotal = installMoneyTotal;
		this.equipbuymoney = equipbuymoney;
		this.otherMoneyTotal = otherMoneyTotal;
		this.buildrealsbjzmoney = buildrealsbjzmoney;
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

	public Double getBuildbdgsbjzmoney() {
		return this.buildbdgsbjzmoney;
	}

	public void setBuildbdgsbjzmoney(Double buildbdgsbjzmoney) {
		this.buildbdgsbjzmoney = buildbdgsbjzmoney;
	}

	public Double getBuildMoneyTotal() {
		return this.buildMoneyTotal;
	}

	public void setBuildMoneyTotal(Double buildMoneyTotal) {
		this.buildMoneyTotal = buildMoneyTotal;
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

	public Double getOtherMoneyTotal() {
		return this.otherMoneyTotal;
	}

	public void setOtherMoneyTotal(Double otherMoneyTotal) {
		this.otherMoneyTotal = otherMoneyTotal;
	}

	public Double getBuildrealsbjzmoney() {
		return this.buildrealsbjzmoney;
	}

	public void setBuildrealsbjzmoney(Double buildrealsbjzmoney) {
		this.buildrealsbjzmoney = buildrealsbjzmoney;
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