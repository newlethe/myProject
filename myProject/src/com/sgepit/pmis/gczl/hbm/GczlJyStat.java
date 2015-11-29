package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

public class GczlJyStat {

	private String uids;
	private String statNo;
	private String userId;
	private String deptId;
	private String specialty;
	private String sjType;
	private Date createTime;
	private Integer jyStatus;
	private Integer billState;
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getSpecialty() {
		return specialty;
	}
	public void setSpecialty(String specialty) {
		this.specialty = specialty;
	}
	public String getSjType() {
		return sjType;
	}
	public void setSjType(String sjType) {
		this.sjType = sjType;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Integer getJyStatus() {
		return jyStatus;
	}
	public void setJyStatus(Integer jyStatus) {
		this.jyStatus = jyStatus;
	}
	public Integer getBillState() {
		return billState;
	}
	public void setBillState(Integer billState) {
		this.billState = billState;
	}
	public String getStatNo() {
		return statNo;
	}
	public void setStatNo(String statNo) {
		this.statNo = statNo;
	}

}
