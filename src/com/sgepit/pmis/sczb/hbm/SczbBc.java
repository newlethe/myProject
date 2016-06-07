package com.sgepit.pmis.sczb.hbm;

import java.io.Serializable;
import java.util.Date;

public class SczbBc implements Serializable {
	//Files
	private String UIDS;//主键
	private String bcName;//班次名称
	private Date beginTime;//开始时间
	private Double longTime;//时长
	private int xh;//顺序
	private String PID;//项目
	private String isUsed;//是否可用
	
	
	public String getIsUsed() {
		return isUsed;
	}
	public void setIsUsed(String isUsed) {
		this.isUsed = isUsed;
	}
	public String getUIDS() {
		return UIDS;
	}
	public void setUIDS(String uIDS) {
		UIDS = uIDS;
	}
	
	public String getPID() {
		return PID;
	}
	public void setPID(String pID) {
		PID = pID;
	}
	public Double getLongTime() {
		return longTime;
	}
	public void setLongTime(Double longTime) {
		this.longTime = longTime;
	}
	public String getBcName() {
		return bcName;
	}
	public void setBcName(String bcName) {
		this.bcName = bcName;
	}
	public Date getBeginTime() {
		return beginTime;
	}
	public void setBeginTime(Date beginTime) {
		this.beginTime = beginTime;
	}
	public int getXh() {
		return xh;
	}
	public void setXh(int xh) {
		this.xh = xh;
	}
	
}
