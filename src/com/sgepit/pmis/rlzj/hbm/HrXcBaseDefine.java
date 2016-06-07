package com.sgepit.pmis.rlzj.hbm;

/**
 * HrXcBaseDefine entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrXcBaseDefine implements java.io.Serializable {

	// Fields

	private String lsh;
	private String sjType;
	private String unitId;
	private String zbSeqno;
	private String val1;
	private String val2;
	private String val3;
	private String memo;

	// Constructors

	/** default constructor */
	public HrXcBaseDefine() {
	}

	/** minimal constructor */
	public HrXcBaseDefine(String lsh, String sjType, String unitId,
			String zbSeqno) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
	}

	/** full constructor */
	public HrXcBaseDefine(String lsh, String sjType, String unitId,
			String zbSeqno, String val1, String val2, String val3, String memo) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
		this.val1 = val1;
		this.val2 = val2;
		this.val3 = val3;
		this.memo = memo;
	}

	// Property accessors

	public String getLsh() {
		return this.lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
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