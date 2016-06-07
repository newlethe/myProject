package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsStockOut entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsStockOut implements java.io.Serializable {

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
	
	private String billState;
	private String flowid;
	
	private String equid;
	private String fileid;
	private String using;
	private String equname;
	private String outBackNo;
	private String outEstimateNo;
	private String type;
    private String kksNo;//KKS编码
	private String dataType;
	private String usingPart;
	//权限控制新增字段
	private String createMan;//创建人
	private String createUnit;//创建单位
	
	//新增’对应财务科目‘
	private String financialSubjects;
	private String auditState;
	private String fixedAssetList;

	private String subjectAllname;//凭证财务科目
	private Date finishedDate;//完结时间
	private String finishedUser;//完结操作人
	private String conPartybNo;//对应合同供货商编号
	private String useUnit;//把以前的领用单位换成出库单位，新增领用单位。yanglh 2013-09-28
	private String dataSource;//暂估出库时冲回时记录主键
	private String finishMark;//暂估出库冲回时判断已经冲回的标识符 ：1--不允许再次冲回
	private String isOtherEqu;//是否其他设备

	// Constructors

	/** default constructor */
	public EquGoodsStockOut() {
	}

	/** minimal constructor */
	public EquGoodsStockOut(String pid, String conid, String treeuids) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
	}

	/** full constructor */
	public EquGoodsStockOut(String uids, String pid, String conid,
			String treeuids, Integer finished, Integer isInstallation,
			String outNo, Date outDate, String recipientsUnit,
			String grantDesc, String recipientsUser,
			String recipientsUnitManager, String handPerson, String shipperNo,
			String proUse, String remark, String billState, String flowid,
			String equid, String fileid, String using, String equname,
			String outBackNo, String outEstimateNo, String type, String kksNo,
			String dataType, String usingPart, String createMan,
			String createUnit, String financialSubjects, String auditState,
			String fixedAssetList, String subjectAllname, Date finishedDate,
			String finishedUser, String conPartybNo, String useUnit,
			String dataSource, String finishMark, String isOtherEqu) {
		super();
		this.uids = uids;
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
		this.billState = billState;
		this.flowid = flowid;
		this.equid = equid;
		this.fileid = fileid;
		this.using = using;
		this.equname = equname;
		this.outBackNo = outBackNo;
		this.outEstimateNo = outEstimateNo;
		this.type = type;
		this.kksNo = kksNo;
		this.dataType = dataType;
		this.usingPart = usingPart;
		this.createMan = createMan;
		this.createUnit = createUnit;
		this.financialSubjects = financialSubjects;
		this.auditState = auditState;
		this.fixedAssetList = fixedAssetList;
		this.subjectAllname = subjectAllname;
		this.finishedDate = finishedDate;
		this.finishedUser = finishedUser;
		this.conPartybNo = conPartybNo;
		this.useUnit = useUnit;
		this.dataSource = dataSource;
		this.finishMark = finishMark;
		this.isOtherEqu = isOtherEqu;
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

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getFlowid() {
		return flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
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

	public String getOutBackNo() {
		return outBackNo;
	}

	public void setOutBackNo(String outBackNo) {
		this.outBackNo = outBackNo;
	}

	public String getOutEstimateNo() {
		return outEstimateNo;
	}

	public void setOutEstimateNo(String outEstimateNo) {
		this.outEstimateNo = outEstimateNo;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getKksNo() {
		return kksNo;
	}

	public void setKksNo(String kksNo) {
		this.kksNo = kksNo;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getUsingPart() {
		return usingPart;
	}

	public void setUsingPart(String usingPart) {
		this.usingPart = usingPart;
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

	public String getFinancialSubjects() {
		return financialSubjects;
	}

	public void setFinancialSubjects(String financialSubjects) {
		this.financialSubjects = financialSubjects;
	}

	public String getAuditState() {
		return auditState;
	}

	public void setAuditState(String auditState) {
		this.auditState = auditState;
	}

	public String getFixedAssetList() {
		return fixedAssetList;
	}

	public void setFixedAssetList(String fixedAssetList) {
		this.fixedAssetList = fixedAssetList;
	}

	public String getSubjectAllname() {
		return subjectAllname;
	}

	public void setSubjectAllname(String subjectAllname) {
		this.subjectAllname = subjectAllname;
	}

	public Date getFinishedDate() {
		return finishedDate;
	}

	public void setFinishedDate(Date finishedDate) {
		this.finishedDate = finishedDate;
	}

	public String getFinishedUser() {
		return finishedUser;
	}

	public void setFinishedUser(String finishedUser) {
		this.finishedUser = finishedUser;
	}

	public String getConPartybNo() {
		return conPartybNo;
	}

	public void setConPartybNo(String conPartybNo) {
		this.conPartybNo = conPartybNo;
	}

	public String getUseUnit() {
		return useUnit;
	}

	public void setUseUnit(String useUnit) {
		this.useUnit = useUnit;
	}

	public String getDataSource() {
		return dataSource;
	}

	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}

	public String getFinishMark() {
		return finishMark;
	}

	public void setFinishMark(String finishMark) {
		this.finishMark = finishMark;
	}

	public String getIsOtherEqu() {
		return isOtherEqu;
	}

	public void setIsOtherEqu(String isOtherEqu) {
		this.isOtherEqu = isOtherEqu;
	}

}