package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

public class ArrivalGoodsLog implements java.io.Serializable {
	private String uids;
	private Date arrivaltime;
	private String memo;
	/** default constructor */
	public ArrivalGoodsLog() {
	} 
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public ArrivalGoodsLog(String uids, Date arrivaltime, String memo) {
		super();
		this.uids = uids;
		this.arrivaltime = arrivaltime;
		this.memo = memo;
	}
	public Date getArrivaltime() {
		return arrivaltime;
	}
	public void setArrivaltime(Date arrivaltime) {
		this.arrivaltime = arrivaltime;
	}
	
	
}
