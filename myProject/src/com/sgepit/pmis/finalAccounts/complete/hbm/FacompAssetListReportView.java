package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * 已稽核的最大时间的工程量
 * @author pengy
 * @createtime 2013-08-30
 */

public class FacompAssetListReportView implements java.io.Serializable {

	// Fields

	private String proappid;
	private String bdgid;
	private String conid;
	private String prono;
	private String proname;
	private String pid;
	private String unit;
	private Double price;
	private Long isleaf;
	private String parent;
	private String treeid;
	private String constructionUnit;
	private String fixedAssetList;
	private Double tzwcGcl;
	private Double tzwcJe;
	private String isper;

	// Constructors

	/** default constructor */
	public FacompAssetListReportView() {
	}

	/** full constructor */
	public FacompAssetListReportView(String bdgid, String conid, String prono,
			String proname, String pid, String unit, Double price,
			Long isleaf, String parent, String treeid,
			String constructionUnit, String fixedAssetList, Double tzwcGcl,
			Double tzwcJe, String isper) {
		this.bdgid = bdgid;
		this.conid = conid;
		this.prono = prono;
		this.proname = proname;
		this.pid = pid;
		this.unit = unit;
		this.price = price;
		this.isleaf = isleaf;
		this.parent = parent;
		this.treeid = treeid;
		this.constructionUnit = constructionUnit;
		this.fixedAssetList = fixedAssetList;
		this.tzwcGcl = tzwcGcl;
		this.tzwcJe = tzwcJe;
		this.isper = isper;
	}

	// Property accessors

	public String getProappid() {
		return this.proappid;
	}

	public void setProappid(String proappid) {
		this.proappid = proappid;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getProno() {
		return this.prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

	public String getProname() {
		return this.proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getPrice() {
		return this.price;
	}

	public void setPrice(Double price) {
		this.price = price;
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

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getConstructionUnit() {
		return this.constructionUnit;
	}

	public void setConstructionUnit(String constructionUnit) {
		this.constructionUnit = constructionUnit;
	}

	public String getFixedAssetList() {
		return this.fixedAssetList;
	}

	public void setFixedAssetList(String fixedAssetList) {
		this.fixedAssetList = fixedAssetList;
	}

	public Double getTzwcGcl() {
		return tzwcGcl;
	}

	public void setTzwcGcl(Double tzwcGcl) {
		this.tzwcGcl = tzwcGcl;
	}

	public Double getTzwcJe() {
		return tzwcJe;
	}

	public void setTzwcJe(Double tzwcJe) {
		this.tzwcJe = tzwcJe;
	}

	public String getIsper() {
		return this.isper;
	}

	public void setIsper(String isper) {
		this.isper = isper;
	}

}