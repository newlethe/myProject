package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompPayAssetDetailR entity. @author MyEclipse Persistence Tools
 */

public class FacompPayAssetDetailR implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String treeid;
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
	private Double dttz;
	private Double qttz;
	private String parentid;
	private Long isleaf;

	// Constructors

	/** default constructor */
	public FacompPayAssetDetailR() {
	}

	/** full constructor */
	public FacompPayAssetDetailR(String pid, String treeid, String fixedno,
			String fixedname, String typetreeid, String remark,
			String constructionUnit, String unit, Double num,
			String deliveryUnit, Double jzgcGcl, Double jzgcCl, Double azgcGcl,
			Double azgcCl, Double sbgzf, Double dttz, Double qttz,
			String parentid, Long isleaf) {
		this.pid = pid;
		this.treeid = treeid;
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
		this.dttz = dttz;
		this.qttz = qttz;
		this.parentid = parentid;
		this.isleaf = isleaf;
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
		return this.num;
	}

	public void setNum(Double num) {
		this.num = num;
	}

	public String getDeliveryUnit() {
		return this.deliveryUnit;
	}

	public void setDeliveryUnit(String deliveryUnit) {
		this.deliveryUnit = deliveryUnit;
	}

	public Double getJzgcGcl() {
		return this.jzgcGcl;
	}

	public void setJzgcGcl(Double jzgcGcl) {
		this.jzgcGcl = jzgcGcl;
	}

	public Double getJzgcCl() {
		return this.jzgcCl;
	}

	public void setJzgcCl(Double jzgcCl) {
		this.jzgcCl = jzgcCl;
	}

	public Double getAzgcGcl() {
		return this.azgcGcl;
	}

	public void setAzgcGcl(Double azgcGcl) {
		this.azgcGcl = azgcGcl;
	}

	public Double getAzgcCl() {
		return this.azgcCl;
	}

	public void setAzgcCl(Double azgcCl) {
		this.azgcCl = azgcCl;
	}

	public Double getSbgzf() {
		return this.sbgzf;
	}

	public void setSbgzf(Double sbgzf) {
		this.sbgzf = sbgzf;
	}

	public Double getDttz() {
		return this.dttz;
	}

	public void setDttz(Double dttz) {
		this.dttz = dttz;
	}

	public Double getQttz() {
		return this.qttz;
	}

	public void setQttz(Double qttz) {
		this.qttz = qttz;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

}