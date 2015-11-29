package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备出库单打印子表
 * @author shuz
 *
 */
public class EquGoodsStockOutSubVGj implements java.io.Serializable{
	private String uids;
	private String outId;
	private String equPartName;
	private String ggxh;
	private String unit;
	private Double outNum;
	private Double price;
	private Double totalPrice;
	private String remark;
	private String storage;
	private String pid;
	private String boxNo;
	private String graphNo;
	public EquGoodsStockOutSubVGj() {
		super();
	}
	public EquGoodsStockOutSubVGj(String uids, String outId,
			String equPartName, String ggxh, String unit, Double outNum,
			Double price, Double totalPrice, String remark, String storage) {
		super();
		this.uids = uids;
		this.outId = outId;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.unit = unit;
		this.outNum = outNum;
		this.price = price;
		this.totalPrice = totalPrice;
		this.remark = remark;
		this.storage = storage;
	}
	
	public EquGoodsStockOutSubVGj(String uids, String outId,
			String equPartName, String ggxh, String unit, Double outNum,
			Double price, Double totalPrice, String remark, String storage,
			String pid, String boxNo, String graphNo) {
		super();
		this.uids = uids;
		this.outId = outId;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.unit = unit;
		this.outNum = outNum;
		this.price = price;
		this.totalPrice = totalPrice;
		this.remark = remark;
		this.storage = storage;
		this.pid = pid;
		this.boxNo = boxNo;
		this.graphNo = graphNo;
	}
	public EquGoodsStockOutSubVGj(String uids, String outId,
			String equPartName, String ggxh, String unit, Double outNum,
			Double price, Double totalPrice, String remark, String storage,
			String pid) {
		super();
		this.uids = uids;
		this.outId = outId;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.unit = unit;
		this.outNum = outNum;
		this.price = price;
		this.totalPrice = totalPrice;
		this.remark = remark;
		this.storage = storage;
		this.pid = pid;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getOutId() {
		return outId;
	}
	public void setOutId(String outId) {
		this.outId = outId;
	}
	public String getEquPartName() {
		return equPartName;
	}
	public void setEquPartName(String equPartName) {
		this.equPartName = equPartName;
	}
	public String getGgxh() {
		return ggxh;
	}
	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public Double getOutNum() {
		return outNum;
	}
	public void setOutNum(Double outNum) {
		this.outNum = outNum;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public Double getTotalPrice() {
		return totalPrice;
	}
	public void setTotalPrice(Double totalPrice) {
		this.totalPrice = totalPrice;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
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
	public String getBoxNo() {
		return boxNo;
	}
	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}
	public String getGraphNo() {
		return graphNo;
	}
	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}
}
