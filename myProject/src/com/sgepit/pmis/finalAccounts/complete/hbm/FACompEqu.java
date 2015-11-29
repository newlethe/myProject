package com.sgepit.pmis.finalAccounts.complete.hbm;
/**
 * 工程基本信息-主要设备表
 * @author pengy
 * @createtime 2013-06-27
 */
public class FACompEqu {
	
	private String uids;
	private String pid;
	private String equNo;
	private String equName;
	private String equModel;
	private String equMaker;
	private Double equPrice;
	
	public FACompEqu() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public FACompEqu(String uids, String pid, String equNo, String equName,
			String equModel, String equMaker, Double equPrice) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.equNo = equNo;
		this.equName = equName;
		this.equModel = equModel;
		this.equMaker = equMaker;
		this.equPrice = equPrice;
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

	public String getEquNo() {
		return equNo;
	}

	public void setEquNo(String equNo) {
		this.equNo = equNo;
	}

	public String getEquName() {
		return equName;
	}

	public void setEquName(String equName) {
		this.equName = equName;
	}

	public String getEquModel() {
		return equModel;
	}

	public void setEquModel(String equModel) {
		this.equModel = equModel;
	}

	public String getEquMaker() {
		return equMaker;
	}

	public void setEquMaker(String equMaker) {
		this.equMaker = equMaker;
	}

	public Double getEquPrice() {
		return equPrice;
	}

	public void setEquPrice(Double equPrice) {
		this.equPrice = equPrice;
	}
	
}
