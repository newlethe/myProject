package com.sgepit.pcmis.bid.hbm;

public class VPcBidZbApply implements java.io.Serializable{
	private String uids;
	private String pid;
	private String zbType;
	private String zbName;
	private String zbWay;
	private String memo;
	private Double reportStatus;
	private String unitTypeId;
	private String unitName;
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
	public String getZbType() {
		return zbType;
	}
	public void setZbType(String zbType) {
		this.zbType = zbType;
	}
	public String getZbName() {
		return zbName;
	}
	public void setZbName(String zbName) {
		this.zbName = zbName;
	}
	public String getZbWay() {
		return zbWay;
	}
	public void setZbWay(String zbWay) {
		this.zbWay = zbWay;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public Double getReportStatus() {
		return reportStatus;
	}
	public void setReportStatus(Double reportStatus) {
		this.reportStatus = reportStatus;
	}
	public String getUnitTypeId() {
		return unitTypeId;
	}
	public void setUnitTypeId(String unitTypeId) {
		this.unitTypeId = unitTypeId;
	}
	public String getUnitName() {
		return unitName;
	}
	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}
}
