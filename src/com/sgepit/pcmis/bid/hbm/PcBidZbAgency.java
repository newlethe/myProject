package com.sgepit.pcmis.bid.hbm;

/**
 * PcBidZbAgency entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcBidZbAgency implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String zbUids;
	private String agencyName;
	private String respondDept;
	private String respondUser;
	private String memo;

	// Constructors

	/** default constructor */
	public PcBidZbAgency() {
	}

	/** minimal constructor */
	public PcBidZbAgency(String zbUids, String agencyName, String respondDept,
			String respondUser) {
		this.zbUids = zbUids;
		this.agencyName = agencyName;
		this.respondDept = respondDept;
		this.respondUser = respondUser;
	}

	/** full constructor */
	public PcBidZbAgency(String pid, String zbUids, String agencyName,
			String respondDept, String respondUser, String memo) {
		this.pid = pid;
		this.zbUids = zbUids;
		this.agencyName = agencyName;
		this.respondDept = respondDept;
		this.respondUser = respondUser;
		this.memo = memo;
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

	public String getZbUids() {
		return this.zbUids;
	}

	public void setZbUids(String zbUids) {
		this.zbUids = zbUids;
	}

	public String getAgencyName() {
		return this.agencyName;
	}

	public void setAgencyName(String agencyName) {
		this.agencyName = agencyName;
	}

	public String getRespondDept() {
		return this.respondDept;
	}

	public void setRespondDept(String respondDept) {
		this.respondDept = respondDept;
	}

	public String getRespondUser() {
		return this.respondUser;
	}

	public void setRespondUser(String respondUser) {
		this.respondUser = respondUser;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}