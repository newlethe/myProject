package com.sgepit.pmis.finalAccounts.complete.hbm;
/**
 * 未完工工程表
 * @author pengy
 * @createtime 2013-07-04 10:09:20
 */
public class FACompUncompPrj {
	
	private String uids;
	private String pid;
	private String xh;
	private String prjName;
	private String prjLocation;
	private String unit;
	private Double prjNumber;
	private Double bdgMoney;
	private Double compMoney;
	private Double compPercent;
	private Double predUnbuild;
	private Double installEng;
	private Double equipPurch;
	private Double otherCost;
	private String remark;
	private Double totalmoney;
	
	public FACompUncompPrj() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FACompUncompPrj(String uids, String pid, String xh, String prjName,
			String prjLocation, String unit, Double prjNumber, Double bdgMoney,
			Double compMoney, Double compPercent, Double predUnbuild,
			Double installEng, Double equipPurch, Double otherCost,
			String remark, Double totalmoney) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.xh = xh;
		this.prjName = prjName;
		this.prjLocation = prjLocation;
		this.unit = unit;
		this.prjNumber = prjNumber;
		this.bdgMoney = bdgMoney;
		this.compMoney = compMoney;
		this.compPercent = compPercent;
		this.predUnbuild = predUnbuild;
		this.installEng = installEng;
		this.equipPurch = equipPurch;
		this.otherCost = otherCost;
		this.remark = remark;
		this.totalmoney = totalmoney;
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

	public String getXh() {
		return xh;
	}

	public void setXh(String xh) {
		this.xh = xh;
	}

	public String getPrjName() {
		return prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}

	public String getPrjLocation() {
		return prjLocation;
	}

	public void setPrjLocation(String prjLocation) {
		this.prjLocation = prjLocation;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getPrjNumber() {
		return prjNumber;
	}

	public void setPrjNumber(Double prjNumber) {
		this.prjNumber = prjNumber;
	}

	public Double getBdgMoney() {
		return bdgMoney;
	}

	public void setBdgMoney(Double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}

	public Double getCompMoney() {
		return compMoney;
	}

	public void setCompMoney(Double compMoney) {
		this.compMoney = compMoney;
	}

	public Double getCompPercent() {
		return compPercent;
	}

	public void setCompPercent(Double compPercent) {
		this.compPercent = compPercent;
	}

	public Double getPredUnbuild() {
		return predUnbuild;
	}

	public void setPredUnbuild(Double predUnbuild) {
		this.predUnbuild = predUnbuild;
	}

	public Double getInstallEng() {
		return installEng;
	}

	public void setInstallEng(Double installEng) {
		this.installEng = installEng;
	}
	
	public Double getEquipPurch() {
		return equipPurch;
	}

	public void setEquipPurch(Double equipPurch) {
		this.equipPurch = equipPurch;
	}

	public Double getOtherCost() {
		return otherCost;
	}

	public void setOtherCost(Double otherCost) {
		this.otherCost = otherCost;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Double getTotalmoney() {
		return totalmoney;
	}

	public void setTotalmoney(Double totalmoney) {
		this.totalmoney = totalmoney;
	}

}
