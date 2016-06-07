package com.sgepit.frame.sysman.hbm;

/**
 * RockRole entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockRole implements java.io.Serializable {

	// Fields

	private String rolepk;
	private String rolename;
	private String remark;
	private String unitId;
	private String roletype;

	// Constructors

	/** default constructor */
	public RockRole() {
	}

	/** minimal constructor */
	public RockRole(String rolename) {
		this.rolename = rolename;
	}

	/** full constructor */
	public RockRole(String rolename, String remark, String unitId,
			String roletype) {
		this.rolename = rolename;
		this.remark = remark;
		this.unitId = unitId;
		this.roletype = roletype;
	}

	// Property accessors

	public String getRolepk() {
		return this.rolepk;
	}

	public void setRolepk(String rolepk) {
		this.rolepk = rolepk;
	}

	public String getRolename() {
		return this.rolename;
	}

	public void setRolename(String rolename) {
		this.rolename = rolename;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getRoletype() {
		return this.roletype;
	}

	public void setRoletype(String roletype) {
		this.roletype = roletype;
	}

}