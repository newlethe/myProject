package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsStock entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsStock implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String treeuids;
	private String boxNo;
	private String equType;
	private String equPartName;
	private String ggxh;
	private String graphNo;
	private String unit;
	private Double stockNum;
	private Double weight;
	private String storage;
	private String jzNo;
	private String special;//专业类别
	
	//权限控制新增字段
	private String createMan;//入库人ID
	private String createUnit;//入库填写单位
	private String recordUser;//入库人
	
	//判断库存数据来源问题，主体设备中入库及设备中的入库
	private String judgment;
	
	private String dataType;
	//用于区分入库的数据来源于暂估还是正式的
	private String makeType;
	
	//物资编码
	private String stockNo;
	private Double intoMoney; 
	private Double kcMoney;
	private String joinUnit;

	// Constructors

	/** default constructor */
	public EquGoodsStock() {
	}

	/** minimal constructor */
	public EquGoodsStock(String pid, String conid, String treeuids) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
	}

	/** full constructor */
	public EquGoodsStock(String uids, String pid, String conid,
			String treeuids, String boxNo, String equType, String equPartName,
			String ggxh, String graphNo, String unit, Double stockNum,
			Double weight, String storage, String jzNo, String special,
			String createMan, String createUnit, String recordUser,
			String judgment, String dataType, String makeType, String stockNo,
			Double intoMoney, Double kcMoney, String joinUnit) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.boxNo = boxNo;
		this.equType = equType;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.unit = unit;
		this.stockNum = stockNum;
		this.weight = weight;
		this.storage = storage;
		this.jzNo = jzNo;
		this.special = special;
		this.createMan = createMan;
		this.createUnit = createUnit;
		this.recordUser = recordUser;
		this.judgment = judgment;
		this.dataType = dataType;
		this.makeType = makeType;
		this.stockNo = stockNo;
		this.intoMoney = intoMoney;
		this.kcMoney = kcMoney;
		this.joinUnit = joinUnit;
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

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
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

	public Double getStockNum() {
		return this.stockNum;
	}

	public void setStockNum(Double stockNum) {
		this.stockNum = stockNum;
	}

	public Double getWeight() {
		return this.weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getStorage() {
		return this.storage;
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

	public String getCreateMan() {
		return createMan;
	}

	public void setCreateMan(String createMan) {
		this.createMan = createMan;
	}

	public String getCreateUnit() {
		return createUnit;
	}

	public void setCreateUnit(String createUnit) {
		this.createUnit = createUnit;
	}

	public String getRecordUser() {
		return recordUser;
	}

	public void setRecordUser(String recordUser) {
		this.recordUser = recordUser;
	}

	public String getJudgment() {
		return judgment;
	}

	public void setJudgment(String judgment) {
		this.judgment = judgment;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getMakeType() {
		return makeType;
	}

	public void setMakeType(String makeType) {
		this.makeType = makeType;
	}

	public String getStockNo() {
		return stockNo;
	}

	public void setStockNo(String stockNo) {
		this.stockNo = stockNo;
	}

	public Double getIntoMoney() {
		return intoMoney;
	}

	public void setIntoMoney(Double intoMoney) {
		this.intoMoney = intoMoney;
	}

	public Double getKcMoney() {
		return kcMoney;
	}

	public void setKcMoney(Double kcMoney) {
		this.kcMoney = kcMoney;
	}

	public String getJoinUnit() {
		return joinUnit;
	}

	public void setJoinUnit(String joinUnit) {
		this.joinUnit = joinUnit;
	}

	public String getSpecial() {
		return special;
	}

	public void setSpecial(String special) {
		this.special = special;
	}

}