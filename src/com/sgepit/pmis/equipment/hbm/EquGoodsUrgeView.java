package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsUrgeView entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsUrgeView implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private Integer finished;
	private Date remindDate;
	private String remindRange;
	private String conid;
	private String conname;
	private String sort;
	private String partybno;
	private Date receivedate;
	private String planuser;
	private String storageuser;
	private String jzName;
	private String sbName;
	private Date startDate;
	private Date endDate;

	// Constructors

	/** default constructor */
	public EquGoodsUrgeView() {
	}

	/** minimal constructor */
	public EquGoodsUrgeView(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public EquGoodsUrgeView(String pid, Integer finished, Date remindDate,
			String remindRange, String conid, String conname, String sort, String partybno,
			Date receivedate, String planuser, String storageuser,
			String jzName, String sbName, Date startDate, Date endDate) {
		this.pid = pid;
		this.finished = finished;
		this.remindDate = remindDate;
		this.remindRange = remindRange;
		this.conid = conid;
		this.conname = conname;
		this.sort = sort;
		this.partybno = partybno;
		this.receivedate = receivedate;
		this.planuser = planuser;
		this.storageuser = storageuser;
		this.jzName = jzName;
		this.sbName = sbName;
		this.startDate = startDate;
		this.endDate = endDate;
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

	public Integer getFinished() {
		return finished;
	}

	public void setFinished(Integer finished) {
		this.finished = finished;
	}

	public Date getRemindDate() {
		return remindDate;
	}

	public void setRemindDate(Date remindDate) {
		this.remindDate = remindDate;
	}

	public String getRemindRange() {
		return remindRange;
	}

	public void setRemindRange(String remindRange) {
		this.remindRange = remindRange;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getConname() {
		return conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public String getPartybno() {
		return partybno;
	}

	public void setPartybno(String partybno) {
		this.partybno = partybno;
	}

	public Date getReceivedate() {
		return receivedate;
	}

	public void setReceivedate(Date receivedate) {
		this.receivedate = receivedate;
	}

	public String getPlanuser() {
		return planuser;
	}

	public void setPlanuser(String planuser) {
		this.planuser = planuser;
	}

	public String getStorageuser() {
		return storageuser;
	}

	public void setStorageuser(String storageuser) {
		this.storageuser = storageuser;
	}

	public String getJzName() {
		return jzName;
	}

	public void setJzName(String jzName) {
		this.jzName = jzName;
	}

	public String getSbName() {
		return sbName;
	}

	public void setSbName(String sbName) {
		this.sbName = sbName;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	// Property accessors


}