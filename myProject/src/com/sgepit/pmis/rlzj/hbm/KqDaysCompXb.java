package com.sgepit.pmis.rlzj.hbm;

/**
 * KqDaysCompXb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class KqDaysCompXb implements java.io.Serializable {

	// Fields

	private String detailId;
	private String masterlsh;
	private String sjType;
	private String zbSeqno;
	private String unitId;
	private String val1;
	private String val2;
	private String val3;
	private String memo;

	// Constructors

	/** default constructor */
	public KqDaysCompXb() {
	}

	/** minimal constructor */
	public KqDaysCompXb(String detailId, String masterlsh, String sjType,
			String unitId) {
		this.detailId = detailId;
		this.masterlsh = masterlsh;
		this.sjType = sjType;
		this.unitId = unitId;
	}

	/** full constructor */
	public KqDaysCompXb(String detailId, String masterlsh, String sjType,
			String zbSeqno, String unitId, String val1, String val2,
			String val3, String memo) {
		this.detailId = detailId;
		this.masterlsh = masterlsh;
		this.sjType = sjType;
		this.zbSeqno = zbSeqno;
		this.unitId = unitId;
		this.val1 = val1;
		this.val2 = val2;
		this.val3 = val3;
		this.memo = memo;
	}

	// Property accessors

	public String getDetailId() {
		return this.detailId;
	}

	public void setDetailId(String detailId) {
		this.detailId = detailId;
	}

	public String getMasterlsh() {
		return this.masterlsh;
	}

	public void setMasterlsh(String masterlsh) {
		this.masterlsh = masterlsh;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getZbSeqno() {
		return this.zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getVal1() {
		return this.val1;
	}

	public void setVal1(String val1) {
		this.val1 = val1;
	}

	public String getVal2() {
		return this.val2;
	}

	public void setVal2(String val2) {
		this.val2 = val2;
	}

	public String getVal3() {
		return this.val3;
	}

	public void setVal3(String val3) {
		this.val3 = val3;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}