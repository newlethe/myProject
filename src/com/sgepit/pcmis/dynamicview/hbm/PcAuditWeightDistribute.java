package com.sgepit.pcmis.dynamicview.hbm;

/**
 * PcAuditWeightDistribute entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcAuditWeightDistribute implements java.io.Serializable {

	// Fields

	private String uids;
	private String modName;
	private Double weightValue;
	private String sjType;

	// Constructors

	/** default constructor */
	public PcAuditWeightDistribute() {
	}

	/** minimal constructor */
	public PcAuditWeightDistribute(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public PcAuditWeightDistribute(String uids, String modName,
			Double weightValue, String sjType) {
		this.uids = uids;
		this.modName = modName;
		this.weightValue = weightValue;
		this.sjType = sjType;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getModName() {
		return this.modName;
	}

	public void setModName(String modName) {
		this.modName = modName;
	}

	public Double getWeightValue() {
		return this.weightValue;
	}

	public void setWeightValue(Double weightValue) {
		this.weightValue = weightValue;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

}