package com.sgepit.pmis.wzgl.hbm;


import java.util.Date;

/**
 * EquGoodsStockOut entity. @author MyEclipse Persistence Tools
 */

public class WzGoodsStockOut implements java.io.Serializable {

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
	
	private String equid;
	private String fileid;
	private String using;
	private String equname;
	private String outBackNo;
	private String outEstimateNo;
	private String type;
	private String judgmentFlag;
	private String kks;
	private String userPart;
	
	//权限控制新增字段
	private String createMan;//创建人ID
	private String createUnit;//创建单位
	
	//新增‘安装主体设备（建筑物）’及‘对应财务科目’
	private String installationBody;
	private String financialSubjects;
	private String auditState;//稽核状态
	
	private String subjectAllname;//凭证财务科目
	
	private Date finishedDate;//完结时间
	private String finishedUser;//完结操作人
	private String conPartybNo;//对应合同供货商编号
	private String useUnit;//新增领用单位，把以前的领用单位修改为出库单位 yanglh 2013-09-28
	
	//暂估冲回合并到正式出库，新增以下两个字段区分
	private String finishMark;//冲回入库，1--暂估入库不允许修改删除等操作标识符
	private String dataSource;//数据来源的主键

	private String relateProacm;//关联工程量

	// Constructors

	/** default constructor */
	public WzGoodsStockOut() {
	}

	/** minimal constructor */
	public WzGoodsStockOut(String pid, String conid, String treeuids) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
	}

	/** full constructor */
	public WzGoodsStockOut(String uids, String pid, String conid,
			String treeuids, Integer finished, Integer isInstallation,
			String outNo, Date outDate, String recipientsUnit,
			String grantDesc, String recipientsUser,
			String recipientsUnitManager, String handPerson, String shipperNo,
			String proUse, String remark, String equid, String fileid,
			String using, String equname, String outBackNo,
			String outEstimateNo, String type, String judgmentFlag, String kks,
			String userPart, String createMan, String createUnit,
			String installationBody, String financialSubjects,
			String auditState, String subjectAllname, Date finishedDate,
			String finishedUser, String conPartybNo, String useUnit,
			String finishMark, String dataSource, String relateProacm) {
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
		this.equid = equid;
		this.fileid = fileid;
		this.using = using;
		this.equname = equname;
		this.outBackNo = outBackNo;
		this.outEstimateNo = outEstimateNo;
		this.type = type;
		this.judgmentFlag = judgmentFlag;
		this.kks = kks;
		this.userPart = userPart;
		this.createMan = createMan;
		this.createUnit = createUnit;
		this.installationBody = installationBody;
		this.financialSubjects = financialSubjects;
		this.auditState = auditState;
		this.subjectAllname = subjectAllname;
		this.finishedDate = finishedDate;
		this.finishedUser = finishedUser;
		this.conPartybNo = conPartybNo;
		this.useUnit = useUnit;
		this.finishMark = finishMark;
		this.dataSource = dataSource;
		this.relateProacm = relateProacm;
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

	public String getInstallationBody() {
		return installationBody;
	}

	public void setInstallationBody(String installationBody) {
		this.installationBody = installationBody;
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

	public String getFinishMark() {
		return finishMark;
	}

	public void setFinishMark(String finishMark) {
		this.finishMark = finishMark;
	}

	public String getDataSource() {
		return dataSource;
	}

	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}

	public String getRelateProacm() {
		return relateProacm;
	}

	public void setRelateProacm(String relateProacm) {
		this.relateProacm = relateProacm;
	}

}