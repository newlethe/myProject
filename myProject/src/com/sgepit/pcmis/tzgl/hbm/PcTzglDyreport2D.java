package com.sgepit.pcmis.tzgl.hbm;

import java.util.Date;

/**
 * PcTzglDyreport2D entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcTzglDyreport2D implements java.io.Serializable {

	// Fields

	private String uids;
	private String sjType;
	private String unitId;
	private String zbSeqno;
	private String val11;
	private String val12;
	private Date val2;
	private Double val31;
	private Double val32;
	private Double val41;
	private Double val42;
	private Double val51;
	private Double val52;
	private Double val61;
	private Double val62;
	private Date val63;
	private Double val71;
	private Double val72;
	private Double val81;
	private Double val82;
	private Date val83;
	private String memoVarchar1;
	private String memoVarcher2;
	private Double memoNumber1;
	private Double memoNumber2;
	
	private Double val71hide;
	private Double val72hide;

	// Constructors

	/** default constructor */
	public PcTzglDyreport2D() {
	}

	/** full constructor */
	public PcTzglDyreport2D(String sjType, String unitId, String zbSeqno,
			String val11, String val12, Date val2, Double val31, Double val32,
			Double val41, Double val42, Double val51, Double val52,
			Double val61, Double val62, Date val63, Double val71, Double val72,
			Double val81, Double val82, Date val83, String memoVarchar1,
			String memoVarcher2, Double memoNumber1, Double memoNumber2) {
		this.sjType = sjType;
		this.unitId = unitId;
		this.zbSeqno = zbSeqno;
		this.val11 = val11;
		this.val12 = val12;
		this.val2 = val2;
		this.val31 = val31;
		this.val32 = val32;
		this.val41 = val41;
		this.val42 = val42;
		this.val51 = val51;
		this.val52 = val52;
		this.val61 = val61;
		this.val62 = val62;
		this.val63 = val63;
		this.val71 = val71;
		this.val72 = val72;
		this.val81 = val81;
		this.val82 = val82;
		this.val83 = val83;
		this.memoVarchar1 = memoVarchar1;
		this.memoVarcher2 = memoVarcher2;
		this.memoNumber1 = memoNumber1;
		this.memoNumber2 = memoNumber2;
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

	public String getVal11() {
		return this.val11;
	}

	public void setVal11(String val11) {
		this.val11 = val11;
	}

	public String getVal12() {
		return this.val12;
	}

	public void setVal12(String val12) {
		this.val12 = val12;
	}

	public Date getVal2() {
		return this.val2;
	}

	public void setVal2(Date val2) {
		this.val2 = val2;
	}

	public Double getVal31() {
		return this.val31;
	}

	public void setVal31(Double val31) {
		this.val31 = val31;
	}

	public Double getVal32() {
		return this.val32;
	}

	public void setVal32(Double val32) {
		this.val32 = val32;
	}

	public Double getVal41() {
		return this.val41;
	}

	public void setVal41(Double val41) {
		this.val41 = val41;
	}

	public Double getVal42() {
		return this.val42;
	}

	public void setVal42(Double val42) {
		this.val42 = val42;
	}

	public Double getVal51() {
		return this.val51;
	}

	public void setVal51(Double val51) {
		this.val51 = val51;
	}

	public Double getVal52() {
		return this.val52;
	}

	public void setVal52(Double val52) {
		this.val52 = val52;
	}

	public Double getVal61() {
		return this.val61;
	}

	public void setVal61(Double val61) {
		this.val61 = val61;
	}

	public Double getVal62() {
		return this.val62;
	}

	public void setVal62(Double val62) {
		this.val62 = val62;
	}

	public Date getVal63() {
		return this.val63;
	}

	public void setVal63(Date val63) {
		this.val63 = val63;
	}

	public Double getVal71() {
		return this.val71;
	}

	public void setVal71(Double val71) {
		this.val71 = val71;
	}

	public Double getVal72() {
		return this.val72;
	}

	public void setVal72(Double val72) {
		this.val72 = val72;
	}

	public Double getVal81() {
		return this.val81;
	}

	public void setVal81(Double val81) {
		this.val81 = val81;
	}

	public Double getVal82() {
		return this.val82;
	}

	public void setVal82(Double val82) {
		this.val82 = val82;
	}

	public Date getVal83() {
		return this.val83;
	}

	public void setVal83(Date val83) {
		this.val83 = val83;
	}

	public String getMemoVarchar1() {
		return this.memoVarchar1;
	}

	public void setMemoVarchar1(String memoVarchar1) {
		this.memoVarchar1 = memoVarchar1;
	}

	public String getMemoVarcher2() {
		return this.memoVarcher2;
	}

	public void setMemoVarcher2(String memoVarcher2) {
		this.memoVarcher2 = memoVarcher2;
	}

	public Double getMemoNumber1() {
		return this.memoNumber1;
	}

	public void setMemoNumber1(Double memoNumber1) {
		this.memoNumber1 = memoNumber1;
	}

	public Double getMemoNumber2() {
		return this.memoNumber2;
	}

	public void setMemoNumber2(Double memoNumber2) {
		this.memoNumber2 = memoNumber2;
	}

	public Double getVal71hide() {
		return val71hide;
	}

	public void setVal71hide(Double val71hide) {
		this.val71hide = val71hide;
	}

	public Double getVal72hide() {
		return val72hide;
	}

	public void setVal72hide(Double val72hide) {
		this.val72hide = val72hide;
	}

}