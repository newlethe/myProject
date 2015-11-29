package com.sgepit.frame.guideline.hbm;

/**
 * SgccGuidelineInfoXdId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccGuidelineInfoXdId implements java.io.Serializable {

	// Fields

	private String zbSeqno;
	private String unitid;

	// Constructors

	/** default constructor */
	public SgccGuidelineInfoXdId() {
	}

	/** full constructor */
	public SgccGuidelineInfoXdId(String zbSeqno, String unitid) {
		this.zbSeqno = zbSeqno;
		this.unitid = unitid;
	}

	// Property accessors

	public String getZbSeqno() {
		return this.zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
	}

	public String getUnitid() {
		return this.unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof SgccGuidelineInfoXdId))
			return false;
		SgccGuidelineInfoXdId castOther = (SgccGuidelineInfoXdId) other;

		return ((this.getZbSeqno() == castOther.getZbSeqno()) || (this
				.getZbSeqno() != null
				&& castOther.getZbSeqno() != null && this.getZbSeqno().equals(
				castOther.getZbSeqno())))
				&& ((this.getUnitid() == castOther.getUnitid()) || (this
						.getUnitid() != null
						&& castOther.getUnitid() != null && this.getUnitid()
						.equals(castOther.getUnitid())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getZbSeqno() == null ? 0 : this.getZbSeqno().hashCode());
		result = 37 * result
				+ (getUnitid() == null ? 0 : this.getUnitid().hashCode());
		return result;
	}

}