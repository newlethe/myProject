package com.sgepit.frame.sysman.hbm;

/**
 * RockPosition entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockPosition implements java.io.Serializable {

	// Fields

	private String posid;
	private String posname;
	private String description;
	private String poslevel;
	private String unitid;

	// Constructors

	/** default constructor */
	public RockPosition() {
	}

	/** minimal constructor */
	public RockPosition(String posname) {
		this.posname = posname;
	}

	/** full constructor */
	public RockPosition(String posname, String description, String poslevel) {
		this.posname = posname;
		this.description = description;
		this.poslevel = poslevel;
	}

	// Property accessors

	public String getPosid() {
		return this.posid;
	}

	public void setPosid(String posid) {
		this.posid = posid;
	}

	public String getPosname() {
		return this.posname;
	}

	public void setPosname(String posname) {
		this.posname = posname;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPoslevel() {
		return this.poslevel;
	}

	public void setPoslevel(String poslevel) {
		this.poslevel = poslevel;
	}

	public String getUnitid() {
		return unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}
	

}