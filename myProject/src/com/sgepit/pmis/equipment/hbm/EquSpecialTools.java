package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

public class EquSpecialTools implements java.io.Serializable{

	 private String uids;
	 private String pid;
	 private String dept;
	 private String deptuser;
	 private String state;
	 private Date usetime;
	 private String memo;
	 private String bh;
	public EquSpecialTools(String uids, String pid, String dept, String deptuser,
			String state, Date usetime, String memo) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.dept = dept;
		this.deptuser = deptuser;
		this.state = state;
		this.usetime = usetime;
		this.memo = memo;
	}

	public EquSpecialTools() {
		
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getDept() {
		return dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public String getDeptuser() {
		return deptuser;
	}

	public void setDeptuser(String deptuser) {
		this.deptuser = deptuser;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public Date getUsetime() {
		return usetime;
	}

	public void setUsetime(Date usetime) {
		this.usetime = usetime;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getBh() {
		return bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	
	
}
