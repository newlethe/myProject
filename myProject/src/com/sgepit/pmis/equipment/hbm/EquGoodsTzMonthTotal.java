package com.sgepit.pmis.equipment.hbm;

/**
 * 用于国峰月度库存物资月度汇总表
 * @author pengy 2014-08-07
 */
public class EquGoodsTzMonthTotal implements java.io.Serializable {

	// Fields

	private String type;
	private Double finiStockMoney;//期初金额累计
	private Double zgFiniStockMoney;//暂估入库期初
	private Double zsInAmount;//正式入库收入金额
	private Double zgInAmount;//暂估入库收入金额
	private Double chInAmount;//冲回入库收入金额
	private Double outAmount;//发出金额累计
	private Double stockMoney;//结存金额累计

	// Constructors

	/** default constructor */
	public EquGoodsTzMonthTotal() {
	}

	/** full constructor */
	public EquGoodsTzMonthTotal(String type, Double finiStockMoney,
			Double zgFiniStockMoney, Double zsInAmount, Double zgInAmount,
			Double chInAmount, Double outAmount, Double stockMoney) {
		super();
		this.type = type;
		this.finiStockMoney = finiStockMoney;
		this.zgFiniStockMoney = zgFiniStockMoney;
		this.zsInAmount = zsInAmount;
		this.zgInAmount = zgInAmount;
		this.chInAmount = chInAmount;
		this.outAmount = outAmount;
		this.stockMoney = stockMoney;
	}

	// Property accessors
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Double getFiniStockMoney() {
		return finiStockMoney;
	}

	public void setFiniStockMoney(Double finiStockMoney) {
		this.finiStockMoney = finiStockMoney;
	}

	public Double getZgFiniStockMoney() {
		return zgFiniStockMoney;
	}

	public void setZgFiniStockMoney(Double zgFiniStockMoney) {
		this.zgFiniStockMoney = zgFiniStockMoney;
	}

	public Double getZsInAmount() {
		return zsInAmount;
	}

	public void setZsInAmount(Double zsInAmount) {
		this.zsInAmount = zsInAmount;
	}

	public Double getZgInAmount() {
		return zgInAmount;
	}

	public void setZgInAmount(Double zgInAmount) {
		this.zgInAmount = zgInAmount;
	}

	public Double getChInAmount() {
		return chInAmount;
	}

	public void setChInAmount(Double chInAmount) {
		this.chInAmount = chInAmount;
	}

	public Double getOutAmount() {
		return outAmount;
	}

	public void setOutAmount(Double outAmount) {
		this.outAmount = outAmount;
	}

	public Double getStockMoney() {
		return stockMoney;
	}

	public void setStockMoney(Double stockMoney) {
		this.stockMoney = stockMoney;
	}

}