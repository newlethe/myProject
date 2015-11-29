package com.sgepit.pmis.budget.hbm;

/**
 * ViewBdgMonthMonenyHz entity.
 * 
 * @author MyEclipse Persistence Tools
 */
public class ViewBdgMonthMonenyHz implements java.io.Serializable {
	private String uids;
	private String unitid;
	private Long summoney;
	private String sbsj;
	public ViewBdgMonthMonenyHz(){}
	public ViewBdgMonthMonenyHz(String uids){this.uids=uids;}
	
	public ViewBdgMonthMonenyHz(String uids,String unitid, Long summoney, String sbsj) {
		super();
		this.uids = uids;
		this.unitid = unitid;
		this.summoney = summoney;
		this.sbsj = sbsj;
	}
	public String getUnitid() {
		return unitid;
	}
	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}
	public Long getSummoney() {
		return summoney;
	}
	public void setSummoney(Long summoney) {
		this.summoney = summoney;
	}
	public String getSbsj() {
		return sbsj;
	}
	public void setSbsj(String sbsj) {
		this.sbsj = sbsj;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}

}