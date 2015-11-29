package com.sgepit.pcmis.jdgk.hbm;

/**
 * PcEdoProjectRate entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcEdoProjectRate implements java.io.Serializable {

	// Fields

	private String uids;
	private String sjType;
	private String pid;
	private String reportUid;
	private String rate;
	private String memo1;
	private String memo2;
	private String unitId;
	private String zbSeqno;

	// Constructors

	/** default constructor */
	public PcEdoProjectRate() {
	}

	/** minimal constructor */
	public PcEdoProjectRate(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public PcEdoProjectRate(String uids, String sjType, String pid,
			String reportUid, String rate, String memo1, String memo2,
			String unitId, String zbSeqno) {
		this.uids = uids;
		this.sjType = sjType;
		this.pid = pid;
		this.reportUid = reportUid;
		this.rate = rate;
		this.memo1 = memo1;
		this.memo2 = memo2;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getReportUid() {
		return this.reportUid;
	}

	public void setReportUid(String reportUid) {
		this.reportUid = reportUid;
	}

	public String getRate() {
		return this.rate;
	}

	public void setRate(String rate) {
		this.rate = rate;
	}

	public String getMemo1() {
		return this.memo1;
	}

	public void setMemo1(String memo1) {
		this.memo1 = memo1;
	}

	public String getMemo2() {
		return this.memo2;
	}

	public void setMemo2(String memo2) {
		this.memo2 = memo2;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getZbSeqno() {
		return this.zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
	}

}