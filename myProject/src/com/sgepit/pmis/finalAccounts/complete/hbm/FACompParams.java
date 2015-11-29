package com.sgepit.pmis.finalAccounts.complete.hbm;
/**
 * 参数属性表
 * @author pengy
 * @create time 2013-06-27
 */
public class FACompParams {
	
	private String uids;
	private String pid;
	private Float paramNo;
	private String paramType;
	private String paramName;
	private String paramValue;
	private String unit;
	private String dataType;
	private String remark;
	
	public FACompParams() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FACompParams(String uids, String pid, Float paramNo,
			String paramType, String paramName, String paramValue,
			String remark, String unit, String dataType) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.paramNo = paramNo;
		this.paramType = paramType;
		this.paramName = paramName;
		this.paramValue = paramValue;
		this.remark = remark;
		this.unit = unit;
		this.dataType = dataType;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Float getParamNo() {
		return paramNo;
	}

	public void setParamNo(Float paramNo) {
		this.paramNo = paramNo;
	}

	public String getParamType() {
		return paramType;
	}

	public void setParamType(String paramType) {
		this.paramType = paramType;
	}

	public String getParamName() {
		return paramName;
	}

	public void setParamName(String paramName) {
		this.paramName = paramName;
	}

	public String getParamValue() {
		return paramValue;
	}

	public void setParamValue(String paramValue) {
		this.paramValue = paramValue;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
	
}
