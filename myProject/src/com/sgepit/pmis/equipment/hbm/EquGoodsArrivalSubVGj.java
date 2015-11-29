package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备到货子表打印
 * @author shuz
 *
 */
public class EquGoodsArrivalSubVGj implements java.io.Serializable{
	private String uids;
	private String arrivalId;
	private String boxName;
	private String boxType;
	private String jzNo;
	private String boxNo;
	private String ggxh;
	private String graphNo;
	private Double mustNum;
	private Double realNum;
	private String unit;
	
	public EquGoodsArrivalSubVGj() {
	}

	public EquGoodsArrivalSubVGj(String uids, String arrivalId, String boxName,
			String boxType, String jzNo, String boxNo, String ggxh,
			String graphNo, Double mustNum, Double realNum, String unit) {
		super();
		this.uids = uids;
		this.arrivalId = arrivalId;
		this.boxName = boxName;
		this.boxType = boxType;
		this.jzNo = jzNo;
		this.boxNo = boxNo;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.mustNum = mustNum;
		this.realNum = realNum;
		this.unit = unit;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getArrivalId() {
		return arrivalId;
	}

	public void setArrivalId(String arrivalId) {
		this.arrivalId = arrivalId;
	}

	public String getBoxName() {
		return boxName;
	}

	public void setBoxName(String boxName) {
		this.boxName = boxName;
	}

	public String getBoxType() {
		return boxType;
	}

	public void setBoxType(String boxType) {
		this.boxType = boxType;
	}

	public String getJzNo() {
		return jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
	}

	public String getBoxNo() {
		return boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getGraphNo() {
		return graphNo;
	}

	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}

	public Double getMustNum() {
		return mustNum;
	}

	public void setMustNum(Double mustNum) {
		this.mustNum = mustNum;
	}

	public Double getRealNum() {
		return realNum;
	}

	public void setRealNum(Double realNum) {
		this.realNum = realNum;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}
}	
