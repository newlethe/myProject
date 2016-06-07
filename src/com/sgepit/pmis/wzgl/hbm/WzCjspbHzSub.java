package com.sgepit.pmis.wzgl.hbm;

/**
 * WzCjspbHzList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCjspbHzSub implements java.io.Serializable {

	// Fields

	private String uids;
	private String hzuids;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Double dj;
	private Double sqzsl;
	private String sqjhbh;
	private String bz;
	private String sqjhhzbh;
	private String cghzState;
	private String jhbh;
	private String pid;
	
	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public WzCjspbHzSub() {
	}

	/** full constructor */
	public WzCjspbHzSub(String hzuids, String bm, String pm, String gg,
			String dw, Double dj, Double sqzsl, String sqjhbh, String bz,
			String sqjhhzbh, String cghzState, String jhbh) {
		this.hzuids = hzuids;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.dj = dj;
		this.sqzsl = sqzsl;
		this.sqjhbh = sqjhbh;
		this.bz = bz;
		this.sqjhhzbh = sqjhhzbh;
		this.cghzState = cghzState;
		this.jhbh = jhbh;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getHzuids() {
		return this.hzuids;
	}

	public void setHzuids(String hzuids) {
		this.hzuids = hzuids;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getPm() {
		return this.pm;
	}

	public void setPm(String pm) {
		this.pm = pm;
	}

	public String getGg() {
		return this.gg;
	}

	public void setGg(String gg) {
		this.gg = gg;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getSqzsl() {
		return this.sqzsl;
	}

	public void setSqzsl(Double sqzsl) {
		this.sqzsl = sqzsl;
	}

	public String getSqjhbh() {
		return this.sqjhbh;
	}

	public void setSqjhbh(String sqjhbh) {
		this.sqjhbh = sqjhbh;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public Double getDj() {
		return dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
	}

	public String getSqjhhzbh() {
		return sqjhhzbh;
	}

	public void setSqjhhzbh(String sqjhhzbh) {
		this.sqjhhzbh = sqjhhzbh;
	}
	
	public String getCghzState() {
		return this.cghzState;
	}
	
	public void setCghzState(String cghzState) {
		this.cghzState = cghzState;
	}

	public String getJhbh() {
		return jhbh;
	}

	public void setJhbh(String jhbh) {
		this.jhbh = jhbh;
	}
}