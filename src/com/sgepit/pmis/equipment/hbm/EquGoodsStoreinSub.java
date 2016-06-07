package com.sgepit.pmis.equipment.hbm;

public class EquGoodsStoreinSub  implements java.io.Serializable {

	// Fields

	private String uids;
	private String ggxh;
	private String memo;
	private String pid;
	private String sbrkUids;
	private String boxNo;
	private String warehouseType;
	private String warehouseName;
	private String graphNo;
	private String unit;
	private Double warehouseNum;
	private Double inWarehouseNo;
	private Double intoMoney;
	private Double totalMoney;
	private String equno;
	private String boxSubId;
	private Double weight;
    private String jzNo;
	private String stockno;
	private Double taxes;
	private Double totalnum;
	private Double unitPrice;
	private Double amountMoney;
	private Double freightMoney;
	private Double insuranceMoney;
	private Double antherMoney;
	private Double amountTax;
	private Double freightTax;
	private Double insuranceTax;
	private Double antherTax;
	private String equSubUids;
	private String amountRate;
	
	private String treeuids;//入库明细获取开箱检验明细的设备合同分类树
	// Constructors

	/** default constructor */
	public EquGoodsStoreinSub() {
	}

	/** minimal constructor */
	public EquGoodsStoreinSub(String uids, String pid) {
		this.uids = uids;
		this.pid = pid;
	}

	/** full constructor */
	public EquGoodsStoreinSub(String uids, String ggxh, String memo,
			String pid, String sbrkUids, String boxNo, String warehouseType,
			String warehouseName, String graphNo, String unit,
			Double warehouseNum, Double inWarehouseNo, Double intoMoney,
			Double totalMoney, String equno, String boxSubId, Double weight,
			String jzNo, String stockno, Double taxes, Double totalnum,
			Double unitPrice, Double amountMoney, Double freightMoney,
			Double insuranceMoney, Double antherMoney, Double amountTax,
			Double freightTax, Double insuranceTax, Double antherTax,
			String equSubUids) {
		super();
		this.uids = uids;
		this.ggxh = ggxh;
		this.memo = memo;
		this.pid = pid;
		this.sbrkUids = sbrkUids;
		this.boxNo = boxNo;
		this.warehouseType = warehouseType;
		this.warehouseName = warehouseName;
		this.graphNo = graphNo;
		this.unit = unit;
		this.warehouseNum = warehouseNum;
		this.inWarehouseNo = inWarehouseNo;
		this.intoMoney = intoMoney;
		this.totalMoney = totalMoney;
		this.equno = equno;
		this.boxSubId = boxSubId;
		this.weight = weight;
		this.jzNo = jzNo;
		this.stockno = stockno;
		this.taxes = taxes;
		this.totalnum = totalnum;
		this.unitPrice = unitPrice;
		this.amountMoney = amountMoney;
		this.freightMoney = freightMoney;
		this.insuranceMoney = insuranceMoney;
		this.antherMoney = antherMoney;
		this.amountTax = amountTax;
		this.freightTax = freightTax;
		this.insuranceTax = insuranceTax;
		this.antherTax = antherTax;
		this.equSubUids = equSubUids;
	}

