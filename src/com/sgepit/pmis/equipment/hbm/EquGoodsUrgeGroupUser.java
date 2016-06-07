package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsUrgeGroupUser entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsUrgeGroupUser implements java.io.Serializable {

	// Fields

	private String uids;
	private String groupid;
	private String userid;
	private String jzDateId;

	// Constructors

	/** default constructor */
	public EquGoodsUrgeGroupUser() {
	}

	/** full constructor */
	public EquGoodsUrgeGroupUser(String groupid, String userid, String jzDateId) {
		this.groupid = groupid;
		this.userid = userid;
		this.jzDateId = jzDateId;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getGroupid() {
		return this.groupid;
	}

	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getJzDateId() {
		return this.jzDateId;
	}

	public void setJzDateId(String jzDateId) {
		this.jzDateId = jzDateId;
	}

}