package com.sgepit.pmis.equipment.hbm;

public class EquSpecialToolsDetail implements java.io.Serializable{

	 private String uids;
	 private String masteruids;
	 private String toolstype;
	 private String toolsname;
	 private String toolsxh;
	 private String state;
	 private Double jcnum;
	 private Double ghnum;
	 private Double syjcnum;
	 private String memo;
	 private String xjh;
	 private String conid;
	 private String stockid;
	 private String bh;
	public EquSpecialToolsDetail(String uids, String masteruids,
			String toolstype, String toolsname, String toolsxh, String state,
			Double jcnum, Double ghnum, Double syjcnum, String memo) {
		super();
		this.uids = uids;
		this.masteruids = masteruids;
		this.toolstype = toolstype;
		this.toolsname = toolsname;
		this.toolsxh = toolsxh;
		this.state = state;
		this.jcnum = jcnum;
		this.ghnum = ghnum;
		this.syjcnum = syjcnum;
		this.memo = memo;
	}

	public EquSpecialToolsDetail() {
		
	}

	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getMasteruids() {
		return masteruids;
	}
	public void setMasteruids(String masteruids) {
		this.masteruids = masteruids;
	}
	public String getToolstype() {
		return toolstype;
	}
	public void setToolstype(String toolstype) {
		this.toolstype = toolstype;
	}
	public String getToolsname() {
		return toolsname;
	}
	public void setToolsname(String toolsname) {
		this.toolsname = toolsname;
	}
	public String getToolsxh() {
		return toolsxh;
	}
	public void setToolsxh(String toolsxh) {
		this.toolsxh = toolsxh;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public Double getJcnum() {
		return jcnum;
	}
	public void setJcnum(Double jcnum) {
		this.jcnum = jcnum;
	}
	public Double getGhnum() {
		return ghnum;
	}
	public void setGhnum(Double ghnum) {
		this.ghnum = ghnum;
	}
	public Double getSyjcnum() {
		return syjcnum;
	}
	public void setSyjcnum(Double syjcnum) {
		this.syjcnum = syjcnum;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getXjh() {
		return xjh;
	}

	public void setXjh(String xjh) {
		this.xjh = xjh;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getStockid() {
		return stockid;
	}

	public void setStockid(String stockid) {
		this.stockid = stockid;
	}

	public String getBh() {
		return bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}
	
}










