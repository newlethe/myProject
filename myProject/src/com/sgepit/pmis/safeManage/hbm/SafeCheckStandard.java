package com.sgepit.pmis.safeManage.hbm;

/**
 * SafeCheckStandard entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeCheckStandard implements java.io.Serializable {

	// Fields

	private String id;
	private String subjectionId;
	private String contentData;
	private Double standardNum;

	// Constructors

	/** default constructor */
	public SafeCheckStandard() {
	}

	/** minimal constructor */
	public SafeCheckStandard(String id, String subjectionId, String contentData) {
		this.id = id;
		this.subjectionId = subjectionId;
		this.contentData = contentData;
	}

	/** full constructor */
	public SafeCheckStandard(String id, String subjectionId,
			String contentData, Double standardNum) {
		this.id = id;
		this.subjectionId = subjectionId;
		this.contentData = contentData;
		this.standardNum = standardNum;
	}

	// Property accessors

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSubjectionId() {
		return this.subjectionId;
	}

	public void setSubjectionId(String subjectionId) {
		this.subjectionId = subjectionId;
	}

	public String getContentData() {
		return this.contentData;
	}

	public void setContentData(String contentData) {
		this.contentData = contentData;
	}

	public Double getStandardNum() {
		return this.standardNum;
	}

	public void setStandardNum(Double standardNum) {
		this.standardNum = standardNum;
	}

}