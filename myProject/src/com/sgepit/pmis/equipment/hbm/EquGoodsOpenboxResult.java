package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsOpenboxResult entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsOpenboxResult implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String openboxId;
	private String openboxNo;
	private String treeuids;
	private String equType;
	private String jzNo;
	private String boxNo;
	private String equPartName;
	private String ggxh;
	private String unit;
	private Double boxinNum;
	private Double realNum;
	private Double passNum;
	private Double exceNum;
	private Integer exception;
	private String exceType;
	private String exceptionDesc;
	private String remark;
	private Double weight;
	private String graphNo;
	
	private String storage;
	// Constructors

	/** default constructor */
	public EquGoodsOpenboxResult() {
	}

	/** minimal constructor */
	public EquGoodsOpenboxResult(String pid, String openboxId) {
		this.pid = pid;
		this.openboxId = openboxId;
	}

	/** full constructor */
	public EquGoodsOpenboxResult(String uids, String pid, String openboxId,
			String openboxNo, String treeuids, String equType, String jzNo,
			String boxNo, String equPartName, String ggxh, String unit,
			Double boxinNum, Double realNum, Double passNum, Double exceNum,
			Integer exception, String exceType, String exceptionDesc,
			String remark, Double weight, String graphNo, String storage) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.openboxId = openboxId;
		this.openboxNo = openboxNo;
		this.treeuids = treeuids;
		this.equType = equType;
		this.jzNo = jzNo;
		this.boxNo = boxNo;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.unit = unit;
		this.boxinNum = boxinNum;
		this.realNum = realNum;
		this.passNum = passNum;
		this.exceNum = exceNum;
		this.exception = exception;
		this.exceType = exceType;
		this.exceptionDesc = exceptionDesc;
		this.remark = remark;
		this.weight = weight;
		this.graphNo = graphNo;
		this.storage = storage;
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

	public String getOpenboxId() {
		return this.openboxId;
	}

	public void setOpenboxId(String openboxId) {
		this.openboxId = openboxId;
	}

	public String getOpenboxNo() {
		return this.openboxNo;
	}

	public void setOpenboxNo(String openboxNo) {
		this.openboxNo = openboxNo;
	}

	public String getTreeuids() {
		return this.treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
	}

	public String getEquType() {
		return this.equType;
	}

	public void setEquType(String equType) {
		this.equType = equType;
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

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getBoxinNum() {
		return this.boxinNum;
	}

	public void setBoxinNum(Double boxinNum) {
		this.boxinNum = boxinNum;
	}

	public Double getRealNum() {
		return this.realNum;
	}

	public void setRealNum(Double realNum) {
		this.realNum = realNum;
	}

	public Double getPassNum() {
		return this.passNum;
	}

	public void setPassNum(Double passNum) {
		this.passNum = passNum;
	}

	public Double getExceNum() {
		return this.exceNum;
	}

	public void setExceNum(Double exceNum) {
		this.exceNum = exceNum;
	}

	public Integer getException() {
		return this.exception;
	}

	public void setException(Integer exception) {
		this.exception = exception;
	}

	public String getExceType() {
		return this.exceType;
	}

	public void setExceType(String exceType) {
		this.exceType = exceType;
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

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getGraphNo() {
		return graphNo;
	}

	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}

	public String getStorage() {
		return storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

}