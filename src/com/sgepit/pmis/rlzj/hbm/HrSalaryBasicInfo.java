package com.sgepit.pmis.rlzj.hbm;

import java.math.BigDecimal;

/**
 * HrSalaryBasicInfo entity. @author MyEclipse Persistence Tools
 */

public class HrSalaryBasicInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String code;
	private String name;
	private String configInfo;
	private BigDecimal orderNum;
	private String dataType;
	private String coOptions;
	
	// Constructors

	/** default constructor */
	public HrSalaryBasicInfo() {
	}

	/** minimal constructor */
	public HrSalaryBasicInfo(String code, String name, String configInfo) {
		this.code = code;
		this.name = name;
		this.configInfo = configInfo;
	}

	/** full constructor */
	public HrSalaryBasicInfo(String code, String name, String configInfo,
			BigDecimal orderNum) {
		this.code = code;
		this.name = name;
		this.configInfo = configInfo;
		this.orderNum = orderNum;
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

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getConfigInfo() {
		return this.configInfo;
	}

	public void setConfigInfo(String configInfo) {
		this.configInfo = configInfo;
	}

	public BigDecimal getOrderNum() {
		return this.orderNum;
	}

	public void setOrderNum(BigDecimal orderNum) {
		this.orderNum = orderNum;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getCoOptions() {
		return coOptions;
	}

	public void setCoOptions(String coOptions) {
		this.coOptions = coOptions;
	}

}