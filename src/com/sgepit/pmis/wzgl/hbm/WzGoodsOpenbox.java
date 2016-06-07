package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * EquGoodsOpenbox entity. @author MyEclipse Persistence Tools
 */

public class WzGoodsOpenbox implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String treeuids;
	private Integer finished;
	private Integer isStorein;
	private String openNo;
	private Date openDate;
	private String noticeId;
	private String noticeNo;
	private String openPlace;
	private String openUser;
	private String ownerNo;
	private String openDesc;
	private String remark;
	
	private String factoryNo;
	private String packingNo;
	private String factory;
	
	//权限控制新增字段
	private String createMan;//创建人ID
	private String createUnit;//创建单位
	
	// Constructors

	/** default constructor */
	public WzGoodsOpenbox() {
	}

	/** minimal constructor */
	public WzGoodsOpenbox(String pid, String conid, String treeuids) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
	}

	/** full constructor */
	public WzGoodsOpenbox(String pid, String conid, String treeuids,
			Integer finished, Integer isStorein, String openNo, Date openDate, 
			String noticeId, String noticeNo, String openPlace, String openUser,
			String ownerNo,	String openDesc, String remark) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.finished = finished;
		this.isStorein = isStorein;
		this.openNo = openNo;
		this.openDate = openDate;
		this.noticeId = noticeId;
		this.noticeNo = noticeNo;
		this.openPlace = openPlace;
		this.openUser = openUser;
		this.ownerNo = ownerNo;
		this.openDesc = openDesc;
		this.remark = remark;
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

	public String getOpenNo() {
		return this.openNo;
	}

	public void setOpenNo(String openNo) {
		this.openNo = openNo;
	}

	public Date getOpenDate() {
		return this.openDate;
	}

	public void setOpenDate(Date openDate) {
		this.openDate = openDate;
	}

	public String getNoticeId() {
		return this.noticeId;
	}

	public void setNoticeId(String noticeId) {
		this.noticeId = noticeId;
	}

	public String getNoticeNo() {
		return this.noticeNo;
	}

	public void setNoticeNo(String noticeNo) {
		this.noticeNo = noticeNo;
	}

	public String getOpenPlace() {
		return this.openPlace;
	}

	public void setOpenPlace(String openPlace) {
		this.openPlace = openPlace;
	}

	public String getOpenUser() {
		return this.openUser;
	}

	public void setOpenUser(String openUser) {
		this.openUser = openUser;
	}

	public String getOwnerNo() {
		return this.ownerNo;
	}

	public void setOwnerNo(String ownerNo) {
		this.ownerNo = ownerNo;
	}

	public String getOpenDesc() {
		return this.openDesc;
	}

	public void setOpenDesc(String openDesc) {
		this.openDesc = openDesc;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getIsStorein() {
		return isStorein;
	}

	public void setIsStorein(Integer isStorein) {
		this.isStorein = isStorein;
	}

	public String getFactoryNo() {
		return factoryNo;
	}

	public void setFactoryNo(String factoryNo) {
		this.factoryNo = factoryNo;
	}

	public String getPackingNo() {
		return packingNo;
	}

	public void setPackingNo(String packingNo) {
		this.packingNo = packingNo;
	}

	public String getFactory() {
		return factory;
	}

	public void setFactory(String factory) {
		this.factory = factory;
	}

	public String getCreateMan() {
		return createMan;
	}

	public void setCreateMan(String createMan) {
		this.createMan = createMan;
	}

	public String getCreateUnit() {
		return createUnit;
	}

	public void setCreateUnit(String createUnit) {
		this.createUnit = createUnit;
	}

}