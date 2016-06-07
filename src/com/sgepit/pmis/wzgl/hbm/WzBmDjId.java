package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzBmDjId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzBmDjId implements java.io.Serializable {

	// Fields

	private String bm;
	private Date dt;

	// Constructors

	/** default constructor */
	public WzBmDjId() {
	}

	/** full constructor */
	public WzBmDjId(String bm, Date dt) {
		this.bm = bm;
		this.dt = dt;
	}

	// Property accessors

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public Date getDt() {
		return this.dt;
	}

	public void setDt(Date dt) {
		this.dt = dt;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof WzBmDjId))
			return false;
		WzBmDjId castOther = (WzBmDjId) other;

		return ((this.getBm() == castOther.getBm()) || (this.getBm() != null
				&& castOther.getBm() != null && this.getBm().equals(
				castOther.getBm())))
				&& ((this.getDt() == castOther.getDt()) || (this.getDt() != null
						&& castOther.getDt() != null && this.getDt().equals(
						castOther.getDt())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + (getBm() == null ? 0 : this.getBm().hashCode());
		result = 37 * result + (getDt() == null ? 0 : this.getDt().hashCode());
		return result;
	}

}