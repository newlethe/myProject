package com.sgepit.pcmis.zlgk.hbm;

import java.util.Date;

public class PcZlgkZlypQueryView  implements java.io.Serializable {

	// Fields

	private String uuid;
	private String engineerName;
	private String engineerNo;
	private String engineerType;
	private String parentNo;
	private Long isleaf;
	private String treeId;
	private String parentId;
	private String unit;
	private String billstategl;
	private Date checkDate;
	private String pid;
	private Long typeXm;
	private Long typeZy;
	private Long typeXt;
	private Long typeDw;
	private Long typeZdw;
	private Long typeFb;
	private Long typeZfb;
	private Long typeFx;
	private Long typeJy;
	private Long typeJb;

	// Constructors

	/** default constructor */
	public PcZlgkZlypQueryView() {
	}

	/** minimal constructor */
	public PcZlgkZlypQueryView(String uuid) {
		this.uuid = uuid;
	}

	/** full constructor */
	public PcZlgkZlypQueryView(String uuid, String engineerName,//, String uids
			String engineerNo, String engineerType, String parentNo,
			Long isleaf, String unit, String billstategl, Date checkDate,
			String pid,Long typeXm, Long typeZy, Long typeXt,
			Long typeDw, Long typeZdw, Long typeFb,String treeId,
			Long typeZfb, Long typeFx, Long typeJy,String parentId,
			Long typeJb) {
		this.uuid = uuid;
//		this.uids = uids;
		this.engineerName = engineerName;
		this.engineerNo = engineerNo;
		this.engineerType = engineerType;
		this.parentNo = parentNo;
		this.isleaf = isleaf;
		this.unit = unit;
		this.billstategl = billstategl;
		this.checkDate = checkDate;
		this.pid = pid;
		this.treeId = treeId;
		this.parentId = parentId;
		this.typeXm = typeXm;
		this.typeZy = typeZy;
		this.typeXt = typeXt;
		this.typeDw = typeDw;
		this.typeZdw = typeZdw;
		this.typeFb = typeFb;
		this.typeZfb = typeZfb;
		this.typeFx = typeFx;
		this.typeJy = typeJy;
		this.typeJb = typeJb;
	}
	
	// Property accessors
	
	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

//	public String getUids() {
//		return uids;
//	}
//
//	public void setUids(String uids) {
//		this.uids = uids;
//	}

	public String getEngineerName() {
		return engineerName;
	}

	public void setEngineerName(String engineerName) {
		this.engineerName = engineerName;
	}

	public String getEngineerNo() {
		return engineerNo;
	}

	public void setEngineerNo(String engineerNo) {
		this.engineerNo = engineerNo;
	}

	public String getEngineerType() {
		return engineerType;
	}

	public void setEngineerType(String engineerType) {
		this.engineerType = engineerType;
	}

	public String getParentNo() {
		return parentNo;
	}

	public void setParentNo(String parentNo) {
		this.parentNo = parentNo;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getTreeId() {
		return treeId;
	}

	public void setTreeId(String treeId) {
		this.treeId = treeId;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getBillstategl() {
		return billstategl;
	}

	public void setBillstategl(String billstategl) {
		this.billstategl = billstategl;
	}

	public Date getCheckDate() {
		return checkDate;
	}

	public void setCheckDate(Date checkDate) {
		this.checkDate = checkDate;
	}
	
	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Long getTypeXm() {
		return typeXm;
	}

	public void setTypeXm(Long typeXm) {
		this.typeXm = typeXm;
	}

	public Long getTypeZy() {
		return typeZy;
	}

	public void setTypeZy(Long typeZy) {
		this.typeZy = typeZy;
	}

	public Long getTypeXt() {
		return typeXt;
	}

	public void setTypeXt(Long typeXt) {
		this.typeXt = typeXt;
	}

	public Long getTypeDw() {
		return typeDw;
	}

	public void setTypeDw(Long typeDw) {
		this.typeDw = typeDw;
	}

	public Long getTypeZdw() {
		return typeZdw;
	}

	public void setTypeZdw(Long typeZdw) {
		this.typeZdw = typeZdw;
	}

	public Long getTypeFb() {
		return typeFb;
	}

	public void setTypeFb(Long typeFb) {
		this.typeFb = typeFb;
	}

	public Long getTypeZfb() {
		return typeZfb;
	}

	public void setTypeZfb(Long typeZfb) {
		this.typeZfb = typeZfb;
	}

	public Long getTypeFx() {
		return typeFx;
	}

	public void setTypeFx(Long typeFx) {
		this.typeFx = typeFx;
	}

	public Long getTypeJy() {
		return typeJy;
	}

	public void setTypeJy(Long typeJy) {
		this.typeJy = typeJy;
	}

	public Long getTypeJb() {
		return typeJb;
	}

	public void setTypeJb(Long typeJb) {
		this.typeJb = typeJb;
	}
}