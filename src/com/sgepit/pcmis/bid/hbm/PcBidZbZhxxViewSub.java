package com.sgepit.pcmis.bid.hbm;

public class PcBidZbZhxxViewSub implements java.io.Serializable{
	private String uids;//评标报告
	private String contentUids;//招标内容主键
	private String tbUnit;//投标单位
	private String pid;
	private String preHearResult;//预审结果
	private Double offer;//报价
	
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getContentUids() {
		return contentUids;
	}
	public void setContentUids(String contentUids) {
		this.contentUids = contentUids;
	}
	public String getTbUnit() {
		return tbUnit;
	}
	public void setTbUnit(String tbUnit) {
		this.tbUnit = tbUnit;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getPreHearResult() {
		return preHearResult;
	}
	public void setPreHearResult(String preHearResult) {
		this.preHearResult = preHearResult;
	}
	public Double getOffer() {
		return offer;
	}
	public void setOffer(Double offer) {
		this.offer = offer;
	}
}
