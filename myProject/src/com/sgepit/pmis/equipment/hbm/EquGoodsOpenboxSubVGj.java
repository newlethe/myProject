package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备开箱检验打印字表
 * @author shuz
 *
 */
public class EquGoodsOpenboxSubVGj implements java.io.Serializable{
	private String uids;
	private String openboxId;
	private String equPartName;
	private String equType;
	private String jzno;
	private String boxNo;
	private String ggxh;
	private String graphNo;
	private Double boxinNum;
	private Double realNum;
	private Double exceNum;
	private String unit;
	
	
	public EquGoodsOpenboxSubVGj() {
	}


	public EquGoodsOpenboxSubVGj(String uids, String openboxId,
			String equPartName, String equType, String jzno, String boxNo,
			String ggxh, String graphNo, Double boxinNum, Double realNum,
			Double exceNum, String unit) {
		super();
		this.uids = uids;
		this.openboxId = openboxId;
		this.equPartName = equPartName;
		this.equType = equType;
		this.jzno = jzno;
		this.boxNo = boxNo;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.boxinNum = boxinNum;
		this.realNum = realNum;
		this.exceNum = exceNum;
		this.unit = unit;
	}


	public String getUids() {
		return uids;
	}


	public void setUids(String uids) {
		this.uids = uids;
	}


	public String getOpenboxId() {
		return openboxId;
	}


	public void setOpenboxId(String openboxId) {
		this.openboxId = openboxId;
	}


	public String getEquPartName() {
		return equPartName;
	}


	public void setEquPartName(String equPartName) {
		this.equPartName = equPartName;
	}


	public String getEquType() {
		return equType;
	}


	public void setEquType(String equType) {
		this.equType = equType;
	}


	public String getJzno() {
		return jzno;
	}


	public void setJzno(String jzno) {
		this.jzno = jzno;
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


	public Double getBoxinNum() {
		return boxinNum;
	}


	public void setBoxinNum(Double boxinNum) {
		this.boxinNum = boxinNum;
	}


	public Double getRealNum() {
		return realNum;
	}


	public void setRealNum(Double realNum) {
		this.realNum = realNum;
	}


	public Double getExceNum() {
		return exceNum;
	}


	public void setExceNum(Double exceNum) {
		this.exceNum = exceNum;
	}


	public String getUnit() {
		return unit;
	}


	public void setUnit(String unit) {
		this.unit = unit;
	}
	
	
}
