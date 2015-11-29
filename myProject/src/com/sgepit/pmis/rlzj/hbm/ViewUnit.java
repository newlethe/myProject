package com.sgepit.pmis.rlzj.hbm;

import java.math.BigDecimal;

/**
 * ViewUnit entity. @author MyEclipse Persistence Tools
 */

public class ViewUnit implements java.io.Serializable {

	// Fields
	/**
	 * 流水号
	 */
	private String uids;
	/**
	 * 组织编号
	 */
	private String code;
	/**
	 *  组织名称
	 */
	private String realname;
	/**
	 * 父节点流水号
	 */
	private String parentUids;
	/**
	 * 排序号
	 */
	private BigDecimal orderNum;
	/**
	 *  状态（1：正常；0：停用）
	 */
	private String state;
	/**
	 *   组织类型编号（对应系统属性表中配置）.单位类型(国网总部及网省公司1/国网直属2/部门0/区域公司3/地市公司6/岗位9/地市公司分局7)
	 */
	private String unitTypeId;
	/**
	 *  组织的app地址
	 */
	private String appUrl;
	/**
	 * 当前组织标记.当前单位标记 
	 */
	private String curUnitFlag;
	/**
	 * 如果是部门或岗位，该字段表示部门或岗位所属单位的组织流水号.如果是部门或岗位，该字段表示部门或岗位所属单位的单位id 
	 */
	private String attachUnitUids;

	// Constructors

	/** default constructor */
	public ViewUnit() {
	}

	/** minimal constructor */
	public ViewUnit(String uids, String code, String state) {
		this.uids = uids;
		this.code = code;
		this.state = state;
	}

	/** full constructor */
	public ViewUnit(String uids, String code, String realname, String parentUids,
			BigDecimal orderNum, String state, String unitTypeId,
			String appUrl, String curUnitFlag, String attachUnitUids) {
		super();
		this.uids = uids;
		this.code = code;
		this.realname = realname;
		this.parentUids = parentUids;
		this.orderNum = orderNum;
		this.state = state;
		this.unitTypeId = unitTypeId;
		this.appUrl = appUrl;
		this.curUnitFlag = curUnitFlag;
		this.attachUnitUids = attachUnitUids;
	}

	// Property accessors
	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getRealname() {
		return this.realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getParentUids() {
		return this.parentUids;
	}

	public void setParentUids(String parentUids) {
		this.parentUids = parentUids;
	}

	public BigDecimal getOrderNum() {
		return this.orderNum;
	}

	public void setOrderNum(BigDecimal orderNum) {
		this.orderNum = orderNum;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getUnitTypeId() {
		return this.unitTypeId;
	}

	public void setUnitTypeId(String unitTypeId) {
		this.unitTypeId = unitTypeId;
	}

	public String getAppUrl() {
		return this.appUrl;
	}

	public void setAppUrl(String appUrl) {
		this.appUrl = appUrl;
	}

	public String getCurUnitFlag() {
		return this.curUnitFlag;
	}

	public void setCurUnitFlag(String curUnitFlag) {
		this.curUnitFlag = curUnitFlag;
	}

	public String getAttachUnitUids() {
		return this.attachUnitUids;
	}

	public void setAttachUnitUids(String attachUnitUids) {
		this.attachUnitUids = attachUnitUids;
	}

}