package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquContViewId entity. @author MyEclipse Persistence Tools
 */

public class EquContView implements java.io.Serializable {

	// Fields

	private String pid;
	private String conid;
	private String conno;
	private String conname;
	private String condivno;
	private String partybno;
	private String sort;
	private Double conmoney;
	private Double equnum;
	private String planuser;
	private String storageuser;
	private Date receivedate;
	private Double deliverylimit;

	// Constructors

	/** default constructor */
	public EquContView() {
		super();
	}

	/** minimal constructor */
	public EquContView(String pid, String conid) {
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public EquContView(String pid, String conid, String conno,
			String conname, String condivno, String partybno, String sort,
			Double conmoney, Double equnum, String planuser, String storageuser,
			Date receivedate, Double deliverylimit) {
		this.pid = pid;
		this.conid = conid;
		this.conno = conno;
		this.conname = conname;
		this.condivno = condivno;
		this.partybno = partybno;
		this.sort = sort;
		this.conmoney = conmoney;
		this.equnum = equnum;
		this.planuser = planuser;
		this.storageuser = storageuser;
		this.receivedate = receivedate;
		this.deliverylimit = deliverylimit;
	}

	// Property accessors
	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getConno() {
		return this.conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return this.conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getCondivno() {
		return this.condivno;
	}

	public void setCondivno(String condivno) {
		this.condivno = condivno;
	}

	public String getPartybno() {
		return partybno;
	}

	public void setPartybno(String partybno) {
		this.partybno = partybno;
	}

	public String getSort() {
		return this.sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public Double getConmoney() {
		return this.conmoney;
	}

	public void setConmoney(Double conmoney) {
		this.conmoney = conmoney;
	}

	public Double getEqunum() {
		return this.equnum;
	}

	public void setEqunum(Double equnum) {
		this.equnum = equnum;
	}

	public String getPlanuser() {
		return this.planuser;
	}

	public void setPlanuser(String planuser) {
		this.planuser = planuser;
	}

	public String getStorageuser() {
		return this.storageuser;
	}

	public void setStorageuser(String storageuser) {
		this.storageuser = storageuser;
	}

	public Date getReceivedate() {
		return this.receivedate;
	}

	public void setReceivedate(Date receivedate) {
		this.receivedate = receivedate;
	}

	public Double getDeliverylimit() {
		return deliverylimit;
	}

	public void setDeliverylimit(Double deliverylimit) {
		this.deliverylimit = deliverylimit;
	}

}