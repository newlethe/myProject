package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompFixedAsset entity. @author MyEclipse Persistence Tools
 */

public class FacompFixedAsset implements java.io.Serializable {

	// Fields

	/**
	 * 
	 */
	private static long serialVersionUID = 1L;
	private String uids;
	private String pid;
	private String treeuids;
	private String treeid;
	private String fixedno;
	private String fixedname;
	private String typetreeuids;
	private String typetreeid;
	private String remark;
	private String constructionUnit;
	private String deliveryUnit;
	private String unit;
	private Double num;
	
	private String jgcc;
	private String scwz;
	
	private Double jzgcGcl;
	private Double jzgcCl;
	private Double azgcGcl;
	private Double azgcCl;
	
	private Double sbgzf;
	private Double qtfyOne;
	private Double qtfyTwo;
	
	
	// Constructors

	/** default constructor */
	public FacompFixedAsset() {
	}

	/** full constructor */
	public FacompFixedAsset(String pid, String treeuids, String treeid,
			String fixedno, String fixedname, String typetreeuids,
			String typetreeid, String remark, String constructionUnit,
			String deliveryUnit, String unit, Double num, Double jzgcGcl,
			Double jzgcCl, Double azgcGcl, Double azgcCl,
			Double sbgzf, Double qtfyOne, Double qtfyTwo,
			String jgcc, String scwz
			) {
		super();
		this.pid = pid;
		this.treeuids = treeuids;
		this.treeid = treeid;
		this.fixedno = fixedno;
		this.fixedname = fixedname;
		this.typetreeuids = typetreeuids;
		this.typetreeid = typetreeid;
		this.remark = remark;
		this.constructionUnit = constructionUnit;
		this.deliveryUnit = deliveryUnit;
		this.unit = unit;
		this.num = num;
		this.jzgcGcl = jzgcGcl;
		this.jzgcCl = jzgcCl;
		this.azgcGcl = azgcGcl;
		this.azgcCl = azgcCl;
		this.sbgzf = sbgzf;
		this.qtfyOne = qtfyOne;
		this.qtfyTwo = qtfyTwo;
		this.jgcc = jgcc;
		this.scwz = scwz;
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

	public String getTreeuids() {
		return this.treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
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

	public String getTypetreeuids() {
		return this.typetreeuids;
	}

	public void setTypetreeuids(String typetreeuids) {
		this.typetreeuids = typetreeuids;
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

	public String getJgcc() {
		return jgcc;
	}

	public void setJgcc(String jgcc) {
		this.jgcc = jgcc;
	}

	public String getScwz() {
		return scwz;
	}

	public void setScwz(String scwz) {
		this.scwz = scwz;
	}

}