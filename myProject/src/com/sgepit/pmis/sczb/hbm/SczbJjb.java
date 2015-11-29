package com.sgepit.pmis.sczb.hbm;

import java.io.Serializable;
import java.util.Date;

public class SczbJjb implements Serializable {
	private String uids;// 主键
	private String pid;// 项目
	private Date rq;// 日期
	private String zcName;// 值次
	private String bcName;// 班次
	private String zbTime;// 值班时间
	private String nameJie;// 接班人
	private String nameJiao;// 交班人
	private Date jbDate;// 交班时间
	private Date getbDate;// 接班时间
	private String recordState;// 记录类型，0：等待交接班，1：已交接班，2：补录
	private String userUnitid;// 用户部门id

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

	public Date getRq() {
		return rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
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

	public String getZbTime() {
		return zbTime;
	}

	public void setZbTime(String zbTime) {
		this.zbTime = zbTime;
	}

	public String getNameJie() {
		return nameJie;
	}

	public void setNameJie(String nameJie) {
		this.nameJie = nameJie;
	}

	public String getNameJiao() {
		return nameJiao;
	}

	public void setNameJiao(String nameJiao) {
		this.nameJiao = nameJiao;
	}

	public Date getJbDate() {
		return jbDate;
	}

	public void setJbDate(Date jbDate) {
		this.jbDate = jbDate;
	}

	public Date getGetbDate() {
		return getbDate;
	}

	public void setGetbDate(Date getbDate) {
		this.getbDate = getbDate;
	}

	public String getRecordState() {
		return recordState;
	}

	public void setRecordState(String recordState) {
		this.recordState = recordState;
	}

	public String getUserUnitid() {
		return userUnitid;
	}

	public void setUserUnitid(String userUnitid) {
		this.userUnitid = userUnitid;
	}

}
