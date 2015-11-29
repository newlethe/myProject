package com.sgepit.frame.sysman.hbm;

/**
 * RockPowerUserFav entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockPowerUserFav implements java.io.Serializable {

	// Fields

	private RockPowerUserFavId id;
	private String powername;
	private Long ordercode;

	// Constructors

	/** default constructor */
	public RockPowerUserFav() {
	}

	/** minimal constructor */
	public RockPowerUserFav(RockPowerUserFavId id) {
		this.id = id;
	}

	/** full constructor */
	public RockPowerUserFav(RockPowerUserFavId id, String powername,
			Long ordercode) {
		this.id = id;
		this.powername = powername;
		this.ordercode = ordercode;
	}

	// Property accessors

	public RockPowerUserFavId getId() {
		return this.id;
	}

	public void setId(RockPowerUserFavId id) {
		this.id = id;
	}

	public String getPowername() {
		return this.powername;
	}

	public void setPowername(String powername) {
		this.powername = powername;
	}

	public Long getOrdercode() {
		return this.ordercode;
	}

	public void setOrdercode(Long ordercode) {
		this.ordercode = ordercode;
	}

}