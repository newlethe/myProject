package com.sgepit.frame.example.hbm;

/**
 * ExampleChildtable entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ExampleChildtable implements java.io.Serializable {

	// Fields

	private String lsh;
	private String title;
	private String parentLsh;

	// Constructors

	/** default constructor */
	public ExampleChildtable() {
	}

	/** minimal constructor */
	public ExampleChildtable(String lsh) {
		this.lsh = lsh;
	}

	/** full constructor */
	public ExampleChildtable(String lsh, String title, String parentLsh) {
		this.lsh = lsh;
		this.title = title;
		this.parentLsh = parentLsh;
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

	public String getParentLsh() {
		return this.parentLsh;
	}

	public void setParentLsh(String parentLsh) {
		this.parentLsh = parentLsh;
	}

}