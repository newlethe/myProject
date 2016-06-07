package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompFixedBdgProjectView entity. @author MyEclipse Persistence Tools
 */

public class FacompFixedBdgProjectView implements java.io.Serializable {

	// Fields

	private static final long serialVersionUID = 1L;
	private String proappid;
	private String pid;
	private String conid;
	private String bdgid;
	private String prono;
	private String proname;
	private String unit;
	private Double price;
	private String parent;
	private Long isleaf;
	private String treeid;
	private String constructionUnit;
	private Double tzwcGcl;
	private Double tzwcJe;
	private String fixeduids;
	private Double gcl;
	private Double je;
	private String isper;
	private String bdgidtype;

	// Constructors

	/** default constructor */
	public FacompFixedBdgProjectView() {
	}

	/** full constructor */
	public FacompFixedBdgProjectView(String pid, String conid, String bdgid,
			String prono, String proname, String unit, Double price,
			String parent, Long isleaf, String treeid,
			String constructionUnit, Double tzwcGcl, Double tzwcJe,
			String fixeduids, Double gcl, Double je, String isper, String bdgidtype) {
		super();
		this.pid = pid;
		this.conid = conid;
		this.bdgid = bdgid;
		this.prono = prono;
		this.proname = proname;
		this.unit = unit;
		this.price = price;
		this.parent = parent;
		this.isleaf = isleaf;
		this.treeid = treeid;
		this.constructionUnit = constructionUnit;
		this.tzwcGcl = tzwcGcl;
		this.tzwcJe = tzwcJe;
		this.fixeduids = fixeduids;
		this.gcl = gcl;
		this.je = je;
		this.isper = isper;
		this.bdgidtype = bdgidtype;
	}

	
	// Property accessors
	
	public String getProappid() {
		return proappid;
	}

	public void setProappid(String proappid) {
		this.proappid = proappid;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBdgid() {
		return bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getProno() {
		return prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

	public String getProname() {
		return proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getTreeid() {
		return treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getConstructionUnit() {
		return constructionUnit;
	}

	public void setConstructionUnit(String constructionUnit) {
		this.constructionUnit = constructionUnit;
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

	public String getFixeduids() {
		return fixeduids;
	}

	public void setFixeduids(String fixeduids) {
		this.fixeduids = fixeduids;
	}

	public Double getGcl() {
		return gcl;
	}

	public void setGcl(Double gcl) {
		this.gcl = gcl;
	}

	public Double getJe() {
		return je;
	}

	public void setJe(Double je) {
		this.je = je;
	}

	public String getIsper() {
		return isper;
	}

	public void setIsper(String isper) {
		this.isper = isper;
	}

	public String getBdgidtype() {
		return bdgidtype;
	}

	public void setBdgidtype(String bdgidtype) {
		this.bdgidtype = bdgidtype;
	}


}