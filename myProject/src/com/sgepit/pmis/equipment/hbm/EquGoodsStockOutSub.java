package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsStockOutSub entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsStockOutSub implements java.io.Serializable {

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
    private String jzNo;

	private Double price;
	private Double amount;
	private Double kcMoney;
	private String useParts;
	private String kksNo;    
	private Double totalPrice;
	private String remark;

	private String inUids;//入库单主键
	private String inSubUids;//入库明细主键
	private Double inNum;//入库数量
	private String memo;
	private String equBoxNo; //箱件号
	private String qcId;
	private String equSubUids;
	private String special;//专业类别

	// Constructors

	/** default constructor */
	public EquGoodsStockOutSub() {
	}

	/** minimal constructor */
	public EquGoodsStockOutSub(String pid,String stockId, String outId, String outNo) {
		this.pid = pid;
		this.stockId = stockId;
		this.outId = outId;
		this.outNo = outNo;
	}

	/** full constructor */
	public EquGoodsStockOutSub(String uids, String pid, String stockId,
			String outId, String outNo, String boxNo, String equType,
			String equPartName, String ggxh, String graphNo, String unit,
			Double outNum, String storage, String jzNo, Double price,
			Double amount, Double kcMoney, String useParts, String kksNo,
			Double totalPrice, String remark, String inUids, String inSubUids,
			Double inNum, String memo, String equBoxNo, String qcId,
			String equSubUids, String special) {
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
		this.jzNo = jzNo;
		this.price = price;
		this.amount = amount;
		this.kcMoney = kcMoney;
		this.useParts = useParts;
		this.kksNo = kksNo;
		this.totalPrice = totalPrice;
		this.remark = remark;
		this.inUids = inUids;
		this.inSubUids = inSubUids;
		this.inNum = inNum;
		this.memo = memo;
		this.equBoxNo = equBoxNo;
		this.qcId = qcId;
		this.equSubUids = equSubUids;
		this.special = special;
	}

	// Property accessors
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
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
		return outId;
	}

	public void setOutId(String outId) {
		this.outId = outId;
	}

	public String getOutNo() {
		return outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public String getBoxNo() {
		return boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getEquType() {
		return equType;
	}

	public void setEquType(String equType) {
		this.equType = equType;
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

	public String getGraphNo() {
		return graphNo;
	}

	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
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

	public String getStorage() {
		return storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	public String getJzNo() {
		return jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
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

	public String getEquSubUids() {
		return equSubUids;
	}

	public void setEquSubUids(String equSubUids) {
		this.equSubUids = equSubUids;
	}

	public String getSpecial() {
		return special;
	}

	public void setSpecial(String special) {
		this.special = special;
	}

}