package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzCjsxb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

/**
 * @author admin
 *
 */
public class ViewWzCjsxbPb implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String bh;
	private String bm;
	private String pm;
	private String gg;
	private String cz;
	private String dw;
	private Date xqrq;
	private Double sqsl;
	private Double sl;
	private Double dj;
	private Double ffsl;
	private String bz;
	private Double sqje;
	private Double spje;
	private Double ffje;
	private Double rate;
	private String hsdw;
	private String jhbh;
	private Double ftsl;
	private String stage;
	private String isvalid;
	private Date pzrq;
	private String bmmc;
	private String sqr;
	private String bgdid;
	private String billState;

	// Constructors

	/** default constructor */
	public ViewWzCjsxbPb() {
	}

	/** minimal constructor */
	public ViewWzCjsxbPb(String bh, String bm) {
		this.bh = bh;
		this.bm = bm;
	}

	/** full constructor */
	public ViewWzCjsxbPb(String pid, String bh, String bm, String pm, String gg,
			String cz, String dw, Date xqrq, Double sqsl, Double sl, Double dj,
			Double ffsl, String bz, Double sqje, Double spje, Double ffje,
			Double rate, String hsdw, String jhbh, Double ftsl, String stage,
			String isvalid, Date pzrq) {
		this.pid = pid;
		this.bh = bh;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.cz = cz;
		this.dw = dw;
		this.xqrq = xqrq;
		this.sqsl = sqsl;
		this.sl = sl;
		this.dj = dj;
		this.ffsl = ffsl;
		this.bz = bz;
		this.sqje = sqje;
		this.spje = spje;
		this.ffje = ffje;
		this.rate = rate;
		this.hsdw = hsdw;
		this.jhbh = jhbh;
		this.ftsl = ftsl;
		this.stage = stage;
		this.isvalid = isvalid;
		this.pzrq = pzrq;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
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

	public String getCz() {
		return this.cz;
	}

	public void setCz(String cz) {
		this.cz = cz;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Date getXqrq() {
		return this.xqrq;
	}

	public void setXqrq(Date xqrq) {
		this.xqrq = xqrq;
	}

	public Double getSqsl() {
		return this.sqsl;
	}

	public void setSqsl(Double sqsl) {
		this.sqsl = sqsl;
	}

	public Double getSl() {
		return this.sl;
	}

	public void setSl(Double sl) {
		this.sl = sl;
	}

	public Double getDj() {
		return this.dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
	}

	public Double getFfsl() {
		return this.ffsl;
	}

	public void setFfsl(Double ffsl) {
		this.ffsl = ffsl;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public Double getSqje() {
		return this.sqje;
	}

	public void setSqje(Double sqje) {
		this.sqje = sqje;
	}

	public Double getSpje() {
		return this.spje;
	}

	public void setSpje(Double spje) {
		this.spje = spje;
	}

	public Double getFfje() {
		return this.ffje;
	}

	public void setFfje(Double ffje) {
		this.ffje = ffje;
	}

	public Double getRate() {
		return this.rate;
	}

	public void setRate(Double rate) {
		this.rate = rate;
	}

	public String getHsdw() {
		return this.hsdw;
	}

	public void setHsdw(String hsdw) {
		this.hsdw = hsdw;
	}

	public String getJhbh() {
		return this.jhbh;
	}

	public void setJhbh(String jhbh) {
		this.jhbh = jhbh;
	}

	public Double getFtsl() {
		return this.ftsl;
	}

	public void setFtsl(Double ftsl) {
		this.ftsl = ftsl;
	}

	public String getStage() {
		return this.stage;
	}

	public void setStage(String stage) {
		this.stage = stage;
	}

	public String getIsvalid() {
		return this.isvalid;
	}

	public void setIsvalid(String isvalid) {
		this.isvalid = isvalid;
	}

	public Date getPzrq() {
		return this.pzrq;
	}

	public void setPzrq(Date pzrq) {
		this.pzrq = pzrq;
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

	public String getBgdid() {
		return bgdid;
	}

	public void setBgdid(String bgdid) {
		this.bgdid = bgdid;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

}