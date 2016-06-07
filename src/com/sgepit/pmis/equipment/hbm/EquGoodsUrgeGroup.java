package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsUrgeGroup entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsUrgeGroup implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String groupname;
	private String jzDateId;

	// Constructors

	/** default constructor */
	public EquGoodsUrgeGroup() {
	}

	/** full constructor */
	public EquGoodsUrgeGroup(String pid, String groupname, String jzDateId) {
		this.pid = pid;
		this.groupname = groupname;
		this.jzDateId = jzDateId;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getGroupname() {
		return this.groupname;
	}

	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}

	public String getJzDateId() {
		return this.jzDateId;
	}

	public void setJzDateId(String jzDateId) {
		this.jzDateId = jzDateId;
	}

}