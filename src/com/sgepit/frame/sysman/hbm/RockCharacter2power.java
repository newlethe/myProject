package com.sgepit.frame.sysman.hbm;

/**
 * RockCharacter2power entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockCharacter2power implements java.io.Serializable {

	// Fields

	private String uids;
	private String powerpk;
	private String rolepk;
	private Integer lvl;

	// Constructors

	/** default constructor */
	public RockCharacter2power() {
	}

	/** full constructor */
	public RockCharacter2power(String powerpk, String rolepk, Integer lvl) {
		this.powerpk = powerpk;
		this.rolepk = rolepk;
		this.lvl = lvl;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPowerpk() {
		return this.powerpk;
	}

	public void setPowerpk(String powerpk) {
		this.powerpk = powerpk;
	}

	public String getRolepk() {
		return this.rolepk;
	}

	public void setRolepk(String rolepk) {
		this.rolepk = rolepk;
	}

	public Integer getLvl() {
		return this.lvl;
	}

	public void setLvl(Integer lvl) {
		this.lvl = lvl;
	}

}