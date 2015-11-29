package com.sgepit.frame.dataexchange.hbm;

/**
 * VPcUserTabCols entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcUserTabCols implements java.io.Serializable {

	// Fields

	private VPcUserTabColsId id;

	// Constructors

	/** default constructor */
	public VPcUserTabCols() {
	}

	/** full constructor */
	public VPcUserTabCols(VPcUserTabColsId id) {
		this.id = id;
	}

	// Property accessors

	public VPcUserTabColsId getId() {
		return this.id;
	}

	public void setId(VPcUserTabColsId id) {
		this.id = id;
	}

}