package com.sgepit.frame.sysman.hbm;

/**
 * SgccBulletinSearchitemId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccBulletinSearchitemId implements java.io.Serializable {

	// Fields

	private String searchCode;
	private String templeteId;

	// Constructors

	/** default constructor */
	public SgccBulletinSearchitemId() {
	}

	/** full constructor */
	public SgccBulletinSearchitemId(String searchCode,
			String templeteId) {
		this.searchCode = searchCode;
		this.templeteId = templeteId;
	}

	// Property accessors

	public String getSearchCode() {
		return this.searchCode;
	}

	public void setSearchCode(String searchCode) {
		this.searchCode = searchCode;
	}

	

	public String getTempleteId() {
		return templeteId;
		
	}

	public void setTempleteId(String templeteId) {
		this.templeteId = templeteId;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof SgccBulletinSearchitemId))
			return false;
		SgccBulletinSearchitemId castOther = (SgccBulletinSearchitemId) other;

		return ((this.getSearchCode() == castOther.getSearchCode()) || (this
				.getSearchCode() != null
				&& castOther.getSearchCode() != null && this.getSearchCode()
				.equals(castOther.getSearchCode())))
				&& ((this.getTempleteId() == castOther
						.getTempleteId()) || (this
						.getTempleteId() != null
						&& castOther.getTempleteId() != null && this
						.getTempleteId().equals(
								castOther.getTempleteId())));
	}

	public int hashCode() {
		int result = 17;

		result = 37
				* result
				+ (getSearchCode() == null ? 0 : this.getSearchCode()
						.hashCode());
		result = 37
				* result
				+ (getTempleteId() == null ? 0 : this
						.getTempleteId().hashCode());
		return result;
	}

}