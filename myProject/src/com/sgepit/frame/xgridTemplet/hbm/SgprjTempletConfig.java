package com.sgepit.frame.xgridTemplet.hbm;

/**
 * SgprjTempletConfig entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgprjTempletConfig implements java.io.Serializable {

	// Fields

	private String templetSn;
	private String templetType;
	private String sjType;
	private String unitId;
	private String category;
	private String templetFile;
	private String templetHeader;
	private String templetBegancell;
	private String note;

	// Constructors

	/** default constructor */
	public SgprjTempletConfig() {
	}

	/** minimal constructor */
	public SgprjTempletConfig(String templetSn) {
		this.templetSn = templetSn;
	}

	/** full constructor */
	public SgprjTempletConfig(String templetSn, String templetType,
			String sjType, String unitId, String category, String templetFile,
			String templetHeader, String templetBegancell, String note) {
		this.templetSn = templetSn;
		this.templetType = templetType;
		this.sjType = sjType;
		this.unitId = unitId;
		this.category = category;
		this.templetFile = templetFile;
		this.templetHeader = templetHeader;
		this.templetBegancell = templetBegancell;
		this.note = note;
	}

	// Property accessors

	public String getTempletSn() {
		return this.templetSn;
	}

	public void setTempletSn(String templetSn) {
		this.templetSn = templetSn;
	}

	public String getTempletType() {
		return this.templetType;
	}

	public void setTempletType(String templetType) {
		this.templetType = templetType;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getCategory() {
		return this.category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getTempletFile() {
		return this.templetFile;
	}

	public void setTempletFile(String templetFile) {
		this.templetFile = templetFile;
	}

	public String getTempletHeader() {
		return this.templetHeader;
	}

	public void setTempletHeader(String templetHeader) {
		this.templetHeader = templetHeader;
	}

	public String getTempletBegancell() {
		return this.templetBegancell;
	}

	public void setTempletBegancell(String templetBegancell) {
		this.templetBegancell = templetBegancell;
	}

	public String getNote() {
		return this.note;
	}

	public void setNote(String note) {
		this.note = note;
	}


}