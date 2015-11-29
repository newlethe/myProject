package com.sgepit.frame.flow.hbm;

public class VFlowStatistics {
	private  static int overHour = 24; //流程处理超时时间，默认24小时
	
	private String userid;
	private String posid;
	private String posname;
	private String username;
	private String unitid;
	private String unit2id;
	private String unit3id;
	private String csum;
	private String psum;
	private String oversum;
	private String usum;
	private String overusum;
	private Long vieworder;
	

	//Constructor
	public VFlowStatistics(){}
	
	public VFlowStatistics(String userid,String posid,String posname, String username, String unitid, 
								String unit2id, String unit3id, String csum,Long vieworder,
								String psum, String usum, String overusum)
	{
		this.userid = userid;
		this.posid = posid;
		this.posname = posname;
		this.username = username;
		this.unitid = unitid;
		this.unit2id = unit2id;
		this.unit3id = unit3id;
		this.csum = csum;
		this.psum = psum;
		this.usum = usum;
		this.overusum = overusum;
		this.vieworder = vieworder;
	}
	
	public VFlowStatistics(String userid, String username, String unitid, 
								String unit2id, String unit3id, String csum, 
								String psum, String oversum, String usum,String overusum)
	{
		this.userid = userid;
		this.username = username;
		this.unitid = unitid;
		this.unit2id = unit2id;
		this.unit3id = unit3id;
		this.csum = csum;
		this.psum = psum;
		this.oversum = oversum;
		this.usum = usum;
		this.overusum = overusum;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUnitid() {
		return unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

	public String getUnit2id() {
		return unit2id;
	}

	public void setUnit2id(String unit2id) {
		this.unit2id = unit2id;
	}

	public String getUnit3id() {
		return unit3id;
	}

	public void setUnit3id(String unit3id) {
		this.unit3id = unit3id;
	}

	public String getCsum() {
		return csum;
	}

	public void setCsum(String csum) {
		this.csum = csum;
	}

	public String getPsum() {
		return psum;
	}

	public void setPsum(String psum) {
		this.psum = psum;
	}

	public String getOversum() {
		return oversum;
	}

	public void setOversum(String oversum) {
		this.oversum = oversum;
	}

	public String getUsum() {
		return usum;
	}

	public void setUsum(String usum) {
		this.usum = usum;
	}

	public static int getOverHour() {
		return overHour;
	}

	public static void setOverHour(int overHour) {
		VFlowStatistics.overHour = overHour;
	}

	public String getOverusum() {
		return overusum;
	}

	public void setOverusum(String overusum) {
		this.overusum = overusum;
	}

	public String getPosid() {
		return posid;
	}

	public void setPosid(String posid) {
		this.posid = posid;
	}

	public String getPosname() {
		return posname;
	}

	public void setPosname(String posname) {
		this.posname = posname;
	}

	public Long getVieworder() {
		return vieworder;
	}

	public void setVieworder(Long vieworder) {
		this.vieworder = vieworder;
	}
	
}
