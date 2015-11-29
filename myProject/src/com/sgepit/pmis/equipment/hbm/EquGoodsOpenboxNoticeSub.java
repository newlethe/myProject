package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsOpenboxNoticeSub entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsOpenboxNoticeSub implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String noticeId;
	private String noticeNo;
	private String boxType;
	private String jzNo;
	private String boxNo;
	private String boxName;
	private String ggxh;
	private String graphNo;
	private String unit;
	private Double openNum;
	private Double weight;
	private String arrivalSubId;
	private String arrivalNo;

	// Constructors

	/** default constructor */
	public EquGoodsOpenboxNoticeSub() {
	}

	/** minimal constructor */
	public EquGoodsOpenboxNoticeSub(String pid, String noticeId) {
		this.pid = pid;
		this.noticeId = noticeId;
	}

	/** full constructor */
	public EquGoodsOpenboxNoticeSub(String pid, String noticeId, String noticeNo,
			String boxType, String jzNo, String boxNo, String boxName,
			String ggxh, String graphNo, String unit, Double openNum, Double weight,
			String arrivalSubId, String arrivalNo) {
		this.pid = pid;
		this.noticeId = noticeId;
		this.noticeNo = noticeNo;
		this.boxType = boxType;
		this.jzNo = jzNo;
		this.boxNo = boxNo;
		this.boxName = boxName;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.unit = unit;
		this.openNum = openNum;
		this.weight = weight;
		this.arrivalSubId = arrivalSubId;
		this.arrivalNo = arrivalNo;
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

	public String getNoticeId() {
		return this.noticeId;
	}

	public void setNoticeId(String noticeId) {
		this.noticeId = noticeId;
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

	public Double getOpenNum() {
		return this.openNum;
	}

	public void setOpenNum(Double openNum) {
		this.openNum = openNum;
	}

	public Double getWeight() {
		return this.weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getNoticeNo() {
		return noticeNo;
	}

	public void setNoticeNo(String noticeNo) {
		this.noticeNo = noticeNo;
	}

	public String getArrivalSubId() {
		return arrivalSubId;
	}

	public void setArrivalSubId(String arrivalSubId) {
		this.arrivalSubId = arrivalSubId;
	}

	public String getArrivalNo() {
		return arrivalNo;
	}

	public void setArrivalNo(String arrivalNo) {
		this.arrivalNo = arrivalNo;
	}

}