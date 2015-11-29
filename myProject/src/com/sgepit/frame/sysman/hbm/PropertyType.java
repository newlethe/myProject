package com.sgepit.frame.sysman.hbm;

/**
 * PropertyType entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PropertyType implements java.io.Serializable {

	// Fields

	private String uids;
	private String typeName;
	private String moduleName;
	private Long xh;

	// Constructors

	/** default constructor */
	public PropertyType() {
	}

	/** minimal constructor */
	public PropertyType(String typeName) {
		this.typeName = typeName;
	}

	/** full constructor */
	public PropertyType(String typeName, String moduleName, Long xh) {
		this.typeName = typeName;
		this.moduleName = moduleName;
		this.xh = xh;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTypeName() {
		return this.typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getModuleName() {
		return this.moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public Long getXh() {
		return this.xh;
	}

	public void setXh(Long xh) {
		this.xh = xh;
	}

}