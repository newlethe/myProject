package com.sgepit.pcmis.bid.hbm;

public class PcBidOverallDTO {
	
	private String pid;
	private Integer zbAppCount;			//招标申请数量
	private Integer zbAppStartCount;	//招标开始数量
	private Integer zbAppEndCount;		//招标结束数量
	private Integer zbConCount;			//签订合同数量
	private Double zbAppSumAmount;		//申请金额总数
	private Double contractSumAmount;	//合同金额总数
	private Double zbAppTbPrice;		//中标金额总数
	private Double bdgMoney;			//概算金额总数
	
	public Double getContractSumAmount() {
		return contractSumAmount;
	}
	public void setContractSumAmount(Double contractSumAmount) {
		this.contractSumAmount = contractSumAmount;
	}
	public Double getZbAppSumAmount() {
		return zbAppSumAmount;
	}
	public void setZbAppSumAmount(Double zbAppSumAmount) {
		this.zbAppSumAmount = zbAppSumAmount;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public Integer getZbAppCount() {
		return zbAppCount;
	}
	public void setZbAppCount(Integer zbAppCount) {
		this.zbAppCount = zbAppCount;
	}
	public Integer getZbAppStartCount() {
		return zbAppStartCount;
	}
	public void setZbAppStartCount(Integer zbAppStartCount) {
		this.zbAppStartCount = zbAppStartCount;
	}
	public Integer getZbAppEndCount() {
		return zbAppEndCount;
	}
	public void setZbAppEndCount(Integer zbAppEndCount) {
		this.zbAppEndCount = zbAppEndCount;
	}
	public Integer getZbConCount() {
		return zbConCount;
	}
	public void setZbConCount(Integer zbConCount) {
		this.zbConCount = zbConCount;
	}
	public Double getZbAppTbPrice() {
		return zbAppTbPrice;
	}
	public void setZbAppTbPrice(Double zbAppTbPrice) {
		this.zbAppTbPrice = zbAppTbPrice;
	}
	public Double getBdgMoney() {
		return bdgMoney;
	}
	public void setBdgMoney(Double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}
	
}
