package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsArrivalSub entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsArrivalSub implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String arrivalId;
	private String arrivalNo;
	private String boxType;
	private String jzNo;
	private String boxNo;
	private String boxName;
	private String ggxh;
	private String graphNo;
	private String unit;
	private Double mustNum;
	private Double realNum;
	private Double weight;
	private String packType;
	private String storage;
	private Integer exception;
	private String exceptionDesc;
	private String remark;

	// Constructors

	/** default constructor */
	public EquGoodsArrivalSub() {
	}

	/** minimal constructor */
	public EquGoodsArrivalSub(String pid, String arrivalId) {
		this.pid = pid;
		this.arrivalId = arrivalId;
	}

	/** full constructor */
	public EquGoodsArrivalSub(String pid, String arrivalId, String arrivalNo,
			String boxType,
			String jzNo, String boxNo, String boxName, String ggxh,
			String graphNo, String unit, Double mustNum, Double realNum,
			Double weight, String packType, String storage, Integer exception,
			String exceptionDesc, String remark) {
		this.pid = pid;
		this.arrivalId = arrivalId;
		this.arrivalNo = arrivalNo; 
		this.boxType = boxType;
		this.jzNo = jzNo;
		this.boxNo = boxNo;
		this.boxName = boxName;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.unit = unit;
		this.mustNum = mustNum;
		this.realNum = realNum;
		this.weight = weight;
		this.packType = packType;
		this.storage = storage;
		this.exception = exception;
		this.exceptionDesc = exceptionDesc;
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

	public String getArrivalId() {
		return this.arrivalId;
	}

	public void setArrivalId(String arrivalId) {
		this.arrivalId = arrivalId;
	}

	public String getBoxType() {
		return this.boxType;
	}

	public void setBoxType(String boxType) {
		this.boxType = boxType;
	}

	public String getJzNo() {
		return this.jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
	}

	public String getBoxNo() {
		return this.boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getBoxName() {
		return this.boxName;
	}

	public void setBoxName(String boxName) {
		this.boxName = boxName;
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

	public Double getMustNum() {
		return this.mustNum;
	}

	public void setMustNum(Double mustNum) {
		this.mustNum = mustNum;
	}

	public Double getRealNum() {
		return this.realNum;
	}

	public void setRealNum(Double realNum) {
		this.realNum = realNum;
	}

	public Double getWeight() {
		return this.weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getPackType() {
		return this.packType;
	}

	public void setPackType(String packType) {
		this.packType = packType;
	}

	public String getStorage() {
		return this.storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	public Integer getException() {
		return this.exception;
	}

	public void setException(Integer exception) {
		this.exception = exception;
	}

	public String getExceptionDesc() {
		return this.exceptionDesc;
	}

	public void setExceptionDesc(String exceptionDesc) {
		this.exceptionDesc = exceptionDesc;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getArrivalNo() {
		return arrivalNo;
	}

	public void setArrivalNo(String arrivalNo) {
		this.arrivalNo = arrivalNo;
	}

}