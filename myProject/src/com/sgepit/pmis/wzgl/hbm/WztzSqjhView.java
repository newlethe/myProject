package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WztzSqjhView entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WztzSqjhView implements java.io.Serializable {

	// Fields
	private String uids;
	private String pid;
	private String bh;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Double dj;
	private Date sqrq;
	private String bmmc;
	private String sqr;
	private Double sqsl;
	private Double sqzje;
	private Double ftsl;
	private Double tdsl;
	private Double lysl;
	private String billState;
	
	// Constructors

	/** default constructor */
	public WztzSqjhView() {
	}

	/** minimal constructor */
	public WztzSqjhView(String uids) {
		this.uids = uids;
	}
	
	/** full constructor */
	public WztzSqjhView(String pid, String bh, String bm,
			String pm, String gg, String dw, Double dj, Date sqrq, String bmmc,
			String sqr, Double sqsl, Double sqzje, Double ftsl, Double tdsl,
			Double lysl, String billState) {
		this.pid = pid;
		this.bh = bh;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.dj = dj;
		this.sqrq = sqrq;
		this.bmmc = bmmc;
		this.sqr = sqr;
		this.sqsl = sqsl;
		this.sqzje = sqzje;
		this.ftsl = ftsl;
		this.tdsl = tdsl;
		this.lysl = lysl;
		this.billState = billState;
	}
	
	

	// Property accessors
	
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBh() {
		return bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getBm() {
		return bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getPm() {
		return pm;
	}

	public void setPm(String pm) {
		this.pm = pm;
	}

	public String getGg() {
		return gg;
	}

	public void setGg(String gg) {
		this.gg = gg;
	}

	public String getDw() {
		return dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getDj() {
		return dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
	}

	public Date getSqrq() {
		return sqrq;
	}

	public void setSqrq(Date sqrq) {
		this.sqrq = sqrq;
	}

	public String getBmmc() {
		return bmmc;
	}

	public void setBmmc(String bmmc) {
		this.bmmc = bmmc;
	}

	public String getSqr() {
		return sqr;
	}

	public void setSqr(String sqr) {
		this.sqr = sqr;
	}

	public Double getSqsl() {
		return sqsl;
	}

	public void setSqsl(Double sqsl) {
		this.sqsl = sqsl;
	}

	public Double getSqzje() {
		return sqzje;
	}

	public void setSqzje(Double sqzje) {
		this.sqzje = sqzje;
	}

	public Double getFtsl() {
		return ftsl;
	}

	public void setFtsl(Double ftsl) {
		this.ftsl = ftsl;
	}

	public Double getTdsl() {
		return tdsl;
	}

	public void setTdsl(Double tdsl) {
		this.tdsl = tdsl;
	}

	public Double getLysl() {
		return lysl;
	}

	public void setLysl(Double lysl) {
		this.lysl = lysl;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}
	
}