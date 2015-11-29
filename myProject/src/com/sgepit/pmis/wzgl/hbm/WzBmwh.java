package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzBmwh entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzBmwh implements java.io.Serializable {

	// Fields

	private String bh;
	private String wzbm;
	private String ckh;
	private String pm;
	private String gg;
	private String dw;
	private Double dj;
	private String bz;
	private String bmbz;
	private String sqr;
	private Date rq;
	private String qr;
	private String stage;
	private String flbm;
	private String qrr;
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public WzBmwh() {
	}

	/** full constructor */
	public WzBmwh(String wzbm, String ckh, String pm, String gg, String dw,
			Double dj, String bz, String bmbz, String sqr, Date rq, String qr,
			String stage, String flbm, String qrr) {
		this.wzbm = wzbm;
		this.ckh = ckh;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.dj = dj;
		this.bz = bz;
		this.bmbz = bmbz;
		this.sqr = sqr;
		this.rq = rq;
		this.qr = qr;
		this.stage = stage;
		this.flbm = flbm;
		this.qrr = qrr;
	}

	// Property accessors

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getWzbm() {
		return this.wzbm;
	}

	public void setWzbm(String wzbm) {
		this.wzbm = wzbm;
	}

	public String getCkh() {
		return this.ckh;
	}

	public void setCkh(String ckh) {
		this.ckh = ckh;
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

	public Double getDj() {
		return this.dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getBmbz() {
		return this.bmbz;
	}

	public void setBmbz(String bmbz) {
		this.bmbz = bmbz;
	}

	public String getSqr() {
		return this.sqr;
	}

	public void setSqr(String sqr) {
		this.sqr = sqr;
	}

	public Date getRq() {
		return this.rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public String getQr() {
		return this.qr;
	}

	public void setQr(String qr) {
		this.qr = qr;
	}

	public String getStage() {
		return this.stage;
	}

	public void setStage(String stage) {
		this.stage = stage;
	}

	public String getFlbm() {
		return this.flbm;
	}

	public void setFlbm(String flbm) {
		this.flbm = flbm;
	}

	public String getQrr() {
		return this.qrr;
	}

	public void setQrr(String qrr) {
		this.qrr = qrr;
	}

}