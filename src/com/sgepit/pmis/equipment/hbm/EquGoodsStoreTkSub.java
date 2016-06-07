package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsStoreTkSub entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsStoreTkSub implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String tkId;
	private String tkNo;
	private String boxNo;
	private String equType;
	private String equPartName;
	private String ggxh;
	private String graphNo;
	private String unit;
	private Long tkNum;
	private String storage;
	private String stockId;
	private String outSubId;
	private String remark;
	private String jzNo;
	
	// Constructors

	/** default constructor */
	public EquGoodsStoreTkSub() {
	}

	/** minimal constructor */
	public EquGoodsStoreTkSub(String pid, String tkId, String tkNo) {
		this.pid = pid;
		this.tkId = tkId;
		this.tkNo = tkNo;
	}

	/** full constructor */
	public EquGoodsStoreTkSub(String pid, String tkId, String tkNo,
			String boxNo, String equType, String equPartName, String ggxh,
			String graphNo, String unit, Long tkNum, String storage,
			String stockId,String outSubId, String remark,String jzNo) {
		this.pid = pid;
		this.tkId = tkId;
		this.tkNo = tkNo;
		this.boxNo = boxNo;
		this.equType = equType;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.unit = unit;
		this.tkNum = tkNum;
		this.storage = storage;
		this.stockId = stockId;
		this.outSubId = outSubId;
		this.remark = remark;
		this.jzNo=jzNo;
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

	public String getTkId() {
		return this.tkId;
	}

	public void setTkId(String tkId) {
		this.tkId = tkId;
	}

	public String getTkNo() {
		return this.tkNo;
	}

	public void setTkNo(String tkNo) {
		this.tkNo = tkNo;
	}

	public String getBoxNo() {
		return this.boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getEquType() {
		return this.equType;
	}

	public void setEquType(String equType) {
		this.equType = equType;
	}

	public String getEquPartName() {
		return this.equPartName;
	}

	public void setEquPartName(String equPartName) {
		this.equPartName = equPartName;
	}

	public String getGgxh() {
		return this.ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getGraphNo() {
		return this.graphNo;
	}

	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Long getTkNum() {
		return this.tkNum;
	}

	public void setTkNum(Long tkNum) {
		this.tkNum = tkNum;
	}

	public String getStorage() {
		return this.storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	public String getStockId() {
		return this.stockId;
	}

	public void setStockId(String stockId) {
		this.stockId = stockId;
	}

	public String getOutSubId() {
		return outSubId;
	}

	public void setOutSubId(String outSubId) {
		this.outSubId = outSubId;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getJzNo() {
		return jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
	}

}