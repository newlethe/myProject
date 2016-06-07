package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsStockOutSub entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsOutBackSub implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String stockId;
	private String outId;
	private String outNo;
	private String boxNo;
	private String equType;
	private String equPartName;
	private String ggxh;
	private String graphNo;
	private String unit;
	private Double outNum;
	private String storage;
	
	private Double price;
	private Double amount;

	// Constructors

	/** default constructor */
	public EquGoodsOutBackSub() {
	}

	/** minimal constructor */
	public EquGoodsOutBackSub(String pid,String stockId, String outId, String outNo) {
		this.pid = pid;
		this.stockId = stockId;
		this.outId = outId;
		this.outNo = outNo;
	}

	/** full constructor */
	public EquGoodsOutBackSub(String pid, String stockId,String outId, String outNo,
			String boxNo, String equType, String equPartName, String ggxh,
			String graphNo, String unit, Double outNum, 
			String storage) {
		this.pid = pid;
		this.stockId = stockId;
		this.outId = outId;
		this.outNo = outNo;
		this.boxNo = boxNo;
		this.equType = equType;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.unit = unit;
		this.outNum = outNum;
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

	public String getStockId() {
		return stockId;
	}

	public void setStockId(String stockId) {
		this.stockId = stockId;
	}

	public String getOutId() {
		return this.outId;
	}

	public void setOutId(String outId) {
		this.outId = outId;
	}

	public String getOutNo() {
		return this.outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public String getBoxNo() {
		return this.boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getEquType() {
		return this.equType;
	}

	public void setEquType(String equType) {
		this.equType = equType;
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

	public Double getOutNum() {
		return this.outNum;
	}

	public void setOutNum(Double outNum) {
		this.outNum = outNum;
	}

	public String getStorage() {
		return this.storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

}