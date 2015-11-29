package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsStoreTk entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsStoreTk implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String treeuids;
	private Integer finished;
	private String tkNo;
	private Date tkDate;
	private String outId;
	private String outNo;
	private String stockManager;
	private String makeUser;
	private String remark;
	private String tkFileid;//退库单单据id
	private String tkysFileid;//退库验收单单据id

	// Constructors

	/** default constructor */
	public EquGoodsStoreTk() {
	}

	/** minimal constructor */
	public EquGoodsStoreTk(String pid, String conid, String treeuids) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
	}

	/** full constructor */
	public EquGoodsStoreTk(String uids, String pid, String conid,
			String treeuids, Integer finished, String tkNo, Date tkDate,
			String outId, String outNo, String stockManager, String makeUser,
			String remark, String tkFileid, String tkysFileid) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.finished = finished;
		this.tkNo = tkNo;
		this.tkDate = tkDate;
		this.outId = outId;
		this.outNo = outNo;
		this.stockManager = stockManager;
		this.makeUser = makeUser;
		this.remark = remark;
		this.tkFileid = tkFileid;
		this.tkysFileid = tkysFileid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

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

	public String getTreeuids() {
		return this.treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
	}

	public Integer getFinished() {
		return this.finished;
	}

	public void setFinished(Integer finished) {
		this.finished = finished;
	}

	public String getTkNo() {
		return this.tkNo;
	}

	public void setTkNo(String tkNo) {
		this.tkNo = tkNo;
	}

	public Date getTkDate() {
		return this.tkDate;
	}

	public void setTkDate(Date tkDate) {
		this.tkDate = tkDate;
	}

	public String getOutId() {
		return this.outId;
	}

	public void setOutId(String outId) {
		this.outId = outId;
	}

	public String getOutNo() {
		return this.outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public String getStockManager() {
		return this.stockManager;
	}

	public void setStockManager(String stockManager) {
		this.stockManager = stockManager;
	}

	public String getMakeUser() {
		return this.makeUser;
	}

	public void setMakeUser(String makeUser) {
		this.makeUser = makeUser;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getTkFileid() {
		return tkFileid;
	}

	public void setTkFileid(String tkFileid) {
		this.tkFileid = tkFileid;
	}

	public String getTkysFileid() {
		return tkysFileid;
	}

	public void setTkysFileid(String tkysFileid) {
		this.tkysFileid = tkysFileid;
	}

}