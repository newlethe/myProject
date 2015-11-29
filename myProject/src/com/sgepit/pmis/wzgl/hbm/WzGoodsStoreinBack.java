package com.sgepit.pmis.wzgl.hbm;


import java.util.Date;

public class WzGoodsStoreinBack  implements java.io.Serializable {
 
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
	private String warehouseInType;
	private String warehouseNoNo;
	private String judgmentFlag;
	private String joinUnit;
	
	// Constructors

	/** default constructor */
	public WzGoodsStoreinBack() {
	}

	/** minimal constructor */
	public WzGoodsStoreinBack(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public WzGoodsStoreinBack(String uids, String pid, String conid,String judgmentFlag,
			byte finished, String treeUids, String warehouseNo,String warehouseInType,
			Date warehouseDate, String noticeNo, String warehouseMan,String warehouseNoNo,
			String makeMan, String remark,String abnormalOrNo,String openBoxId,
			String joinUnit) {
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
		this.warehouseInType = warehouseInType;
		this.warehouseNoNo = warehouseNoNo;
		this.judgmentFlag = judgmentFlag;
		this.joinUnit = joinUnit;
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

	public String getWarehouseInType() {
		return warehouseInType;
	}

	public void setWarehouseInType(String warehouseInType) {
		this.warehouseInType = warehouseInType;
	}

	public String getWarehouseNoNo() {
		return warehouseNoNo;
	}

	public void setWarehouseNoNo(String warehouseNoNo) {
		this.warehouseNoNo = warehouseNoNo;
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
	
}
