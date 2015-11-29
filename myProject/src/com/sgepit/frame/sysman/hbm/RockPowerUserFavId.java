package com.sgepit.frame.sysman.hbm;

/**
 * RockPowerUserFavId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockPowerUserFavId implements java.io.Serializable {

	// Fields

	private String powerpk;
	private String userid;

	// Constructors

	/** default constructor */
	public RockPowerUserFavId() {
	}

	/** full constructor */
	public RockPowerUserFavId(String powerpk, String userid) {
		this.powerpk = powerpk;
		this.userid = userid;
	}

	// Property accessors

	public String getPowerpk() {
		return this.powerpk;
	}

	public void setPowerpk(String powerpk) {
		this.powerpk = powerpk;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof RockPowerUserFavId))
			return false;
		RockPowerUserFavId castOther = (RockPowerUserFavId) other;

		return ((this.getPowerpk() == castOther.getPowerpk()) || (this
				.getPowerpk() != null
				&& castOther.getPowerpk() != null && this.getPowerpk().equals(
				castOther.getPowerpk())))
				&& ((this.getUserid() == castOther.getUserid()) || (this
						.getUserid() != null
						&& castOther.getUserid() != null && this.getUserid()
						.equals(castOther.getUserid())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getPowerpk() == null ? 0 : this.getPowerpk().hashCode());
		result = 37 * result
				+ (getUserid() == null ? 0 : this.getUserid().hashCode());
		return result;
	}

}