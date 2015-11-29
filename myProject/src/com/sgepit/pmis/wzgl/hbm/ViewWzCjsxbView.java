package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * ViewWzCjsxbViewId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ViewWzCjsxbView implements java.io.Serializable {

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
	private String id;
	private Long ztsl;
	private Long klsl;

	// Constructors

	public ViewWzCjsxbView(){
		
	}
	/** full constructor */
	public ViewWzCjsxbView(String uids, String pid, String bh, String bm,
			String pm, String gg, String cz, String dw, Date xqrq, Double sqsl,
			Double sl, Double dj, Double ffsl, String bz, Double sqje,
			Double spje, Double ffje, Double rate, String hsdw, String jhbh,
			Double ftsl, String stage, String isvalid, Date pzrq, String id,
			Long ztsl, Long klsl) {
				this.uids = uids;
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
				this.id = id;
				this.ztsl = ztsl;
				this.klsl = klsl;
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

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Long getZtsl() {
		return this.ztsl;
	}

	public void setZtsl(Long ztsl) {
		this.ztsl = ztsl;
	}

	public Long getKlsl() {
		return this.klsl;
	}

	public void setKlsl(Long klsl) {
		this.klsl = klsl;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof ViewWzCjsxbView))
			return false;
		ViewWzCjsxbView castOther = (ViewWzCjsxbView) other;

		return ((this.getUids() == castOther.getUids()) || (this.getUids() != null
				&& castOther.getUids() != null && this.getUids().equals(
				castOther.getUids())))
				&& ((this.getPid() == castOther.getPid()) || (this.getPid() != null
						&& castOther.getPid() != null && this.getPid().equals(
						castOther.getPid())))
				&& ((this.getBh() == castOther.getBh()) || (this.getBh() != null
						&& castOther.getBh() != null && this.getBh().equals(
						castOther.getBh())))
				&& ((this.getBm() == castOther.getBm()) || (this.getBm() != null
						&& castOther.getBm() != null && this.getBm().equals(
						castOther.getBm())))
				&& ((this.getPm() == castOther.getPm()) || (this.getPm() != null
						&& castOther.getPm() != null && this.getPm().equals(
						castOther.getPm())))
				&& ((this.getGg() == castOther.getGg()) || (this.getGg() != null
						&& castOther.getGg() != null && this.getGg().equals(
						castOther.getGg())))
				&& ((this.getCz() == castOther.getCz()) || (this.getCz() != null
						&& castOther.getCz() != null && this.getCz().equals(
						castOther.getCz())))
				&& ((this.getDw() == castOther.getDw()) || (this.getDw() != null
						&& castOther.getDw() != null && this.getDw().equals(
						castOther.getDw())))
				&& ((this.getXqrq() == castOther.getXqrq()) || (this.getXqrq() != null
						&& castOther.getXqrq() != null && this.getXqrq()
						.equals(castOther.getXqrq())))
				&& ((this.getSqsl() == castOther.getSqsl()) || (this.getSqsl() != null
						&& castOther.getSqsl() != null && this.getSqsl()
						.equals(castOther.getSqsl())))
				&& ((this.getSl() == castOther.getSl()) || (this.getSl() != null
						&& castOther.getSl() != null && this.getSl().equals(
						castOther.getSl())))
				&& ((this.getDj() == castOther.getDj()) || (this.getDj() != null
						&& castOther.getDj() != null && this.getDj().equals(
						castOther.getDj())))
				&& ((this.getFfsl() == castOther.getFfsl()) || (this.getFfsl() != null
						&& castOther.getFfsl() != null && this.getFfsl()
						.equals(castOther.getFfsl())))
				&& ((this.getBz() == castOther.getBz()) || (this.getBz() != null
						&& castOther.getBz() != null && this.getBz().equals(
						castOther.getBz())))
				&& ((this.getSqje() == castOther.getSqje()) || (this.getSqje() != null
						&& castOther.getSqje() != null && this.getSqje()
						.equals(castOther.getSqje())))
				&& ((this.getSpje() == castOther.getSpje()) || (this.getSpje() != null
						&& castOther.getSpje() != null && this.getSpje()
						.equals(castOther.getSpje())))
				&& ((this.getFfje() == castOther.getFfje()) || (this.getFfje() != null
						&& castOther.getFfje() != null && this.getFfje()
						.equals(castOther.getFfje())))
				&& ((this.getRate() == castOther.getRate()) || (this.getRate() != null
						&& castOther.getRate() != null && this.getRate()
						.equals(castOther.getRate())))
				&& ((this.getHsdw() == castOther.getHsdw()) || (this.getHsdw() != null
						&& castOther.getHsdw() != null && this.getHsdw()
						.equals(castOther.getHsdw())))
				&& ((this.getJhbh() == castOther.getJhbh()) || (this.getJhbh() != null
						&& castOther.getJhbh() != null && this.getJhbh()
						.equals(castOther.getJhbh())))
				&& ((this.getFtsl() == castOther.getFtsl()) || (this.getFtsl() != null
						&& castOther.getFtsl() != null && this.getFtsl()
						.equals(castOther.getFtsl())))
				&& ((this.getStage() == castOther.getStage()) || (this
						.getStage() != null
						&& castOther.getStage() != null && this.getStage()
						.equals(castOther.getStage())))
				&& ((this.getIsvalid() == castOther.getIsvalid()) || (this
						.getIsvalid() != null
						&& castOther.getIsvalid() != null && this.getIsvalid()
						.equals(castOther.getIsvalid())))
				&& ((this.getPzrq() == castOther.getPzrq()) || (this.getPzrq() != null
						&& castOther.getPzrq() != null && this.getPzrq()
						.equals(castOther.getPzrq())))
				&& ((this.getId() == castOther.getId()) || (this.getId() != null
						&& castOther.getId() != null && this.getId().equals(
						castOther.getId())))
				&& ((this.getZtsl() == castOther.getZtsl()) || (this.getZtsl() != null
						&& castOther.getZtsl() != null && this.getZtsl()
						.equals(castOther.getZtsl())))
				&& ((this.getKlsl() == castOther.getKlsl()) || (this.getKlsl() != null
						&& castOther.getKlsl() != null && this.getKlsl()
						.equals(castOther.getKlsl())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getUids() == null ? 0 : this.getUids().hashCode());
		result = 37 * result
				+ (getPid() == null ? 0 : this.getPid().hashCode());
		result = 37 * result + (getBh() == null ? 0 : this.getBh().hashCode());
		result = 37 * result + (getBm() == null ? 0 : this.getBm().hashCode());
		result = 37 * result + (getPm() == null ? 0 : this.getPm().hashCode());
		result = 37 * result + (getGg() == null ? 0 : this.getGg().hashCode());
		result = 37 * result + (getCz() == null ? 0 : this.getCz().hashCode());
		result = 37 * result + (getDw() == null ? 0 : this.getDw().hashCode());
		result = 37 * result
				+ (getXqrq() == null ? 0 : this.getXqrq().hashCode());
		result = 37 * result
				+ (getSqsl() == null ? 0 : this.getSqsl().hashCode());
		result = 37 * result + (getSl() == null ? 0 : this.getSl().hashCode());
		result = 37 * result + (getDj() == null ? 0 : this.getDj().hashCode());
		result = 37 * result
				+ (getFfsl() == null ? 0 : this.getFfsl().hashCode());
		result = 37 * result + (getBz() == null ? 0 : this.getBz().hashCode());
		result = 37 * result
				+ (getSqje() == null ? 0 : this.getSqje().hashCode());
		result = 37 * result
				+ (getSpje() == null ? 0 : this.getSpje().hashCode());
		result = 37 * result
				+ (getFfje() == null ? 0 : this.getFfje().hashCode());
		result = 37 * result
				+ (getRate() == null ? 0 : this.getRate().hashCode());
		result = 37 * result
				+ (getHsdw() == null ? 0 : this.getHsdw().hashCode());
		result = 37 * result
				+ (getJhbh() == null ? 0 : this.getJhbh().hashCode());
		result = 37 * result
				+ (getFtsl() == null ? 0 : this.getFtsl().hashCode());
		result = 37 * result
				+ (getStage() == null ? 0 : this.getStage().hashCode());
		result = 37 * result
				+ (getIsvalid() == null ? 0 : this.getIsvalid().hashCode());
		result = 37 * result
				+ (getPzrq() == null ? 0 : this.getPzrq().hashCode());
		result = 37 * result + (getId() == null ? 0 : this.getId().hashCode());
		result = 37 * result
				+ (getZtsl() == null ? 0 : this.getZtsl().hashCode());
		result = 37 * result
				+ (getKlsl() == null ? 0 : this.getKlsl().hashCode());
		return result;
	}

}