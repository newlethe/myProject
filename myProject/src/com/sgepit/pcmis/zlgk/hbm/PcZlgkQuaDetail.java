package com.sgepit.pcmis.zlgk.hbm;

/**
 * PcZlgkQuaDetail entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcZlgkQuaDetail implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String masterId;
	private String jyxmbh;
	private String jyxmlx;
	private String sjType;
	private Double byhgs;
	private Double bybhgs;
	private Double byhgl;
	private Double ljhgs;
	private Double ljbhgs;
	private Double ljhgl;

	// Constructors

	/** default constructor */
	public PcZlgkQuaDetail() {
	}

	/** minimal constructor */
	public PcZlgkQuaDetail(String uids, String pid, String jyxmbh,
			String jyxmlx, String sjType) {
		this.uids = uids;
		this.pid = pid;
		this.jyxmbh = jyxmbh;
		this.jyxmlx = jyxmlx;
		this.sjType = sjType;
	}

	/** full constructor */
	public PcZlgkQuaDetail(String uids, String pid, String masterId,
			String jyxmbh, String jyxmlx, String sjType, Double byhgs,
			Double bybhgs, Double byhgl, Double ljhgs, Double ljbhgs,
			Double ljhgl) {
		this.uids = uids;
		this.pid = pid;
		this.masterId = masterId;
		this.jyxmbh = jyxmbh;
		this.jyxmlx = jyxmlx;
		this.sjType = sjType;
		this.byhgs = byhgs;
		this.bybhgs = bybhgs;
		this.byhgl = byhgl;
		this.ljhgs = ljhgs;
		this.ljbhgs = ljbhgs;
		this.ljhgl = ljhgl;
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

	public String getMasterId() {
		return this.masterId;
	}

	public void setMasterId(String masterId) {
		this.masterId = masterId;
	}

	public String getJyxmbh() {
		return this.jyxmbh;
	}

	public void setJyxmbh(String jyxmbh) {
		this.jyxmbh = jyxmbh;
	}

	public String getJyxmlx() {
		return this.jyxmlx;
	}

	public void setJyxmlx(String jyxmlx) {
		this.jyxmlx = jyxmlx;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public Double getByhgs() {
		return this.byhgs;
	}

	public void setByhgs(Double byhgs) {
		this.byhgs = byhgs;
	}

	public Double getBybhgs() {
		return this.bybhgs;
	}

	public void setBybhgs(Double bybhgs) {
		this.bybhgs = bybhgs;
	}

	public Double getByhgl() {
		return this.byhgl;
	}

	public void setByhgl(Double byhgl) {
		this.byhgl = byhgl;
	}

	public Double getLjhgs() {
		return this.ljhgs;
	}

	public void setLjhgs(Double ljhgs) {
		this.ljhgs = ljhgs;
	}

	public Double getLjbhgs() {
		return this.ljbhgs;
	}

	public void setLjbhgs(Double ljbhgs) {
		this.ljbhgs = ljbhgs;
	}

	public Double getLjhgl() {
		return this.ljhgl;
	}

	public void setLjhgl(Double ljhgl) {
		this.ljhgl = ljhgl;
	}

}