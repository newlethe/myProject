package com.sgepit.pmis.equipment.hbm;

/**
 * EquPackStyle entity. @author MyEclipse Persistence Tools
 */

public class EquPackStyle implements java.io.Serializable {

	// Fields

	private String puuid;
	private String packstyle;
	private String packcategory;
	private String description;
	private String pid;

	// Constructors

	/** default constructor */
	public EquPackStyle() {
	}

	/** minimal constructor */
	public EquPackStyle(String packstyle, String packcategory, String pid) {
		this.packstyle = packstyle;
		this.packcategory = packcategory;
		this.pid = pid;
	}

	/** full constructor */
	public EquPackStyle(String packstyle, String packcategory,
			String description, String pid) {
		this.packstyle = packstyle;
		this.packcategory = packcategory;
		this.description = description;
		this.pid = pid;
	}

	// Property accessors

	public String getPuuid() {
		return this.puuid;
	}

	public void setPuuid(String puuid) {
		this.puuid = puuid;
	}


	public String getPackstyle() {
		return this.packstyle;
	}

	public void setPackstyle(String packstyle) {
		this.packstyle = packstyle;
	}

	public String getPackcategory() {
		return this.packcategory;
	}

	public void setPackcategory(String packcategory) {
		this.packcategory = packcategory;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}