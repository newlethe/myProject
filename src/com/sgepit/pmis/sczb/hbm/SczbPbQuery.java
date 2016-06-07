package com.sgepit.pmis.sczb.hbm;

import java.io.Serializable;
import java.util.Date;

public class SczbPbQuery implements Serializable {
	private String uids;
	private String pid;
	private Date initialDate;
	private String zcName;
	private String bcName;
	private Date beginTime;
	private Date endTime;
	private String myType;

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

	public Date getInitialDate() {
		return initialDate;
	}

	public void setInitialDate(Date initialDate) {
		this.initialDate = initialDate;
	}

	public String getZcName() {
		return zcName;
	}

	public void setZcName(String zcName) {
		this.zcName = zcName;
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

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getMyType() {
		return myType;
	}

	public void setMyType(String myType) {
		this.myType = myType;
	}
}
