package com.sgepit.pmis.wzgl.hbm;


import java.util.Date;

public class WzGoodsStorein  implements java.io.Serializable {
 
	// Fields

	private String uids;
	private String pid;
	private String conid;
	private byte finished;
	private String treeUids;
	private String warehouseNo;
	private Date warehouseDate;
	private String noticeNo;
	private String warehouseMan;
	private String makeMan;
	private String remark;
	private String abnormalOrNo;
	private String openBoxId;

	private String supplyunit;
	private String invoiceno;
	private String equid;
	private String fileid;
	private String warehouseZgrkNo;
	private String warehouseBackNo;
	private String type;
	private String judgmentFlag;
	private String joinUnit;
	
	//权限控制新增字段
	private String createMan;//创建人ID
	private String createUnit;//创建单位
	private String auditState;//稽核状态
	
	private Date finishedDate;//完结时间
	private String finishedUser;//完结操作人
	
	private String dataSource;//冲回数据来源的主键
	private String finishMark;//冲回入库，1--暂估入库不允许修改删除等操作标识符
	private String special;//专业类别

	// Constructors

	/** default constructor */
	public WzGoodsStorein() {
	}

	/** minimal constructor */
	public WzGoodsStorein(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public WzGoodsStorein(String uids, String pid, String conid, byte finished,
			String treeUids, String warehouseNo, Date warehouseDate,
			String noticeNo, String warehouseMan, String makeMan,
			String remark, String abnormalOrNo, String openBoxId,
			String supplyunit, String invoiceno, String equid, String fileid,
			String warehouseZgrkNo, String warehouseBackNo, String type,
			String judgmentFlag, String joinUnit, String createMan,
			String createUnit, String auditState, Date finishedDate,
			String finishedUser, String dataSource, String finishMark,
			String special) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.conid = conid;
		this.finished = finished;
		this.treeUids = treeUids;
		this.warehouseNo = warehouseNo;
		this.warehouseDate = warehouseDate;
		this.noticeNo = noticeNo;
		this.warehouseMan = warehouseMan;
		this.makeMan = makeMan;
		this.remark = remark;
		this.abnormalOrNo = abnormalOrNo;
		this.openBoxId = openBoxId;
		this.supplyunit = supplyunit;
		this.invoiceno = invoiceno;
		this.equid = equid;
		this.fileid = fileid;
		this.warehouseZgrkNo = warehouseZgrkNo;
		this.warehouseBackNo = warehouseBackNo;
		this.type = type;
		this.judgmentFlag = judgmentFlag;
		this.joinUnit = joinUnit;
		this.createMan = createMan;
		this.createUnit = createUnit;
		this.auditState = auditState;
		this.finishedDate = finishedDate;
		this.finishedUser = finishedUser;
		this.dataSource = dataSource;
		this.finishMark = finishMark;
		this.special = special;
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

	public byte getFinished() {
		return this.finished;
	}

	public void setFinished(byte finished) {
		this.finished = finished;
	}

	public String getTreeUids() {
		return this.treeUids;
	}

	public void setTreeUids(String treeUids) {
		this.treeUids = treeUids;
	}

	public String getWarehouseNo() {
		return this.warehouseNo;
	}

	public void setWarehouseNo(String warehouseNo) {
		this.warehouseNo = warehouseNo;
	}

	public Date getWarehouseDate() {
		return this.warehouseDate;
	}

	public void setWarehouseDate(Date warehouseDate) {
		this.warehouseDate = warehouseDate;
	}

	public String getNoticeNo() {
		return this.noticeNo;
	}

	public void setNoticeNo(String noticeNo) {
		this.noticeNo = noticeNo;
	}

	public String getWarehouseMan() {
		return this.warehouseMan;
	}

	public void setWarehouseMan(String warehouseMan) {
		this.warehouseMan = warehouseMan;
	}

	public String getMakeMan() {
		return this.makeMan;
	}

	public void setMakeMan(String makeMan) {
		this.makeMan = makeMan;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getAbnormalOrNo() {
		return abnormalOrNo;
	}

	public void setAbnormalOrNo(String abnormalOrNo) {
		this.abnormalOrNo = abnormalOrNo;
	}

	public String getOpenBoxId() {
		return openBoxId;
	}

	public void setOpenBoxId(String openBoxId) {
		this.openBoxId = openBoxId;
	}

	public String getSupplyunit() {
		return supplyunit;
	}

	public void setSupplyunit(String supplyunit) {
		this.supplyunit = supplyunit;
	}

	public String getInvoiceno() {
		return invoiceno;
	}

	public void setInvoiceno(String invoiceno) {
		this.invoiceno = invoiceno;
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

	public String getWarehouseZgrkNo() {
		return warehouseZgrkNo;
	}

	public void setWarehouseZgrkNo(String warehouseZgrkNo) {
		this.warehouseZgrkNo = warehouseZgrkNo;
	}

	public String getWarehouseBackNo() {
		return warehouseBackNo;
	}

	public void setWarehouseBackNo(String warehouseBackNo) {
		this.warehouseBackNo = warehouseBackNo;
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

	public String getJoinUnit() {
		return joinUnit;
	}

	public void setJoinUnit(String joinUnit) {
		this.joinUnit = joinUnit;
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

	public String getAuditState() {
		return auditState;
	}

	public void setAuditState(String auditState) {
		this.auditState = auditState;
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

	public String getSpecial() {
		return special;
	}

	public void setSpecial(String special) {
		this.special = special;
	}

}