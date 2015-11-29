package com.sgepit.pmis.wzgl.hbm;

/**
 * WzKcZy entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzKcZy implements java.io.Serializable {

	// Fields

	private WzKcZyId id;
	private Double sl;
	private String ifZy;

	// Constructors

	/** default constructor */
	public WzKcZy() {
	}

	/** full constructor */
	public WzKcZy(WzKcZyId id) {
		this.id = id;
	}

	// Property accessors

	public WzKcZyId getId() {
		return this.id;
	}

	public void setId(WzKcZyId id) {
		this.id = id;
	}

	public Double getSl() {
		return sl;
	}

	public void setSl(Double sl) {
		this.sl = sl;
	}

	public String getIfZy() {
		return ifZy;
	}

	public void setIfZy(String ifZy) {
		this.ifZy = ifZy;
	}

}