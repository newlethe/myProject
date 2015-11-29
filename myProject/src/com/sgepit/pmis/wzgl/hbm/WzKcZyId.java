package com.sgepit.pmis.wzgl.hbm;

/**
 * WzKcZyId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzKcZyId implements java.io.Serializable {

	// Fields

	private String bh;
	private String bm;	
	private String fpbh;
	

	// Constructors

	/** default constructor */
	public WzKcZyId() {
	}

	/** full constructor */
	public WzKcZyId(String bh, String bm,  String fpbh) {
		this.bh = bh;
		this.bm = bm;
		this.fpbh = fpbh;
	}

	// Property accessors

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}


	public String getFpbh() {
		return this.fpbh;
	}

	public void setFpbh(String fpbh) {
		this.fpbh = fpbh;
	}

	
	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof WzKcZyId))
			return false;
		WzKcZyId castOther = (WzKcZyId) other;

		return ((this.getBh() == castOther.getBh()) || (this.getBh() != null
				&& castOther.getBh() != null && this.getBh().equals(
				castOther.getBh())))
				&& ((this.getBm() == castOther.getBm()) || (this.getBm() != null
						&& castOther.getBm() != null && this.getBm().equals(
						castOther.getBm())))
				
				&& ((this.getFpbh() == castOther.getFpbh()) || (this.getFpbh() != null
						&& castOther.getFpbh() != null && this.getFpbh()
						.equals(castOther.getFpbh())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + (getBh() == null ? 0 : this.getBh().hashCode());
		result = 37 * result + (getBm() == null ? 0 : this.getBm().hashCode());
		
		result = 37 * result
				+ (getFpbh() == null ? 0 : this.getFpbh().hashCode());
		
		return result;
	}

}