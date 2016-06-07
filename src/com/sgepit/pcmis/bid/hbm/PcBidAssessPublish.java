package com.sgepit.pcmis.bid.hbm;

public class PcBidAssessPublish {
	private String uids;
	private String pid;
	private String contentUids;
	private String assessResult;
	private String memo;
	private String tbUnit;
	
	public String getTbUnit() {
		return tbUnit;
	}
	public void setTbUnit(String tbUnit) {
		this.tbUnit = tbUnit;
	}
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
	public String getContentUids() {
		return contentUids;
	}
	public void setContentUids(String contentUids) {
		this.contentUids = contentUids;
	}
	public String getAssessResult() {
		return assessResult;
	}
	public void setAssessResult(String assessResult) {
		this.assessResult = assessResult;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
}