	public EquGoodsStoreinSub(String uids, String ggxh, String memo,
			String pid, String sbrkUids, String boxNo, String warehouseType,
			String warehouseName, String graphNo, String unit,
			Double warehouseNum, Double inWarehouseNo, Double intoMoney,
			Double totalMoney, String equno, String boxSubId, Double weight,
			String jzNo, String stockno, Double taxes, Double totalnum,
			Double unitPrice, Double amountMoney, Double freightMoney,
			Double insuranceMoney, Double antherMoney, Double amountTax,
			Double freightTax, Double insuranceTax, Double antherTax,
			String equSubUids, String amountRate) {
		super();
		this.uids = uids;
		this.ggxh = ggxh;
		this.memo = memo;
		this.pid = pid;
		this.sbrkUids = sbrkUids;
		this.boxNo = boxNo;
		this.warehouseType = warehouseType;
		this.warehouseName = warehouseName;
		this.graphNo = graphNo;
		this.unit = unit;
		this.warehouseNum = warehouseNum;
		this.inWarehouseNo = inWarehouseNo;
		this.intoMoney = intoMoney;
		this.totalMoney = totalMoney;
		this.equno = equno;
		this.boxSubId = boxSubId;
		this.weight = weight;
		this.jzNo = jzNo;
		this.stockno = stockno;
		this.taxes = taxes;
		this.totalnum = totalnum;
		this.unitPrice = unitPrice;
		this.amountMoney = amountMoney;
		this.freightMoney = freightMoney;
		this.insuranceMoney = insuranceMoney;
		this.antherMoney = antherMoney;
		this.amountTax = amountTax;
		this.freightTax = freightTax;
		this.insuranceTax = insuranceTax;
		this.antherTax = antherTax;
		this.equSubUids = equSubUids;
		this.amountRate = amountRate;
	}

	// Property accessors
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getSbrkUids() {
		return sbrkUids;
	}

	public void setSbrkUids(String sbrkUids) {
		this.sbrkUids = sbrkUids;
	}

	public String getBoxNo() {
		return boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
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

	public Double getWarehouseNum() {
		return warehouseNum;
	}

	public void setWarehouseNum(Double warehouseNum) {
		this.warehouseNum = warehouseNum;
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

	public String getEquno() {
		return equno;
	}

	public void setEquno(String equno) {
		this.equno = equno;
	}

	public String getBoxSubId() {
		return boxSubId;
	}

	public void setBoxSubId(String boxSubId) {
		this.boxSubId = boxSubId;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getJzNo() {
		return jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
	}

	public String getStockno() {
		return stockno;
	}

	public void setStockno(String stockno) {
		this.stockno = stockno;
	}

	public Double getTaxes() {
		return taxes;
	}

	public void setTaxes(Double taxes) {
		this.taxes = taxes;
	}

	public Double getTotalnum() {
		return totalnum;
	}

	public void setTotalnum(Double totalnum) {
		this.totalnum = totalnum;
	}

	public Double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Double unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Double getAmountMoney() {
		return amountMoney;
	}

	public void setAmountMoney(Double amountMoney) {
		this.amountMoney = amountMoney;
	}

	public Double getFreightMoney() {
		return freightMoney;
	}

	public void setFreightMoney(Double freightMoney) {
		this.freightMoney = freightMoney;
	}

	public Double getInsuranceMoney() {
		return insuranceMoney;
	}

	public void setInsuranceMoney(Double insuranceMoney) {
		this.insuranceMoney = insuranceMoney;
	}

	public Double getAntherMoney() {
		return antherMoney;
	}

	public void setAntherMoney(Double antherMoney) {
		this.antherMoney = antherMoney;
	}

	public Double getAmountTax() {
		return amountTax;
	}

	public void setAmountTax(Double amountTax) {
		this.amountTax = amountTax;
	}

	public Double getFreightTax() {
		return freightTax;
	}

	public void setFreightTax(Double freightTax) {
		this.freightTax = freightTax;
	}

	public Double getInsuranceTax() {
		return insuranceTax;
	}

	public void setInsuranceTax(Double insuranceTax) {
		this.insuranceTax = insuranceTax;
	}

	public Double getAntherTax() {
		return antherTax;
	}

	public void setAntherTax(Double antherTax) {
		this.antherTax = antherTax;
	}

	public String getEquSubUids() {
		return equSubUids;
	}

	public void setEquSubUids(String equSubUids) {
		this.equSubUids = equSubUids;
	}

	public String getAmountRate() {
		return amountRate;
	}

	public void setAmountRate(String amountRate) {
		this.amountRate = amountRate;
	}

	public String getTreeuids() {
		return treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
	}

}
