package com.sgepit.pmis.wzgl.hbm;

/**
 * WzOutputId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzOutputId implements java.io.Serializable {

	// Fields

	private String uids;
	private String billname;

	// Constructors

	/** default constructor */
	public WzOutputId() {
	}

	/** full constructor */
	public WzOutputId(String uids, String billname) {
		this.uids = uids;
		this.billname = billname;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getBillname() {
		return this.billname;
	}

	public void setBillname(String billname) {
		this.billname = billname;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof WzOutputId))
			return false;
		WzOutputId castOther = (WzOutputId) other;

		return ((this.getUids() == castOther.getUids()) || (this.getUids() != null
				&& castOther.getUids() != null && this.getUids().equals(
				castOther.getUids())))
				&& ((this.getBillname() == castOther.getBillname()) || (this
						.getBillname() != null
						&& castOther.getBillname() != null && this
						.getBillname().equals(castOther.getBillname())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getUids() == null ? 0 : this.getUids().hashCode());
		result = 37 * result
				+ (getBillname() == null ? 0 : this.getBillname().hashCode());
		return result;
	}

}