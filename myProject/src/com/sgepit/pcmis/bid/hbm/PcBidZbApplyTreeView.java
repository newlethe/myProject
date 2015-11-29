package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidZbApplyTreeView entity. @author MyEclipse Persistence Tools
 */

public class PcBidZbApplyTreeView implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String parentid;
	private String treeid;
	private Long isleaf;
	private String zbName;
	private Date startDate;
	private String pbWays;
	private String tbUnit;
	private Double tbPrice;
	private String agencyName;

	// Constructors

	/** default constructor */
	public PcBidZbApplyTreeView() {
	}

	/** full constructor */
	public PcBidZbApplyTreeView(String pid, String parentid, String treeid,
			Long isleaf, String zbName, Date startDate, String pbWays,
			String tbUnit, Double tbPrice, String agencyName) {
		this.pid = pid;
		this.parentid = parentid;
		this.treeid = treeid;
		this.isleaf = isleaf;
		this.zbName = zbName;
		this.startDate = startDate;
		this.pbWays = pbWays;
		this.tbUnit = tbUnit;
		this.tbPrice = tbPrice;
		this.agencyName = agencyName;
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

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getZbName() {
		return this.zbName;
	}

	public void setZbName(String zbName) {
		this.zbName = zbName;
	}

	public Date getStartDate() {
		return this.startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public String getPbWays() {
		return this.pbWays;
	}

	public void setPbWays(String pbWays) {
		this.pbWays = pbWays;
	}

	public String getTbUnit() {
		return this.tbUnit;
	}

	public void setTbUnit(String tbUnit) {
		this.tbUnit = tbUnit;
	}

	public Double getTbPrice() {
		return this.tbPrice;
	}

	public void setTbPrice(Double tbPrice) {
		this.tbPrice = tbPrice;
	}

	public String getAgencyName() {
		return this.agencyName;
	}

	public void setAgencyName(String agencyName) {
		this.agencyName = agencyName;
	}

}