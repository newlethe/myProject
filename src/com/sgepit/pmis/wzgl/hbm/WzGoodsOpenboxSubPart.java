package com.sgepit.pmis.wzgl.hbm;

/**
 * WzGoodsOpenboxSubPart entity. @author MyEclipse Persistence Tools
 */

public class WzGoodsOpenboxSubPart implements java.io.Serializable {

	// Fields

	private String uids;
	private String openboxSubId;
	private String equType;
	private String openboxId;
	private String openboxNo;
	private String pid;
	private String jzNo;
	private String treeuids;
	private String boxNo;
	private String equPartName;
	private String ggxh;
	private String graphNo;
	private String unit;
	private Double boxinNum;
	private Double weight;
	private String equBodys;

	private String userPosition;
	private String belongSystem;
	private String openCondition;
	private String defectDescription;
	// Constructors

	/** default constructor */
	public WzGoodsOpenboxSubPart() {
	}

	/** minimal constructor */
	public WzGoodsOpenboxSubPart(String openboxSubId) {
		this.openboxSubId = openboxSubId;
	}

	/** full constructor */
	public WzGoodsOpenboxSubPart(String openboxSubId, String equType,
			String equBodys, String openboxId, String openboxNo, String pid,
			String jzNo, String treeuids, String boxNo, String equPartName,
			String ggxh, String graphNo, String unit, Double boxinNum,
			Double weight,String userPosition,String belongSystem,
			String openCondition,String defectDescription) {
		this.openboxSubId = openboxSubId;
		this.equType = equType;
		this.openboxId = openboxId;
		this.openboxNo = openboxNo;
		this.pid = pid;
		this.jzNo = jzNo;
		this.treeuids = treeuids;
		this.boxNo = boxNo;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.unit = unit;
		this.boxinNum = boxinNum;
		this.weight = weight;
		this.equBodys = equBodys;
		this.userPosition = userPosition;
		this.belongSystem = belongSystem;
		this.openCondition = openCondition;
		this.defectDescription = defectDescription;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getOpenboxSubId() {
		return this.openboxSubId;
	}

	public void setOpenboxSubId(String openboxSubId) {
		this.openboxSubId = openboxSubId;
	}

	public String getEquType() {
		return this.equType;
	}

	public void setEquType(String equType) {
		this.equType = equType;
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

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getJzNo() {
		return this.jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
	}

	public String getTreeuids() {
		return this.treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
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

	public Double getBoxinNum() {
		return this.boxinNum;
	}

	public void setBoxinNum(Double boxinNum) {
		this.boxinNum = boxinNum;
	}
	
	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getEquBodys() {
		return equBodys;
	}

	public void setEquBodys(String equBodys) {
		this.equBodys = equBodys;
	}

	public String getUserPosition() {
		return userPosition;
	}

	public void setUserPosition(String userPosition) {
		this.userPosition = userPosition;
	}

	public String getBelongSystem() {
		return belongSystem;
	}

	public void setBelongSystem(String belongSystem) {
		this.belongSystem = belongSystem;
	}

	public String getOpenCondition() {
		return openCondition;
	}

	public void setOpenCondition(String openCondition) {
		this.openCondition = openCondition;
	}

	public String getDefectDescription() {
		return defectDescription;
	}

	public void setDefectDescription(String defectDescription) {
		this.defectDescription = defectDescription;
	}

}