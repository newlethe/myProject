package com.sgepit.pcmis.bid.hbm;
/*
 * 招标公告与招标内容的关系表
 * */
public class PcBidNoticeContent {
	String uids;
	String contentuids;
	String noticeuids;
	String pid;
	public PcBidNoticeContent(){
		
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getContentuids() {
		return contentuids;
	}
	public void setContentuids(String contentuids) {
		this.contentuids = contentuids;
	}
	public String getNoticeuids() {
		return noticeuids;
	}
	public void setNoticeuids(String noticeuids) {
		this.noticeuids = noticeuids;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public PcBidNoticeContent(String uids, String contentuids,
			String noticeuids, String pid) {
		this.uids = uids;
		this.contentuids = contentuids;
		this.noticeuids = noticeuids;
		this.pid = pid;
	}
}
