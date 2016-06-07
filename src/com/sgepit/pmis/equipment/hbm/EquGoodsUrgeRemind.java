package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsUrgeRemind entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsUrgeRemind implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String remindType;
	private String mainid;
	private String userid;
	private String jzDateId;

	// Constructors

	/** default constructor */
	public EquGoodsUrgeRemind() {
	}

	/** minimal constructor */
	public EquGoodsUrgeRemind(String pid, String remindType, String jzDateId) {
		this.pid = pid;
		this.remindType = remindType;
		this.jzDateId = jzDateId;
	}

	/** full constructor */
	public EquGoodsUrgeRemind(String pid, String remindType, 
			String mainid, String userid, String jzDateId) {
		this.pid = pid;
		this.remindType = remindType;
		this.mainid = mainid;
		this.userid = userid;
		this.jzDateId = jzDateId;
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

	public String getRemindType() {
		return remindType;
	}

	public void setRemindType(String remindType) {
		this.remindType = remindType;
	}

	public String getMainid() {
		return mainid;
	}

	public void setMainid(String mainid) {
		this.mainid = mainid;
	}

	public String getJzDateId() {
		return jzDateId;
	}

	public void setJzDateId(String jzDateId) {
		this.jzDateId = jzDateId;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	// Property accessors

	

}