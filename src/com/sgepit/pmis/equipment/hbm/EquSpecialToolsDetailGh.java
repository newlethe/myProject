package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

public class EquSpecialToolsDetailGh implements java.io.Serializable{
	
	private String uids;
	private String detailuids;
	private String deptuser;
	private Double ghnum;
	private Date ghtime;
	private String memo;
	
	public EquSpecialToolsDetailGh() {
		
	}
	public String getUids() {
		return uids;
	}



	public void setUids(String uids) {
		this.uids = uids;
	}



	public String getDetailuids() {
		return detailuids;
	}



	public void setDetailuids(String detailuids) {
		this.detailuids = detailuids;
	}



	public String getDeptuser() {
		return deptuser;
	}



	public void setDeptuser(String deptuser) {
		this.deptuser = deptuser;
	}



	public Double getGhnum() {
		return ghnum;
	}



	public void setGhnum(Double ghnum) {
		this.ghnum = ghnum;
	}



	public Date getGhtime() {
		return ghtime;
	}



	public void setGhtime(Date ghtime) {
		this.ghtime = ghtime;
	}



	public String getMemo() {
		return memo;
	}



	public void setMemo(String memo) {
		this.memo = memo;
	}
	public EquSpecialToolsDetailGh(String uids, String detailuids,
			String deptuser, Double ghnum, Date ghtime, String memo) {
		super();
		this.uids = uids;
		this.detailuids = detailuids;
		this.deptuser = deptuser;
		this.ghnum = ghnum;
		this.ghtime = ghtime;
		this.memo = memo;
	}
}
