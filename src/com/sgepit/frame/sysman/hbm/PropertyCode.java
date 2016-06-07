package com.sgepit.frame.sysman.hbm;

/**
 * PropertyCode entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PropertyCode implements java.io.Serializable {

	// Fields

	private String uids;
	private String propertyCode;
	private String typeName;
	private String propertyName;
	private String moduleName;
	private String detailType;
	private Long itemId;
	private String col1;
	private String col2;
	private String col3;

	// Constructors

	/** default constructor */
	public PropertyCode() {
	}

	/** minimal constructor */
	public PropertyCode(String propertyCode, String typeName) {
		this.propertyCode = propertyCode;
		this.typeName = typeName;
	}

	/** full constructor */
	public PropertyCode(String propertyCode, String typeName,
			String propertyName, String moduleName, String detailType,
			Long itemId, String col1, String col2, String col3) {
		this.propertyCode = propertyCode;
		this.typeName = typeName;
		this.propertyName = propertyName;
		this.moduleName = moduleName;
		this.detailType = detailType;
		this.itemId = itemId;
		this.col1 = col1;
		this.col2 = col2;
		this.col3 = col3;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPropertyCode() {
		return this.propertyCode;
	}

	public void setPropertyCode(String propertyCode) {
		this.propertyCode = propertyCode;
	}

	public String getTypeName() {
		return this.typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getPropertyName() {
		return this.propertyName;
	}

	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}

	public String getModuleName() {
		return this.moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public String getDetailType() {
		return this.detailType;
	}

	public void setDetailType(String detailType) {
		this.detailType = detailType;
	}

	public Long getItemId() {
		return this.itemId;
	}

	public void setItemId(Long itemId) {
		this.itemId = itemId;
	}

	public String getCol1() {
		return this.col1;
	}

	public void setCol1(String col1) {
		this.col1 = col1;
	}

	public String getCol2() {
		return this.col2;
	}

	public void setCol2(String col2) {
		this.col2 = col2;
	}

	public String getCol3() {
		return this.col3;
	}

	public void setCol3(String col3) {
		this.col3 = col3;
	}

}