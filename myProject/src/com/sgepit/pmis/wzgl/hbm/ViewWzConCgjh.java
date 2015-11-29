package com.sgepit.pmis.wzgl.hbm;

/**
 * ViewWzArriveCgjh entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ViewWzConCgjh implements java.io.Serializable {

	// Fields

	/**
	 * 
	 */
	private String uids;
	private String comid;
	private String hth;
	private String bh;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Double curDhsl;
	private String csdm;
	private Double jhdj;
	private Double jhzj;
	private Double sjdj;
	private Double sjzj;
	private Double ygsl;
	private Double dhsl;
	private String xz;
	private String billState;
	private String cgr;
	private String jhr;
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public ViewWzConCgjh() {
	}

	/** full constructor */
	public ViewWzConCgjh(String uids, String bh, String bm, String pm,
			String gg, String dw, Double curDhsl, String csdm, Double jhdj,
			Double jhzj, Double sjdj, Double sjzj, 
			Double ygsl, Double dhsl, String xz, String billState, String cgr,
			String jhr) {
		this.uids = uids;
		this.bh = bh;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.curDhsl = curDhsl;
		this.csdm = csdm;
		this.jhdj = jhdj;
		this.jhzj = jhzj;
		this.sjdj = sjdj;
		this.sjzj = sjzj;

		this.ygsl = ygsl;
		this.dhsl = dhsl;
		this.xz = xz;
		this.billState = billState;
		this.cgr = cgr;
		this.jhr = jhr;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
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

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getCurDhsl() {
		return this.curDhsl;
	}

	public void setCurDhsl(Double curDhsl) {
		this.curDhsl = curDhsl;
	}

	public String getCsdm() {
		return this.csdm;
	}

	public void setCsdm(String csdm) {
		this.csdm = csdm;
	}

	public Double getJhdj() {
		return this.jhdj;
	}

	public void setJhdj(Double jhdj) {
		this.jhdj = jhdj;
	}

	public Double getJhzj() {
		return this.jhzj;
	}

	public void setJhzj(Double jhzj) {
		this.jhzj = jhzj;
	}

	public Double getSjdj() {
		return this.sjdj;
	}

	public void setSjdj(Double sjdj) {
		this.sjdj = sjdj;
	}

	public Double getSjzj() {
		return this.sjzj;
	}

	public void setSjzj(Double sjzj) {
		this.sjzj = sjzj;
	}

	
	public Double getYgsl() {
		return this.ygsl;
	}

	public void setYgsl(Double ygsl) {
		this.ygsl = ygsl;
	}

	public Double getDhsl() {
		return this.dhsl;
	}

	public void setDhsl(Double dhsl) {
		this.dhsl = dhsl;
	}

	public String getXz() {
		return this.xz;
	}

	public void setXz(String xz) {
		this.xz = xz;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getCgr() {
		return this.cgr;
	}

	public void setCgr(String cgr) {
		this.cgr = cgr;
	}

	public String getJhr() {
		return this.jhr;
	}

	public void setJhr(String jhr) {
		this.jhr = jhr;
	}

	public String getComid() {
		return comid;
	}

	public void setComid(String comid) {
		this.comid = comid;
	}

	public String getHth() {
		return hth;
	}

	public void setHth(String hth) {
		this.hth = hth;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof ViewWzConCgjh))
			return false;
		ViewWzConCgjh castOther = (ViewWzConCgjh) other;

		return ((this.getUids() == castOther.getUids()) || (this.getUids() != null
				&& castOther.getUids() != null && this.getUids().equals(
				castOther.getUids())))
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
				&& ((this.getDw() == castOther.getDw()) || (this.getDw() != null
						&& castOther.getDw() != null && this.getDw().equals(
						castOther.getDw())))
				&& ((this.getCurDhsl() == castOther.getCurDhsl()) || (this
						.getCurDhsl() != null
						&& castOther.getCurDhsl() != null && this.getCurDhsl()
						.equals(castOther.getCurDhsl())))
				&& ((this.getCsdm() == castOther.getCsdm()) || (this.getCsdm() != null
						&& castOther.getCsdm() != null && this.getCsdm()
						.equals(castOther.getCsdm())))
				&& ((this.getJhdj() == castOther.getJhdj()) || (this.getJhdj() != null
						&& castOther.getJhdj() != null && this.getJhdj()
						.equals(castOther.getJhdj())))
				&& ((this.getJhzj() == castOther.getJhzj()) || (this.getJhzj() != null
						&& castOther.getJhzj() != null && this.getJhzj()
						.equals(castOther.getJhzj())))
				&& ((this.getSjdj() == castOther.getSjdj()) || (this.getSjdj() != null
						&& castOther.getSjdj() != null && this.getSjdj()
						.equals(castOther.getSjdj())))
				&& ((this.getSjzj() == castOther.getSjzj()) || (this.getSjzj() != null
						&& castOther.getSjzj() != null && this.getSjzj()
						.equals(castOther.getSjzj())))				
				&& ((this.getYgsl() == castOther.getYgsl()) || (this.getYgsl() != null
						&& castOther.getYgsl() != null && this.getYgsl()
						.equals(castOther.getYgsl())))
				&& ((this.getDhsl() == castOther.getDhsl()) || (this.getDhsl() != null
						&& castOther.getDhsl() != null && this.getDhsl()
						.equals(castOther.getDhsl())))
				&& ((this.getXz() == castOther.getXz()) || (this.getXz() != null
						&& castOther.getXz() != null && this.getXz().equals(
						castOther.getXz())))
				&& ((this.getBillState() == castOther.getBillState()) || (this
						.getBillState() != null
						&& castOther.getBillState() != null && this
						.getBillState().equals(castOther.getBillState())))
				&& ((this.getCgr() == castOther.getCgr()) || (this.getCgr() != null
						&& castOther.getCgr() != null && this.getCgr().equals(
						castOther.getCgr())))
				&& ((this.getJhr() == castOther.getJhr()) || (this.getJhr() != null
						&& castOther.getJhr() != null && this.getJhr().equals(
						castOther.getJhr())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getUids() == null ? 0 : this.getUids().hashCode());
		result = 37 * result + (getBh() == null ? 0 : this.getBh().hashCode());
		result = 37 * result + (getBm() == null ? 0 : this.getBm().hashCode());
		result = 37 * result + (getPm() == null ? 0 : this.getPm().hashCode());
		result = 37 * result + (getGg() == null ? 0 : this.getGg().hashCode());
		result = 37 * result + (getDw() == null ? 0 : this.getDw().hashCode());
		result = 37 * result
				+ (getCurDhsl() == null ? 0 : this.getCurDhsl().hashCode());
		result = 37 * result
				+ (getCsdm() == null ? 0 : this.getCsdm().hashCode());
		result = 37 * result
				+ (getJhdj() == null ? 0 : this.getJhdj().hashCode());
		result = 37 * result
				+ (getJhzj() == null ? 0 : this.getJhzj().hashCode());
		result = 37 * result
				+ (getSjdj() == null ? 0 : this.getSjdj().hashCode());
		result = 37 * result
				+ (getSjzj() == null ? 0 : this.getSjzj().hashCode());
		result = 37 * result
				+ (getYgsl() == null ? 0 : this.getYgsl().hashCode());
		result = 37 * result
				+ (getDhsl() == null ? 0 : this.getDhsl().hashCode());
		result = 37 * result + (getXz() == null ? 0 : this.getXz().hashCode());
		result = 37 * result
				+ (getBillState() == null ? 0 : this.getBillState().hashCode());
		result = 37 * result
				+ (getCgr() == null ? 0 : this.getCgr().hashCode());
		result = 37 * result
				+ (getJhr() == null ? 0 : this.getJhr().hashCode());
		return result;
	}

}