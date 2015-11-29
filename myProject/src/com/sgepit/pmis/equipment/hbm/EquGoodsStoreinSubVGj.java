package com.sgepit.pmis.equipment.hbm;

public class EquGoodsStoreinSubVGj implements java.io.Serializable{
	private String uids;
	private String sbrkUids;
	private String wareHouseName;
	private String equType;
	private String boxNo;
	private String jzno;
	private String graphNo;
	private String ggxh;
	private Double inWareHouseNo;
	private Double wareHouseNum;
	private String unit;
	private String storage;
	private String pid;
	
	
	public EquGoodsStoreinSubVGj() {
	}
	
	public EquGoodsStoreinSubVGj(String uids, String sbrkUids,
			String wareHouseName, String equType, String boxNo, String jzno,
			String graphNo, String ggxh, Double inWareHouseNo, String unit,
			String storage, String pid) {
		super();
		this.uids = uids;
		this.sbrkUids = sbrkUids;
		this.wareHouseName = wareHouseName;
		this.equType = equType;
		this.boxNo = boxNo;
		this.jzno = jzno;
		this.graphNo = graphNo;
		this.ggxh = ggxh;
		this.inWareHouseNo = inWareHouseNo;
		this.unit = unit;
		this.storage = storage;
		this.pid = pid;
	}

	public EquGoodsStoreinSubVGj(String uids, String sbrkUids,
			String wareHouseName, String equType, String boxNo, String jzno,
			String graphNo, String ggxh, Double inWareHouseNo,
			Double wareHouseNum, String unit, String storage, String pid) {
		super();
		this.uids = uids;
		this.sbrkUids = sbrkUids;
		this.wareHouseName = wareHouseName;
		this.equType = equType;
		this.boxNo = boxNo;
		this.jzno = jzno;
		this.graphNo = graphNo;
		this.ggxh = ggxh;
		this.inWareHouseNo = inWareHouseNo;
		this.wareHouseNum = wareHouseNum;
		this.unit = unit;
		this.storage = storage;
		this.pid = pid;
	}

	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getSbrkUids() {
		return sbrkUids;
	}
	public void setSbrkUids(String sbrkUids) {
		this.sbrkUids = sbrkUids;
	}
	public String getWareHouseName() {
		return wareHouseName;
	}
	public void setWareHouseName(String wareHouseName) {
		this.wareHouseName = wareHouseName;
	}
	public String getEquType() {
		return equType;
	}
	public void setEquType(String equType) {
		this.equType = equType;
	}
	public String getBoxNo() {
		return boxNo;
	}
	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}
	public String getJzno() {
		return jzno;
	}
	public void setJzno(String jzno) {
		this.jzno = jzno;
	}
	public String getGraphNo() {
		return graphNo;
	}
	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}
	public String getGgxh() {
		return ggxh;
	}
	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}
	public Double getInWareHouseNo() {
		return inWareHouseNo;
	}
	public void setInWareHouseNo(Double inWareHouseNo) {
		this.inWareHouseNo = inWareHouseNo;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getStorage() {
		return storage;
	}
	public void setStorage(String storage) {
		this.storage = storage;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Double getWareHouseNum() {
		return wareHouseNum;
	}

	public void setWareHouseNum(Double wareHouseNum) {
		this.wareHouseNum = wareHouseNum;
	}
	
}
