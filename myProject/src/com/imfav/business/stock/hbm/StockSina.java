
package com.imfav.business.stock.hbm;
/**
 * 类说明
 * @author zhangh
 * @version 创建时间：2015年12月6日 下午11:35:24
 */
public class StockSina {
	
	private String stockNo;
	private String stockName;
	private Double openPosition;
	private Long haveNumber;
	private Double nowPrice;
	
	public String getStockNo() {
		return stockNo;
	}
	public void setStockNo(String stockNo) {
		this.stockNo = stockNo;
	}
	public String getStockName() {
		return stockName;
	}
	public void setStockName(String stockName) {
		this.stockName = stockName;
	}
	public Double getOpenPosition() {
		return openPosition;
	}
	public void setOpenPosition(Double openPosition) {
		this.openPosition = openPosition;
	}
	public Long getHaveNumber() {
		return haveNumber;
	}
	public void setHaveNumber(Long haveNumber) {
		this.haveNumber = haveNumber;
	}
	public Double getNowPrice() {
		return nowPrice;
	}
	public void setNowPrice(Double nowPrice) {
		this.nowPrice = nowPrice;
	}
}
