package com.sgepit.frame.example.hbm;

/**
 * ExampleParenttable entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ExampleParenttable implements java.io.Serializable {

	// Fields

	private String lsh;
	private String title;
	private String categoryid;

	// Constructors

	/** default constructor */
	public ExampleParenttable() {
	}

	/** minimal constructor */
	public ExampleParenttable(String lsh) {
		this.lsh = lsh;
	}

	/** full constructor */
	public ExampleParenttable(String lsh, String title, String categoryid) {
		this.lsh = lsh;
		this.title = title;
		this.categoryid = categoryid;
	}

	// Property accessors

	public String getLsh() {
		return this.lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCategoryid() {
		return this.categoryid;
	}

	public void setCategoryid(String categoryid) {
		this.categoryid = categoryid;
	}

}