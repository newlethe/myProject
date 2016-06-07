package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrManWorkexep entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManInfoD implements java.io.Serializable {

	// Fields
	private String lsh;
	private String sjType;
	private String unitId;
	private String zbSeqno;
	private String memo;
	private String memoc1;
	private String memoc2;
	private String memoc3;
	private String memoc4;
	private String memoc5;
	private java.math.BigDecimal memon1;
	private java.math.BigDecimal memon2;
	private java.math.BigDecimal memon3;
	private Date memod1;
	private Date memod2;
	private Date memod3;

	// Constructors

	/** default constructor */
	public HrManInfoD() {
	}

	/** minimal constructor */
	public HrManInfoD(String lsh) {
		this.lsh = lsh;
	}

	public HrManInfoD(String lsh, String sjType, String unitId, String zbSeqno) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
	}
	/** full constructor */
	public HrManInfoD(String lsh, String sjType, String unitId, String zbSeqno,
			String memoc1, String memoc2, String memoc3, String memoc4,String memoc5,
			java.math.BigDecimal memon1, java.math.BigDecimal memon2,java.math.BigDecimal memon3,
			Date memod1, Date memod2,Date memod3,String memo) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
		this.memo = memo;
		this.memoc1 = memoc1;
		this.memoc2 = memoc2;
		this.memoc3 = memoc3;
		this.memoc4 = memoc4;
		this.memoc5 = memoc5;
		this.memon1 = memon1;
		this.memon2 = memon2;
		this.memon3 = memon3;
		this.memod1 = memod1;
		this.memod2 = memod2;
		this.memod3 = memod3;
	}

	// Property accessors

	public String getLsh() {
		return lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
	}

	public String getSjType() {
		return sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getUnitId() {
		return unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getZbSeqno() {
		return zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getMemoc1() {
		return this.memoc1;
	}

	public void setMemoc1(String memoc1) {
		this.memoc1 = memoc1;
	}

	public String getMemoc2() {
		return this.memoc2;
	}

	public void setMemoc2(String memoc2) {
		this.memoc2 = memoc2;
	}

	public String getMemoc3() {
		return this.memoc3;
	}

	public void setMemoc3(String memoc3) {
		this.memoc3 = memoc3;
	}

	public String getMemoc4() {
		return this.memoc4;
	}

	public void setMemoc4(String memoc4) {
		this.memoc4 = memoc4;
	}

	public String getMemoc5() {
		return this.memoc5;
	}

	public void setMemoc5(String memoc5) {
		this.memoc5 = memoc5;
	}

	public java.math.BigDecimal getMemon1() {
		return this.memon1;
	}

	public void setMemon1(java.math.BigDecimal memon1) {
		this.memon1 = memon1;
	}

	public java.math.BigDecimal getMemon2() {
		return this.memon2;
	}

	public void setMemon2(java.math.BigDecimal memon2) {
		this.memon2 = memon2;
	}

	public java.math.BigDecimal getMemon3() {
		return this.memon3;
	}

	public void setMemon3(java.math.BigDecimal memon3) {
		this.memon3 = memon3;
	}

	public Date getMemod1() {
		return this.memod1;
	}

	public void setMemod1(Date memod1) {
		this.memod1 = memod1;
	}

	public Date getMemod2() {
		return this.memod2;
	}

	public void setMemod2(Date memod2) {
		this.memod2 = memod2;
	}

	public Date getMemod3() {
		return this.memod3;
	}

	public void setMemod3(Date memod3) {
		this.memod3 = memod3;
	}

}