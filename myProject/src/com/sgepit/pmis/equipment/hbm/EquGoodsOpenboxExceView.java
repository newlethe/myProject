package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsOpenboxExceViewId entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsOpenboxExceView implements java.io.Serializable {

	// Fields
	private String uuid;
	private String uids;
	private Integer finished;
	private Integer isStorein;
	private String treeuids;
	private String conid;
	private String openboxId;
	private String openboxNo;
	private String resultId;
	private String pid;
	private String equType;
	private String jzNo;
	private String boxNo;
	private String equPartName;
	private String ggxh;
	private String unit;
	private Double weight;
	private String graphNo;
	private Double boxinNum;
	private Double realNum;
	private Double passNum;
	private Double exceNum;
	private Integer exception;
	private String exceType;
	private String exceptionDesc;
	
	private Double excePassNum;
	private Double applyInNum;
	private Date excePassDate;
	private String handleUser;
	private String handleProcess;
	private String remark;

	// Constructors

	/** default constructor */
	public EquGoodsOpenboxExceView() {
	}

	/** minimal constructor */
	public EquGoodsOpenboxExceView(String treeuids, String openboxId,
			String resultId, String pid) {
		this.treeuids = treeuids;
		this.openboxId = openboxId;
		this.resultId = resultId;
		this.pid = pid;
	}

	/** full constructor */
	public EquGoodsOpenboxExceView(String uids, Integer finished,
			String uuid, String conid, Integer isStorein,
			String treeuids, String openboxId, String openboxNo,
			String resultId, String pid, String equType, String jzNo,
			String boxNo, String equPartName, String ggxh, String unit,
			Double weight, String graphNo,
			Double boxinNum, Double realNum, Double passNum, Double exceNum,
			Integer exception, String exceType, String exceptionDesc,
			Double excePassNum, Double applyInNum, Date excePassDate,
			String handleUser, String handleProcess, String remark) {
		this.uids = uids;
		this.finished = finished;
		this.treeuids = treeuids;
		this.isStorein = isStorein;
		this.uuid = uuid;
		this.conid = conid;
		this.openboxId = openboxId;
		this.openboxNo = openboxNo;
		this.resultId = resultId;
		this.pid = pid;
		this.equType = equType;
		this.jzNo = jzNo;
		this.boxNo = boxNo;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.unit = unit;
		this.weight = weight;
		this.graphNo = graphNo;
		this.boxinNum = boxinNum;
		this.realNum = realNum;
		this.passNum = passNum;
		this.exceNum = exceNum;
		this.exception = exception;
		this.exceType = exceType;
		this.exceptionDesc = exceptionDesc;
		this.excePassNum = excePassNum;
		this.applyInNum = applyInNum;
		this.excePassDate = excePassDate;
		this.handleUser = handleUser;
		this.handleProcess = handleProcess;
		this.remark = remark;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public Integer getFinished() {
		return this.finished;
	}

	public void setFinished(Integer finished) {
		this.finished = finished;
	}

	public String getTreeuids() {
		return this.treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
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

	public String getResultId() {
		return this.resultId;
	}

	public void setResultId(String resultId) {
		this.resultId = resultId;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
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
	
	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
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

	public Double getExcePassNum() {
		return this.excePassNum;
	}

	public void setExcePassNum(Double excePassNum) {
		this.excePassNum = excePassNum;
	}

	public Double getApplyInNum() {
		return this.applyInNum;
	}

	public void setApplyInNum(Double applyInNum) {
		this.applyInNum = applyInNum;
	}

	public Date getExcePassDate() {
		return this.excePassDate;
	}

	public void setExcePassDate(Date excePassDate) {
		this.excePassDate = excePassDate;
	}

	public String getHandleUser() {
		return this.handleUser;
	}

	public void setHandleUser(String handleUser) {
		this.handleUser = handleUser;
	}

	public String getHandleProcess() {
		return this.handleProcess;
	}

	public void setHandleProcess(String handleProcess) {
		this.handleProcess = handleProcess;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Integer getIsStorein() {
		return isStorein;
	}

	public void setIsStorein(Integer isStorein) {
		this.isStorein = isStorein;
	}

	public String getGraphNo() {
		return graphNo;
	}

	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}

}