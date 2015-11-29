package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * ViewWzCollectApplyId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ViewWzCollectApply implements java.io.Serializable {

	// Fields

	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Long dj;
	private Long kcsl;
	private Long sl;
	private Long kysl;
	private Long ygsl;
	private String bmmc;
	private String sqr;
	private Date xqrq;
	private String bh;
	private String xmbm;
	private String flbm;

	// Constructors

	/** default constructor */
	public ViewWzCollectApply() {
	}

	/** minimal constructor */
	public ViewWzCollectApply(String bm) {
		this.bm = bm;
	}

	/** full constructor */
	public ViewWzCollectApply(String bm, String pm, String gg, String dw,
			Long dj, Long kcsl, Long sl, Long kysl, Long ygsl, String bmmc,
			String sqr, Date xqrq, String bh, String xmbm, String flbm) {
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.dj = dj;
		this.kcsl = kcsl;
		this.sl = sl;
		this.kysl = kysl;
		this.ygsl = ygsl;
		this.bmmc = bmmc;
		this.sqr = sqr;
		this.xqrq = xqrq;
		this.bh = bh;
		this.xmbm = xmbm;
		this.flbm = flbm;
	}

	// Property accessors

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

	public Long getDj() {
		return this.dj;
	}

	public void setDj(Long dj) {
		this.dj = dj;
	}

	public Long getKcsl() {
		return this.kcsl;
	}

	public void setKcsl(Long kcsl) {
		this.kcsl = kcsl;
	}

	public Long getSl() {
		return this.sl;
	}

	public void setSl(Long sl) {
		this.sl = sl;
	}

	public Long getKysl() {
		return this.kysl;
	}

	public void setKysl(Long kysl) {
		this.kysl = kysl;
	}

	public Long getYgsl() {
		return this.ygsl;
	}

	public void setYgsl(Long ygsl) {
		this.ygsl = ygsl;
	}

	public String getBmmc() {
		return this.bmmc;
	}

	public void setBmmc(String bmmc) {
		this.bmmc = bmmc;
	}

	public String getSqr() {
		return this.sqr;
	}

	public void setSqr(String sqr) {
		this.sqr = sqr;
	}

	public Date getXqrq() {
		return this.xqrq;
	}

	public void setXqrq(Date xqrq) {
		this.xqrq = xqrq;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getXmbm() {
		return this.xmbm;
	}

	public void setXmbm(String xmbm) {
		this.xmbm = xmbm;
	}

	public String getFlbm() {
		return this.flbm;
	}

	public void setFlbm(String flbm) {
		this.flbm = flbm;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof ViewWzCollectApply))
			return false;
		ViewWzCollectApply castOther = (ViewWzCollectApply) other;

		return ((this.getBm() == castOther.getBm()) || (this.getBm() != null
				&& castOther.getBm() != null && this.getBm().equals(
				castOther.getBm())))
				&& ((this.getPm() == castOther.getPm()) || (this.getPm() != null
						&& castOther.getPm() != null && this.getPm().equals(
						castOther.getPm())))
				&& ((this.getGg() == castOther.getGg()) || (this.getGg() != null
						&& castOther.getGg() != null && this.getGg().equals(
						castOther.getGg())))
				&& ((this.getDw() == castOther.getDw()) || (this.getDw() != null
						&& castOther.getDw() != null && this.getDw().equals(
						castOther.getDw())))
				&& ((this.getDj() == castOther.getDj()) || (this.getDj() != null
						&& castOther.getDj() != null && this.getDj().equals(
						castOther.getDj())))
				&& ((this.getKcsl() == castOther.getKcsl()) || (this.getKcsl() != null
						&& castOther.getKcsl() != null && this.getKcsl()
						.equals(castOther.getKcsl())))
				&& ((this.getSl() == castOther.getSl()) || (this.getSl() != null
						&& castOther.getSl() != null && this.getSl().equals(
						castOther.getSl())))
				&& ((this.getKysl() == castOther.getKysl()) || (this.getKysl() != null
						&& castOther.getKysl() != null && this.getKysl()
						.equals(castOther.getKysl())))
				&& ((this.getYgsl() == castOther.getYgsl()) || (this.getYgsl() != null
						&& castOther.getYgsl() != null && this.getYgsl()
						.equals(castOther.getYgsl())))
				&& ((this.getBmmc() == castOther.getBmmc()) || (this.getBmmc() != null
						&& castOther.getBmmc() != null && this.getBmmc()
						.equals(castOther.getBmmc())))
				&& ((this.getSqr() == castOther.getSqr()) || (this.getSqr() != null
						&& castOther.getSqr() != null && this.getSqr().equals(
						castOther.getSqr())))
				&& ((this.getXqrq() == castOther.getXqrq()) || (this.getXqrq() != null
						&& castOther.getXqrq() != null && this.getXqrq()
						.equals(castOther.getXqrq())))
				&& ((this.getBh() == castOther.getBh()) || (this.getBh() != null
						&& castOther.getBh() != null && this.getBh().equals(
						castOther.getBh())))
				&& ((this.getXmbm() == castOther.getXmbm()) || (this.getXmbm() != null
						&& castOther.getXmbm() != null && this.getXmbm()
						.equals(castOther.getXmbm())))
				&& ((this.getFlbm() == castOther.getFlbm()) || (this.getFlbm() != null
						&& castOther.getFlbm() != null && this.getFlbm()
						.equals(castOther.getFlbm())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + (getBm() == null ? 0 : this.getBm().hashCode());
		result = 37 * result + (getPm() == null ? 0 : this.getPm().hashCode());
		result = 37 * result + (getGg() == null ? 0 : this.getGg().hashCode());
		result = 37 * result + (getDw() == null ? 0 : this.getDw().hashCode());
		result = 37 * result + (getDj() == null ? 0 : this.getDj().hashCode());
		result = 37 * result
				+ (getKcsl() == null ? 0 : this.getKcsl().hashCode());
		result = 37 * result + (getSl() == null ? 0 : this.getSl().hashCode());
		result = 37 * result
				+ (getKysl() == null ? 0 : this.getKysl().hashCode());
		result = 37 * result
				+ (getYgsl() == null ? 0 : this.getYgsl().hashCode());
		result = 37 * result
				+ (getBmmc() == null ? 0 : this.getBmmc().hashCode());
		result = 37 * result
				+ (getSqr() == null ? 0 : this.getSqr().hashCode());
		result = 37 * result
				+ (getXqrq() == null ? 0 : this.getXqrq().hashCode());
		result = 37 * result + (getBh() == null ? 0 : this.getBh().hashCode());
		result = 37 * result
				+ (getXmbm() == null ? 0 : this.getXmbm().hashCode());
		result = 37 * result
				+ (getFlbm() == null ? 0 : this.getFlbm().hashCode());
		return result;
	}

}