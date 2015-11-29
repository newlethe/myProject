package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

public class EquGoodsStoreinSubView {

	private static final long serialVersionUID = 1L;

	private String uids;
	private String warehouseNo;
	private Date warehouseDate;
	private String conid;
	private String joinUnit;
	private String stockno;
	private String warehouseType;
	private String warehouseName;
	private String ggxh;
	private String unit;
	private Double inWarehouseNo;
	private Double hasOutNum;
	private Double intoMoney;
	private Double totalMoney;
	private String type;
	private String finishMark;
	private String special;//专业类别
	private String jzNo;//机组号

	// Constructors

	/** default constructor */
	public EquGoodsStoreinSubView() {
	}

	/** minimal constructor */
	public EquGoodsStoreinSubView(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public EquGoodsStoreinSubView(String uids, String warehouseNo,
			Date warehouseDate, String conid, String joinUnit, String stockno,
			String warehouseType, String warehouseName, String ggxh,
			String unit, Double inWarehouseNo, Double hasOutNum,
			Double intoMoney, Double totalMoney, String type,
			String finishMark, String special, String jzNo) {
		super();
		this.uids = uids;
		this.warehouseNo = warehouseNo;
		this.warehouseDate = warehouseDate;
		this.conid = conid;
		this.joinUnit = joinUnit;
		this.stockno = stockno;
		this.warehouseType = warehouseType;
		this.warehouseName = warehouseName;
		this.ggxh = ggxh;
		this.unit = unit;
		this.inWarehouseNo = inWarehouseNo;
		this.hasOutNum = hasOutNum;
		this.intoMoney = intoMoney;
		this.totalMoney = totalMoney;
		this.type = type;
		this.finishMark = finishMark;
		this.special = special;
		this.jzNo = jzNo;
	}
	

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getWarehouseNo() {
		return warehouseNo;
	}

	public void setWarehouseNo(String warehouseNo) {
		this.warehouseNo = warehouseNo;
	}

	public Date getWarehouseDate() {
		return warehouseDate;
	}

	public void setWarehouseDate(Date warehouseDate) {
		this.warehouseDate = warehouseDate;
	}

	public String getStockno() {
		return stockno;
	}

	public void setStockno(String stockno) {
		this.stockno = stockno;
	}

	public String getWarehouseType() {
		return warehouseType;
	}

	public void setWarehouseType(String warehouseType) {
		this.warehouseType = warehouseType;
	}

	public String getWarehouseName() {
		return warehouseName;
	}

	public void setWarehouseName(String warehouseName) {
		this.warehouseName = warehouseName;
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

	public Double getInWarehouseNo() {
		return inWarehouseNo;
	}

	public void setInWarehouseNo(Double inWarehouseNo) {
		this.inWarehouseNo = inWarehouseNo;
	}

	public Double getIntoMoney() {
		return intoMoney;
	}

	public void setIntoMoney(Double intoMoney) {
		this.intoMoney = intoMoney;
	}

	public Double getTotalMoney() {
		return totalMoney;
	}

	public void setTotalMoney(Double totalMoney) {
		this.totalMoney = totalMoney;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getJoinUnit() {
		return joinUnit;
	}

	public void setJoinUnit(String joinUnit) {
		this.joinUnit = joinUnit;
	}

	public Double getHasOutNum() {
		return hasOutNum;
	}

	public void setHasOutNum(Double hasOutNum) {
		this.hasOutNum = hasOutNum;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getFinishMark() {
		return finishMark;
	}

	public void setFinishMark(String finishMark) {
		this.finishMark = finishMark;
	}

	public String getSpecial() {
		return special;
	}

	public void setSpecial(String special) {
		this.special = special;
	}

	public String getJzNo() {
		return jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
	}

}