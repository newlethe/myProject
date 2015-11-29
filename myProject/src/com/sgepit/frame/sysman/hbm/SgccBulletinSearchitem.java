package com.sgepit.frame.sysman.hbm;

/**
 * SgccBulletinSearchitem entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccBulletinSearchitem implements java.io.Serializable {

	// Fields

	private SgccBulletinSearchitemId id;
	private String searchName;
	private String bulletinId;
	private String searchType;
	private String colId;
	private String guidelineId;
	private String searchTime;
	private String unitid;
	private String searchSql;
	private String whereCondition;
	private String recordType;
	private Long colDigit;
	private String codeType;

	// Constructors

	/** default constructor */
	public SgccBulletinSearchitem() {
	}

	/** minimal constructor */
	public SgccBulletinSearchitem(SgccBulletinSearchitemId id, String searchType) {
		this.id = id;
		this.searchType = searchType;
	}

	/** full constructor */
	public SgccBulletinSearchitem(SgccBulletinSearchitemId id,
			String searchName, String bulletinId, String searchType,
			String colId, String guidelineId, String searchTime, String unitid,
			String searchSql, String whereCondition, String recordType,
			Long colDigit, String codeType) {
		this.id = id;
		this.searchName = searchName;
		this.bulletinId = bulletinId;
		this.searchType = searchType;
		this.colId = colId;
		this.guidelineId = guidelineId;
		this.searchTime = searchTime;
		this.unitid = unitid;
		this.searchSql = searchSql;
		this.whereCondition = whereCondition;
		this.recordType = recordType;
		this.colDigit = colDigit;
		this.codeType = codeType;
	}

	// Property accessors

	public SgccBulletinSearchitemId getId() {
		return this.id;
	}

	public void setId(SgccBulletinSearchitemId id) {
		this.id = id;
	}

	public String getSearchName() {
		return this.searchName;
	}

	public void setSearchName(String searchName) {
		this.searchName = searchName;
	}

	public String getBulletinId() {
		return this.bulletinId;
	}

	public void setBulletinId(String bulletinId) {
		this.bulletinId = bulletinId;
	}

	public String getSearchType() {
		return this.searchType;
	}

	public void setSearchType(String searchType) {
		this.searchType = searchType;
	}

	public String getColId() {
		return this.colId;
	}

	public void setColId(String colId) {
		this.colId = colId;
	}

	public String getGuidelineId() {
		return this.guidelineId;
	}

	public void setGuidelineId(String guidelineId) {
		this.guidelineId = guidelineId;
	}

	public String getSearchTime() {
		return this.searchTime;
	}

	public void setSearchTime(String searchTime) {
		this.searchTime = searchTime;
	}

	public String getUnitid() {
		return this.unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

	public String getSearchSql() {
		return this.searchSql;
	}

	public void setSearchSql(String searchSql) {
		this.searchSql = searchSql;
	}

	public String getWhereCondition() {
		return this.whereCondition;
	}

	public void setWhereCondition(String whereCondition) {
		this.whereCondition = whereCondition;
	}

	public String getRecordType() {
		return this.recordType;
	}

	public void setRecordType(String recordType) {
		this.recordType = recordType;
	}

	public Long getColDigit() {
		return this.colDigit;
	}

	public void setColDigit(Long colDigit) {
		this.colDigit = colDigit;
	}

	public String getCodeType() {
		return this.codeType;
	}

	public void setCodeType(String codeType) {
		this.codeType = codeType;
	}

}