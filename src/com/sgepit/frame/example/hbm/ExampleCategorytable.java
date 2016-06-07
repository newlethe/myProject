package com.sgepit.frame.example.hbm;

/**
 * ExampleCategorytable entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ExampleCategorytable implements java.io.Serializable {

	// Fields

	private String categoryid;
	private String categorycode;
	private String categoryname;
	private String parentid;
	public Integer isleaf;

	// Constructors

	/** default constructor */
	public ExampleCategorytable() {
	}

	/** minimal constructor */
	public ExampleCategorytable(String categoryid) {
		this.categoryid = categoryid;
	}

	/** full constructor */
	public ExampleCategorytable(String categoryid, String categorycode,
			String categoryname, String parentid) {
		this.categoryid = categoryid;
		this.categorycode = categorycode;
		this.categoryname = categoryname;
		this.parentid = parentid;
	}

	// Property accessors

	public String getCategoryid() {
		return this.categoryid;
	}

	public void setCategoryid(String categoryid) {
		this.categoryid = categoryid;
	}

	public String getCategorycode() {
		return this.categorycode;
	}

	public void setCategorycode(String categorycode) {
		this.categorycode = categorycode;
	}

	public String getCategoryname() {
		return this.categoryname;
	}

	public void setCategoryname(String categoryname) {
		this.categoryname = categoryname;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Integer getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Integer isleaf) {
		this.isleaf = isleaf;
	}

}