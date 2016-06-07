package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * PcBidSupervisereportD entity. @author MyEclipse Persistence Tools
 */

public class PcBidSupervisereportD implements java.io.Serializable {

	// Fields

	private String uids;
	private String zbSeqno;
	private String unitId;
	private String sjType;
	private Double bdgValue;
	private String memo;
	private String backupC1;
	private String backupC2;
	private String backupC3;
	private String backupC4;
	private String backupC5;
	private Double backupN1;
	private Double backupN2;
	private Double backupN3;
	private Double backupN4;
	private Double backupN5;
	private Date backupD1;
	private Date backupD2;
	private Date backupD3;
	private String unitname;
	private String zbnr;
	private String zbbh;
	private String kbrq;
	private String zbfs;
	private String dljg;
	private String zbdw;
	private Double kbjg;
	private Double zbjg;
	private String pbbf;
	private Double convalue;

	// Constructors

	/** default constructor */
	public PcBidSupervisereportD() {
	}

	/** minimal constructor */
	public PcBidSupervisereportD(String zbSeqno, String unitId, String sjType) {
		this.zbSeqno = zbSeqno;
		this.unitId = unitId;
		this.sjType = sjType;
	}

	/** full constructor */
	public PcBidSupervisereportD(String zbSeqno, String unitId, String sjType,
			Double bdgValue, String memo, String backupC1, String backupC2,
			String backupC3, String backupC4, String backupC5, Double backupN1,
			Double backupN2, Double backupN3, Double backupN4, Double backupN5,
			Date backupD1, Date backupD2, Date backupD3, String unitname,
			String zbnr, String zbbh, String kbrq, String zbfs, String dljg,
			String zbdw, Double kbjg, Double zbjg, String pbbf, Double convalue) {
		this.zbSeqno = zbSeqno;
		this.unitId = unitId;
		this.sjType = sjType;
		this.bdgValue = bdgValue;
		this.memo = memo;
		this.backupC1 = backupC1;
		this.backupC2 = backupC2;
		this.backupC3 = backupC3;
		this.backupC4 = backupC4;
		this.backupC5 = backupC5;
		this.backupN1 = backupN1;
		this.backupN2 = backupN2;
		this.backupN3 = backupN3;
		this.backupN4 = backupN4;
		this.backupN5 = backupN5;
		this.backupD1 = backupD1;
		this.backupD2 = backupD2;
		this.backupD3 = backupD3;
		this.unitname = unitname;
		this.zbnr = zbnr;
		this.zbbh = zbbh;
		this.kbrq = kbrq;
		this.zbfs = zbfs;
		this.dljg = dljg;
		this.zbdw = zbdw;
		this.kbjg = kbjg;
		this.zbjg = zbjg;
		this.pbbf = pbbf;
		this.convalue = convalue;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
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

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public Double getBdgValue() {
		return this.bdgValue;
	}

	public void setBdgValue(Double bdgValue) {
		this.bdgValue = bdgValue;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getBackupC1() {
		return this.backupC1;
	}

	public void setBackupC1(String backupC1) {
		this.backupC1 = backupC1;
	}

	public String getBackupC2() {
		return this.backupC2;
	}

	public void setBackupC2(String backupC2) {
		this.backupC2 = backupC2;
	}

	public String getBackupC3() {
		return this.backupC3;
	}

	public void setBackupC3(String backupC3) {
		this.backupC3 = backupC3;
	}

	public String getBackupC4() {
		return this.backupC4;
	}

	public void setBackupC4(String backupC4) {
		this.backupC4 = backupC4;
	}

	public String getBackupC5() {
		return this.backupC5;
	}

	public void setBackupC5(String backupC5) {
		this.backupC5 = backupC5;
	}

	public Double getBackupN1() {
		return this.backupN1;
	}

	public void setBackupN1(Double backupN1) {
		this.backupN1 = backupN1;
	}

	public Double getBackupN2() {
		return this.backupN2;
	}

	public void setBackupN2(Double backupN2) {
		this.backupN2 = backupN2;
	}

	public Double getBackupN3() {
		return this.backupN3;
	}

	public void setBackupN3(Double backupN3) {
		this.backupN3 = backupN3;
	}

	public Double getBackupN4() {
		return this.backupN4;
	}

	public void setBackupN4(Double backupN4) {
		this.backupN4 = backupN4;
	}

	public Double getBackupN5() {
		return this.backupN5;
	}

	public void setBackupN5(Double backupN5) {
		this.backupN5 = backupN5;
	}

	public Date getBackupD1() {
		return this.backupD1;
	}

	public void setBackupD1(Date backupD1) {
		this.backupD1 = backupD1;
	}

	public Date getBackupD2() {
		return this.backupD2;
	}

	public void setBackupD2(Date backupD2) {
		this.backupD2 = backupD2;
	}

	public Date getBackupD3() {
		return this.backupD3;
	}

	public void setBackupD3(Date backupD3) {
		this.backupD3 = backupD3;
	}

	public String getUnitname() {
		return this.unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getZbnr() {
		return this.zbnr;
	}

	public void setZbnr(String zbnr) {
		this.zbnr = zbnr;
	}

	public String getZbbh() {
		return this.zbbh;
	}

	public void setZbbh(String zbbh) {
		this.zbbh = zbbh;
	}

	public String getKbrq() {
		return this.kbrq;
	}

	public void setKbrq(String kbrq) {
		this.kbrq = kbrq;
	}

	public String getZbfs() {
		return this.zbfs;
	}

	public void setZbfs(String zbfs) {
		this.zbfs = zbfs;
	}

	public String getDljg() {
		return this.dljg;
	}

	public void setDljg(String dljg) {
		this.dljg = dljg;
	}

	public String getZbdw() {
		return this.zbdw;
	}

	public void setZbdw(String zbdw) {
		this.zbdw = zbdw;
	}

	public Double getKbjg() {
		return this.kbjg;
	}

	public void setKbjg(Double kbjg) {
		this.kbjg = kbjg;
	}

	public Double getZbjg() {
		return this.zbjg;
	}

	public void setZbjg(Double zbjg) {
		this.zbjg = zbjg;
	}

	public String getPbbf() {
		return this.pbbf;
	}

	public void setPbbf(String pbbf) {
		this.pbbf = pbbf;
	}

	public Double getConvalue() {
		return this.convalue;
	}

	public void setConvalue(Double convalue) {
		this.convalue = convalue;
	}

}