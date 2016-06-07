package com.sgepit.frame.flow.hbm;

/**
 * FlwMaterialRemove entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FlwMaterialRemove implements java.io.Serializable {

	// Fields

	private String removeid;
	private FlwInstance flwInstance;
	private String removeinfo;
	private String unremoveed;

	// Constructors

	/** default constructor */
	public FlwMaterialRemove() {
	}

	/** minimal constructor */
	public FlwMaterialRemove(String removeid, FlwInstance flwInstance,
			String removeinfo) {
		this.removeid = removeid;
		this.flwInstance = flwInstance;
		this.removeinfo = removeinfo;
	}

	/** full constructor */
	public FlwMaterialRemove(String removeid, FlwInstance flwInstance,
			String removeinfo, String unremoveed) {
		this.removeid = removeid;
		this.flwInstance = flwInstance;
		this.removeinfo = removeinfo;
		this.unremoveed = unremoveed;
	}

	// Property accessors

	public String getRemoveid() {
		return this.removeid;
	}

	public void setRemoveid(String removeid) {
		this.removeid = removeid;
	}

	public FlwInstance getFlwInstance() {
		return this.flwInstance;
	}

	public void setFlwInstance(FlwInstance flwInstance) {
		this.flwInstance = flwInstance;
	}

	public String getRemoveinfo() {
		return this.removeinfo;
	}

	public void setRemoveinfo(String removeinfo) {
		this.removeinfo = removeinfo;
	}

	public String getUnremoveed() {
		return this.unremoveed;
	}

	public void setUnremoveed(String unremoveed) {
		this.unremoveed = unremoveed;
	}

}