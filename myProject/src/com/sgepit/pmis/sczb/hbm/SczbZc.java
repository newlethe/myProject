package com.sgepit.pmis.sczb.hbm;

import java.io.Serializable;

public class SczbZc implements Serializable {
	private String uids;
	private String zcName;
	private String ifUse;
	private String pid;
	private String orders;
	
	public String getOrders() {
		return orders;
	}

	public void setOrders(String orders) {
		this.orders = orders;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getZcName() {
		return zcName;
	}

	public void setZcName(String zcName) {
		this.zcName = zcName;
	}

	public String getIfUse() {
		return ifUse;
	}

	public void setIfUse(String ifUse) {
		this.ifUse = ifUse;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}
