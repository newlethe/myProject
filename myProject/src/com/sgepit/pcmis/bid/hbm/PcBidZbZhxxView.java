package com.sgepit.pcmis.bid.hbm;

public class PcBidZbZhxxView implements java.io.Serializable{
	private String uids;//评标报告
	private String contentes;//招标内容
	private String zbName;//招标项目
	private String pid;
	private String zbUids;//招标信息主键
	private String pubDocument;//招标公告
	private String pbWays;//评标方法
	private String zbUnit;//中标单位
	
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getContentes() {
		return contentes;
	}
	public void setContentes(String contentes) {
		this.contentes = contentes;
	}
	public String getZbName() {
		return zbName;
	}
	public void setZbName(String zbName) {
		this.zbName = zbName;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getZbUids() {
		return zbUids;
	}
	public void setZbUids(String zbUids) {
		this.zbUids = zbUids;
	}
	public String getPubDocument() {
		return pubDocument;
	}
	public void setPubDocument(String pubDocument) {
		this.pubDocument = pubDocument;
	}
	public String getPbWays() {
		return pbWays;
	}
	public void setPbWays(String pbWays) {
		this.pbWays = pbWays;
	}
	public String getZbUnit() {
		return zbUnit;
	}
	public void setZbUnit(String zbUnit) {
		this.zbUnit = zbUnit;
	}
	
}
