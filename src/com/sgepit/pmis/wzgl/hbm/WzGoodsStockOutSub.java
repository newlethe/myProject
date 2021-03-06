package com.sgepit.pmis.wzgl.hbm;
/**
 * EquGoodsStockOutSub entity. @author MyEclipse Persistence Tools
 */

public class WzGoodsStockOutSub implements java.io.Serializable {

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
	private Double kcMoney;
	private String useParts;
	private String kksNo;
	
	private String inUids;
	private String inSubUids;
	private Double inNum;
	private String memo;
	private String equBoxNo;
	private String qcId;
	private String wzSubUids;
	private String relateAsset;//关联固定资产清单树土建节点
	private String special;
	private String jzNo;

	// Constructors

	/** default constructor */
	public WzGoodsStockOutSub() {
	}

	/** minimal constructor */
	public WzGoodsStockOutSub(String pid,String stockId, String outId, String outNo) {
		this.pid = pid;
		this.stockId = stockId;
		this.outId = outId;
		this.outNo = outNo;
	}

	/** full constructor */
	public WzGoodsStockOutSub(String uids, String pid, String stockId,
			String outId, String outNo, String boxNo, String equType,
			String equPartName, String ggxh, String graphNo, String unit,
			Double outNum, String storage, Double price, Double amount,
			Double kcMoney, String useParts, String kksNo, String inUids,
			String inSubUids, Double inNum, String memo, String equBoxNo,
			String qcId, String wzSubUids, String relateAsset, String special,
			String jzNo) {
		super();
		this.uids = uids;
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
		this.price = price;
		this.amount = amount;
		this.kcMoney = kcMoney;
		this.useParts = useParts;
		this.kksNo = kksNo;
		this.inUids = inUids;
		this.inSubUids = inSubUids;
		this.inNum = inNum;
		this.memo = memo;
		this.equBoxNo = equBoxNo;
		this.qcId = qcId;
		this.wzSubUids = wzSubUids;
		this.relateAsset = relateAsset;
		this.special = special;
		this.jzNo = jzNo;
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

	public Double getKcMoney() {
		return kcMoney;
	}

	public void setKcMoney(Double kcMoney) {
		this.kcMoney = kcMoney;
	}

	public String getUseParts() {
		return useParts;
	}

	public void setUseParts(String useParts) {
		this.useParts = useParts;
	}

	public String getKksNo() {
		return kksNo;
	}

	public void setKksNo(String kksNo) {
		this.kksNo = kksNo;
	}

	public String getInUids() {
		return inUids;
	}

	public void setInUids(String inUids) {
		this.inUids = inUids;
	}

	public String getInSubUids() {
		return inSubUids;
	}

	public void setInSubUids(String inSubUids) {
		this.inSubUids = inSubUids;
	}

	public Double getInNum() {
		return inNum;
	}

	public void setInNum(Double inNum) {
		this.inNum = inNum;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getEquBoxNo() {
		return equBoxNo;
	}

	public void setEquBoxNo(String equBoxNo) {
		this.equBoxNo = equBoxNo;
	}

	public String getQcId() {
		return qcId;
	}

	public void setQcId(String qcId) {
		this.qcId = qcId;
	}
	public String getWzSubUids() {
		return wzSubUids;
	}

	public void setWzSubUids(String wzSubUids) {
		this.wzSubUids = wzSubUids;
	}

	public String getRelateAsset() {
		return relateAsset;
	}

	public void setRelateAsset(String relateAsset) {
		this.relateAsset = relateAsset;
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