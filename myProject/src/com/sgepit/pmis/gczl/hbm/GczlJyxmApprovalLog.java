package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

/**
 * GczlJyxm entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlJyxmApprovalLog implements java.io.Serializable {
	String uids;
	String pid;
	String appprovalUids;
	String beforeStatus;
	String status;
	String operator;
	Date operateTime;
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
	public String getAppprovalUids() {
		return appprovalUids;
	}
	public void setAppprovalUids(String appprovalUids) {
		this.appprovalUids = appprovalUids;
	}
	public String getBeforeStatus() {
		return beforeStatus;
	}
	public void setBeforeStatus(String beforeStatus) {
		this.beforeStatus = beforeStatus;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public Date getOperateTime() {
		return operateTime;
	}
	public void setOperateTime(Date operateTime) {
		this.operateTime = operateTime;
	}
}






