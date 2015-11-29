package com.sgepit.pmis.wzgl.hbm;

/**
 * WzBmDj entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzBmDj implements java.io.Serializable {

	// Fields

	private WzBmDjId id;
	private Double dj;

	// Constructors

	/** default constructor */
	public WzBmDj() {
	}

	/** minimal constructor */
	public WzBmDj(WzBmDjId id) {
		this.id = id;
	}

	/** full constructor */
	public WzBmDj(WzBmDjId id, Double dj) {
		this.id = id;
		this.dj = dj;
	}

	// Property accessors

	public WzBmDjId getId() {
		return this.id;
	}

	public void setId(WzBmDjId id) {
		this.id = id;
	}

	public Double getDj() {
		return this.dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
	}

}