package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * EquGoodsStockOut entity. @author MyEclipse Persistence Tools
 */

public class WzGoodsOutBack implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String treeuids;
	private Integer finished;
	private Integer isInstallation;
	private String outNo;
	private Date outDate;
	private String recipientsUnit;
	private String grantDesc;
	private String recipientsUser;
	private String recipientsUnitManager;
	private String handPerson;
	private String shipperNo;
	private String proUse;
	private String remark;
	private String type;
	
	private String equid;
	private String fileid;
	private String using;
	private String equname;
	private String outOutNo;
	private String judgmentFlag;
	private String kks;
	private String userPart;

	// Constructors

	/** default constructor */
	public WzGoodsOutBack() {
	}

	/** minimal constructor */
	public WzGoodsOutBack(String pid, String conid, String treeuids) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
	}

	/** full constructor */
	public WzGoodsOutBack(String pid, String conid, String treeuids,
			Integer finished, Integer isInstallation, String outNo,
			Date outDate, String recipientsUnit, String grantDesc,String outOutNo,
			String recipientsUser, String recipientsUnitManager,String type,
			String handPerson, String shipperNo, String proUse, String remark,
			String judgmentFlag,String kks,String userPart) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.finished = finished;
		this.isInstallation = isInstallation;
		this.outNo = outNo;
		this.outDate = outDate;
		this.recipientsUnit = recipientsUnit;
		this.grantDesc = grantDesc;
		this.recipientsUser = recipientsUser;
		this.recipientsUnitManager = recipientsUnitManager;
		this.handPerson = handPerson;
		this.shipperNo = shipperNo;
		this.proUse = proUse;
		this.remark = remark;
		this.type = type;
		this.outOutNo = outOutNo;
		this.judgmentFlag = judgmentFlag;
		this.kks = kks;
		this.userPart = userPart;
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

	public Integer getIsInstallation() {
		return this.isInstallation;
	}

	public void setIsInstallation(Integer isInstallation) {
		this.isInstallation = isInstallation;
	}

	public String getOutNo() {
		return this.outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public Date getOutDate() {
		return this.outDate;
	}

	public void setOutDate(Date outDate) {
		this.outDate = outDate;
	}

	public String getRecipientsUnit() {
		return this.recipientsUnit;
	}

	public void setRecipientsUnit(String recipientsUnit) {
		this.recipientsUnit = recipientsUnit;
	}

	public String getGrantDesc() {
		return this.grantDesc;
	}

	public void setGrantDesc(String grantDesc) {
		this.grantDesc = grantDesc;
	}

	public String getRecipientsUser() {
		return this.recipientsUser;
	}

	public void setRecipientsUser(String recipientsUser) {
		this.recipientsUser = recipientsUser;
	}

	public String getRecipientsUnitManager() {
		return this.recipientsUnitManager;
	}

	public void setRecipientsUnitManager(String recipientsUnitManager) {
		this.recipientsUnitManager = recipientsUnitManager;
	}

	public String getHandPerson() {
		return this.handPerson;
	}

	public void setHandPerson(String handPerson) {
		this.handPerson = handPerson;
	}

	public String getShipperNo() {
		return this.shipperNo;
	}

	public void setShipperNo(String shipperNo) {
		this.shipperNo = shipperNo;
	}

	public String getProUse() {
		return this.proUse;
	}

	public void setProUse(String proUse) {
		this.proUse = proUse;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getEquid() {
		return equid;
	}

	public void setEquid(String equid) {
		this.equid = equid;
	}

	public String getFileid() {
		return fileid;
	}

	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

	public String getUsing() {
		return using;
	}

	public void setUsing(String using) {
		this.using = using;
	}

	public String getEquname() {
		return equname;
	}

	public void setEquname(String equname) {
		this.equname = equname;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getOutOutNo() {
		return outOutNo;
	}

	public void setOutOutNo(String outOutNo) {
		this.outOutNo = outOutNo;
	}

	public String getJudgmentFlag() {
		return judgmentFlag;
	}

	public void setJudgmentFlag(String judgmentFlag) {
		this.judgmentFlag = judgmentFlag;
	}

	public String getKks() {
		return kks;
	}

	public void setKks(String kks) {
		this.kks = kks;
	}

	public String getUserPart() {
		return userPart;
	}

	public void setUserPart(String userPart) {
		this.userPart = userPart;
	}

}