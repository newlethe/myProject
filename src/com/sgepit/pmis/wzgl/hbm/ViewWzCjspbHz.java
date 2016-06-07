package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * ViewWzCjspbHzId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ViewWzCjspbHz implements java.io.Serializable {

	// Fields
	private String uuid;
	private String sqjhbh;
	private String userid;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Long dj;
	private Date xqrq;
	private Long sqzsl;
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	/** default constructor */
	public ViewWzCjspbHz() {
	}
	/** minimal constructor */
	public ViewWzCjspbHz(String uuid) {
		this.uuid = uuid;
	}
	/** full constructor */
	public ViewWzCjspbHz(String sqjhbh, String userid, String bm, String pm,
			String gg, String dw, Long dj, Date xqrq, Long sqzsl) {
		this.sqjhbh = sqjhbh;
		this.userid = userid;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.dj = dj;
		this.xqrq = xqrq;
		this.sqzsl = sqzsl;
	}

	// Property accessors
	
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getSqjhbh() {
		return this.sqjhbh;
	}

	public void setSqjhbh(String sqjhbh) {
		this.sqjhbh = sqjhbh;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
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

	public Long getDj() {
		return this.dj;
	}

	public void setDj(Long dj) {
		this.dj = dj;
	}

	public Date getXqrq() {
		return this.xqrq;
	}

	public void setXqrq(Date xqrq) {
		this.xqrq = xqrq;
	}

	public Long getSqzsl() {
		return this.sqzsl;
	}

	public void setSqzsl(Long sqzsl) {
		this.sqzsl = sqzsl;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof ViewWzCjspbHz))
			return false;
		ViewWzCjspbHz castOther = (ViewWzCjspbHz) other;

		return ((this.getSqjhbh() == castOther.getSqjhbh()) || (this
				.getSqjhbh() != null
				&& castOther.getSqjhbh() != null && this.getSqjhbh().equals(
				castOther.getSqjhbh())))
				&& ((this.getUserid() == castOther.getUserid()) || (this
						.getUserid() != null
						&& castOther.getUserid() != null && this.getUserid()
						.equals(castOther.getUserid())))
				&& ((this.getBm() == castOther.getBm()) || (this.getBm() != null
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
				&& ((this.getXqrq() == castOther.getXqrq()) || (this.getXqrq() != null
						&& castOther.getXqrq() != null && this.getXqrq()
						.equals(castOther.getXqrq())))
				&& ((this.getSqzsl() == castOther.getSqzsl()) || (this
						.getSqzsl() != null
						&& castOther.getSqzsl() != null && this.getSqzsl()
						.equals(castOther.getSqzsl())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getSqjhbh() == null ? 0 : this.getSqjhbh().hashCode());
		result = 37 * result
				+ (getUserid() == null ? 0 : this.getUserid().hashCode());
		result = 37 * result + (getBm() == null ? 0 : this.getBm().hashCode());
		result = 37 * result + (getPm() == null ? 0 : this.getPm().hashCode());
		result = 37 * result + (getGg() == null ? 0 : this.getGg().hashCode());
		result = 37 * result + (getDw() == null ? 0 : this.getDw().hashCode());
		result = 37 * result + (getDj() == null ? 0 : this.getDj().hashCode());
		result = 37 * result
				+ (getXqrq() == null ? 0 : this.getXqrq().hashCode());
		result = 37 * result
				+ (getSqzsl() == null ? 0 : this.getSqzsl().hashCode());
		return result;
	}

}