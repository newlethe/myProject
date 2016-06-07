package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

public class EquGoodsStorein  implements java.io.Serializable {
 
	// Fields

	private String uids;
	private String pid;
	private String conid;
	private byte finished;
	private String treeuids;
	private String warehouseNo;
	private Date warehouseDate;
	private String noticeNo;
	private String warehouseMan;
	private String makeMan;
	private String remark;
	private String abnormalOrNo;
	private String openBoxId;

	private String billState;
	private String flowid;
	
	//移植之后没有的字段yanglh
	private String supplyunit;
	private String invoiceno;
	private String equid;
	private String fileid;
	private String warehouseZgrkNo;
	private String warehouseBackNo;
	private String type;
	private String dataType;
	//权限控制新增字段
	private String createMan;//创建人
	private String createUnit;//创建单位
	
	private String joinUnit;
	private String auditState;//稽核状态
	
	private Date finishedDate;//完结时间
	private String finishedUser;//完结操作人
	private String dataSource;//暂估冲回时生成记录数据时记录数据来源的主键
	private String finishMark;//暂估入库冲回操作时改变状态，1--不允许在次操作
	private String special;//专业类别

	// Constructors

	/** default constructor */
	public EquGoodsStorein() {
	}

	/** minimal constructor */
	public EquGoodsStorein(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public EquGoodsStorein(String uids, String pid, String conid,
			byte finished, String treeuids, String warehouseNo,
			Date warehouseDate, String noticeNo, String warehouseMan,
			String makeMan, String remark, String abnormalOrNo,
			String openBoxId, String billState, String flowid,
			String supplyunit, String invoiceno, String equid, String fileid,
			String warehouseZgrkNo, String warehouseBackNo, String type,
			String dataType, String createMan, String createUnit,
			String joinUnit, String auditState, Date finishedDate,
			String finishedUser, String dataSource, String finishMark,
			String special) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.conid = conid;
		this.finished = finished;
		this.treeuids = treeuids;
		this.warehouseNo = warehouseNo;
		this.warehouseDate = warehouseDate;
		this.noticeNo = noticeNo;
		this.warehouseMan = warehouseMan;
		this.makeMan = makeMan;
		this.remark = remark;
		this.abnormalOrNo = abnormalOrNo;
		this.openBoxId = openBoxId;
		this.billState = billState;
		this.flowid = flowid;
		this.supplyunit = supplyunit;
		this.invoiceno = invoiceno;
		this.equid = equid;
		this.fileid = fileid;
		this.warehouseZgrkNo = warehouseZgrkNo;
		this.warehouseBackNo = warehouseBackNo;
		this.type = type;
		this.dataType = dataType;
		this.createMan = createMan;
		this.createUnit = createUnit;
		this.joinUnit = joinUnit;
		this.auditState = auditState;
		this.finishedDate = finishedDate;
		this.finishedUser = finishedUser;
		this.dataSource = dataSource;
		this.finishMark = finishMark;
		this.special = special;
	}
	
	// Property accessors
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

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public byte getFinished() {
		return finished;
	}

	public void setFinished(byte finished) {
		this.finished = finished;
	}

	public String getTreeuids() {
		return treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
	}

	public String getWarehouseNo() {
		return warehouseNo;
	}

	public void setWarehouseNo(String warehouseNo) {
		this.warehouseNo = warehouseNo;
	}

	public Date getWarehouseDate() {
		return warehouseDate;
	}

	public void setWarehouseDate(Date warehouseDate) {
		this.warehouseDate = warehouseDate;
	}

	public String getNoticeNo() {
		return noticeNo;
	}

	public void setNoticeNo(String noticeNo) {
		this.noticeNo = noticeNo;
	}

	public String getWarehouseMan() {
		return warehouseMan;
	}

	public void setWarehouseMan(String warehouseMan) {
		this.warehouseMan = warehouseMan;
	}

	public String getMakeMan() {
		return makeMan;
	}

	public void setMakeMan(String makeMan) {
		this.makeMan = makeMan;
	}

	public String getRemark() {
		return remark;
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

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
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

	public String getJoinUnit() {
		return joinUnit;
	}

	public void setJoinUnit(String joinUnit) {
		this.joinUnit = joinUnit;
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
