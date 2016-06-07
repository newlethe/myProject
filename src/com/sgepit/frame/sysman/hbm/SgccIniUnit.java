package com.sgepit.frame.sysman.hbm;


/**
 * SgccIniUnit entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccIniUnit implements java.io.Serializable {

	// Fields
	private String id;
	private String unitid;
	private String unitname;
	private String upunit;
	private String remark;
	private String unitTypeId;
	private Integer viewOrderNum;
	private String appUrl;
	private String deptTypeId;
	private String curUnitFlag;
	private String upCsUnitid;
	private String downCsUnitid;
	private String exchangeUnitid;
	private String attachUnitid;
	private Integer leaf;
	private String startYear;
	private String endYear;
	private String state;

	/*
	 *	是否股份公司 
	 */
	private String jointStock;
	// Constructors

	/** default constructor */
	public SgccIniUnit() {
	}

	/** minimal constructor */
	public SgccIniUnit(String unitname) {
		this.unitname = unitname;
	}

	/** full constructor */
	public SgccIniUnit(String unitname, String upunit, String remark,
			String unitTypeId, Integer viewOrderNum, String appUrl,
			String deptTypeId, String curUnitFlag, String upCsUnitid,
			String downCsUnitid, String exchangeUnitid, String attachUnitid) {
		this.unitname = unitname;
		this.upunit = upunit;
		this.remark = remark;
		this.unitTypeId = unitTypeId;
		this.viewOrderNum = viewOrderNum;
		this.appUrl = appUrl;
		this.deptTypeId = deptTypeId;
		this.curUnitFlag = curUnitFlag;
		this.upCsUnitid = upCsUnitid;
		this.downCsUnitid = downCsUnitid;
		this.exchangeUnitid = exchangeUnitid;
		this.attachUnitid = attachUnitid;
	}

	// Property accessors

	public String getUnitid() {
		return this.unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

	public String getUnitname() {
		return this.unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getUpunit() {
		return this.upunit;
	}

	public void setUpunit(String upunit) {
		this.upunit = upunit;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getUnitTypeId() {
		return this.unitTypeId;
	}

	public void setUnitTypeId(String unitTypeId) {
		this.unitTypeId = unitTypeId;
	}

	public Integer getViewOrderNum() {
		return this.viewOrderNum;
	}

	public void setViewOrderNum(Integer viewOrderNum) {
		this.viewOrderNum = viewOrderNum;
	}

	public String getAppUrl() {
		return this.appUrl;
	}

	public void setAppUrl(String appUrl) {
		this.appUrl = appUrl;
	}

	public String getDeptTypeId() {
		return this.deptTypeId;
	}

	public void setDeptTypeId(String deptTypeId) {
		this.deptTypeId = deptTypeId;
	}

	public String getCurUnitFlag() {
		return this.curUnitFlag;
	}

	public void setCurUnitFlag(String curUnitFlag) {
		this.curUnitFlag = curUnitFlag;
	}

	public String getUpCsUnitid() {
		return this.upCsUnitid;
	}

	public void setUpCsUnitid(String upCsUnitid) {
		this.upCsUnitid = upCsUnitid;
	}

	public String getDownCsUnitid() {
		return this.downCsUnitid;
	}

	public void setDownCsUnitid(String downCsUnitid) {
		this.downCsUnitid = downCsUnitid;
	}

	public String getExchangeUnitid() {
		return this.exchangeUnitid;
	}

	public void setExchangeUnitid(String exchangeUnitid) {
		this.exchangeUnitid = exchangeUnitid;
	}

	public String getAttachUnitid() {
		return this.attachUnitid;
	}

	public void setAttachUnitid(String attachUnitid) {
		this.attachUnitid = attachUnitid;
	}

	public Integer getLeaf() {
		return leaf;
	}
	public void setLeaf(Integer leaf) {
		this.leaf = leaf;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the startYear
	 */
	public String getStartYear() {
		return startYear;
	}

	/**
	 * @param startYear the startYear to set
	 */
	public void setStartYear(String startYear) {
		this.startYear = startYear;
	}

	/**
	 * @return the endYear
	 */
	public String getEndYear() {
		return endYear;
	}

	/**
	 * @param endYear the endYear to set
	 */
	public void setEndYear(String endYear) {
		this.endYear = endYear;
	}

	/**
	 * @return the state
	 */
	public String getState() {
		return state;
	}

	/**
	 * @param state the state to set
	 */
	public void setState(String state) {
		this.state = state;
	}

	public String getJointStock() {
		return jointStock;
	}

	public void setJointStock(String jointStock) {
		this.jointStock = jointStock;
	}

}