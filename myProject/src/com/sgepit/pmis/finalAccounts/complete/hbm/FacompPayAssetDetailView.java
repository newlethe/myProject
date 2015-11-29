package com.sgepit.pmis.finalAccounts.complete.hbm;


/**
 * FacompPayAssetDetailView entity. @author MyEclipse Persistence Tools
 */

public class FacompPayAssetDetailView implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String fixedno;
	private String fixedname;
	private String typetreeid;
	private String remark;
	private String constructionUnit;
	private String unit;
	private Double num;
	private String deliveryUnit;
	private Double jzgcGcl;
	private Double jzgcCl;
	private Double azgcGcl;
	private Double azgcCl;
	private Double sbgzf;
	private Double qtfyOne;
	private Double qtfyTwo;
	private Double qttz;

	// Constructors

	/** default constructor */
	public FacompPayAssetDetailView() {
	}

	/** full constructor */
	public FacompPayAssetDetailView(String pid, String fixedno,
			String fixedname, String typetreeid, String remark,
			String constructionUnit, String unit, Double num,
			String deliveryUnit, Double jzgcGcl, Double jzgcCl,
			Double azgcGcl, Double azgcCl, Double sbgzf,
			Double qtfyOne, Double qtfyTwo, Double qttz) {
		this.pid = pid;
		this.fixedno = fixedno;
		this.fixedname = fixedname;
		this.typetreeid = typetreeid;
		this.remark = remark;
		this.constructionUnit = constructionUnit;
		this.unit = unit;
		this.num = num;
		this.deliveryUnit = deliveryUnit;
		this.jzgcGcl = jzgcGcl;
		this.jzgcCl = jzgcCl;
		this.azgcGcl = azgcGcl;
		this.azgcCl = azgcCl;
		this.sbgzf = sbgzf;
		this.qtfyOne = qtfyOne;
		this.qtfyTwo = qtfyTwo;
		this.qttz = qttz;
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

	public String getFixedno() {
		return this.fixedno;
	}

	public void setFixedno(String fixedno) {
		this.fixedno = fixedno;
	}

	public String getFixedname() {
		return this.fixedname;
	}

	public void setFixedname(String fixedname) {
		this.fixedname = fixedname;
	}

	public String getTypetreeid() {
		return this.typetreeid;
	}

	public void setTypetreeid(String typetreeid) {
		this.typetreeid = typetreeid;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getConstructionUnit() {
		return this.constructionUnit;
	}

	public void setConstructionUnit(String constructionUnit) {
		this.constructionUnit = constructionUnit;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getNum() {
		return num;
	}

	public void setNum(Double num) {
		this.num = num;
	}

	public String getDeliveryUnit() {
		return deliveryUnit;
	}

	public void setDeliveryUnit(String deliveryUnit) {
		this.deliveryUnit = deliveryUnit;
	}

	public Double getJzgcGcl() {
		return jzgcGcl;
	}

	public void setJzgcGcl(Double jzgcGcl) {
		this.jzgcGcl = jzgcGcl;
	}

	public Double getJzgcCl() {
		return jzgcCl;
	}

	public void setJzgcCl(Double jzgcCl) {
		this.jzgcCl = jzgcCl;
	}

	public Double getAzgcGcl() {
		return azgcGcl;
	}

	public void setAzgcGcl(Double azgcGcl) {
		this.azgcGcl = azgcGcl;
	}

	public Double getAzgcCl() {
		return azgcCl;
	}

	public void setAzgcCl(Double azgcCl) {
		this.azgcCl = azgcCl;
	}

	public Double getSbgzf() {
		return sbgzf;
	}

	public void setSbgzf(Double sbgzf) {
		this.sbgzf = sbgzf;
	}

	public Double getQtfyOne() {
		return qtfyOne;
	}

	public void setQtfyOne(Double qtfyOne) {
		this.qtfyOne = qtfyOne;
	}

	public Double getQtfyTwo() {
		return qtfyTwo;
	}

	public void setQtfyTwo(Double qtfyTwo) {
		this.qtfyTwo = qtfyTwo;
	}

	public Double getQttz() {
		return qttz;
	}

	public void setQttz(Double qttz) {
		this.qttz = qttz;
	}

	

}