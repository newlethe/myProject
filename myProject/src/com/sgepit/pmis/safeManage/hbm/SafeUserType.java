package com.sgepit.pmis.safeManage.hbm;

/**
 * SafeUserType entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeUserType implements java.io.Serializable {

	// Fields

	private String id;
	private String name;
	private String parent;
	private Long isleaf;

	// Constructors

	/** default constructor */
	public SafeUserType() {
	}

	/** minimal constructor */
	public SafeUserType(String id) {
		this.id = id;
	}

	/** full constructor */
	public SafeUserType(String id, String name, String parent, Long isleaf) {
		this.id = id;
		this.name = name;
		this.parent = parent;
		this.isleaf = isleaf;
	}

	// Property accessors

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

}