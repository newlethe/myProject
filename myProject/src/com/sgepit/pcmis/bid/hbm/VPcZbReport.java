package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

/**
 * VPcZbReport entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcZbReport implements java.io.Serializable {

	private String unitname;
	private String unitId;
	private String contentUids;
	private String uids;
	private String sjType;
	private String xmmc;
	private String zbnr;
	private String zbbh;
	private String kbrq;
	private String zbfs;
	private String pbbf;
	private String dljg;
	private String zbdw;
	private Long kbjg;
	private Double zbjg;
	private String state;
	private Date startDate;
	private Double rateStatus;

	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Double getRateStatus() {
		return rateStatus;
	}
	public void setRateStatus(Double rateStatus) {
		this.rateStatus = rateStatus;
	}
	
	
	public VPcZbReport() {
	}
	public VPcZbReport(String unitname, String unitId, String contentUids,
			String uids, String sjType, String xmmc, String zbnr,
			String zbbh, String kbrq, String zbfs, String pbbf, String dljg,
			String zbdw, Long kbjg, Double zbjg,String state) {
		super();
		this.unitname = unitname;
		this.unitId = unitId;
		this.contentUids = contentUids;
		this.uids = uids;
		this.sjType = sjType;
		this.xmmc = xmmc;
		this.zbnr = zbnr;
		this.zbbh = zbbh;
		this.kbrq = kbrq;
		this.zbfs = zbfs;
		this.pbbf = pbbf;
		this.dljg = dljg;
		this.zbdw = zbdw;
		this.kbjg = kbjg;
		this.zbjg = zbjg;
		this.state=state;
	}
	public String getUnitname() {
		return unitname;
	}
	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}
	public String getUnitId() {
		return unitId;
	}
	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}
	
	public String getContentUids() {
		return contentUids;
	}
	public void setContentUids(String contentUids) {
		this.contentUids = contentUids;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getSjType() {
		return sjType;
	}
	public void setSjType(String sjType) {
		this.sjType = sjType;
	}
	public String getXmmc() {
		return xmmc;
	}
	public void setXmmc(String xmmc) {
		this.xmmc = xmmc;
	}
	public String getZbnr() {
		return zbnr;
	}
	public void setZbnr(String zbnr) {
		this.zbnr = zbnr;
	}
	public String getZbbh() {
		return zbbh;
	}
	public void setZbbh(String zbbh) {
		this.zbbh = zbbh;
	}
	public String getKbrq() {
		return kbrq;
	}
	public void setKbrq(String kbrq) {
		this.kbrq = kbrq;
	}
	public String getZbfs() {
		return zbfs;
	}
	public void setZbfs(String zbfs) {
		this.zbfs = zbfs;
	}
	public String getPbbf() {
		return pbbf;
	}
	public void setPbbf(String pbbf) {
		this.pbbf = pbbf;
	}
	public String getDljg() {
		return dljg;
	}
	public void setDljg(String dljg) {
		this.dljg = dljg;
	}
	public String getZbdw() {
		return zbdw;
	}
	public void setZbdw(String zbdw) {
		this.zbdw = zbdw;
	}
	public Long getKbjg() {
		return kbjg;
	}
	public void setKbjg(Long kbjg) {
		this.kbjg = kbjg;
	}
	public Double getZbjg() {
		return zbjg;
	}
	public void setZbjg(Double zbjg) {
		this.zbjg = zbjg;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	

}