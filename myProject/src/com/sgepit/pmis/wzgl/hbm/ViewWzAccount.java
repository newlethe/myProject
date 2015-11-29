package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * ViewWzAccountId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ViewWzAccount implements java.io.Serializable {

	// Fields

	private String bm;
	private String dw;
	private Date qrrq;
	private String billname;
	private Double sl;
	private Double jhdj;
	private Long jhzj;
	private String sqbm;
	private String bgr;
	private String bh;
	private Date zdrq;
	private Long jcsl;
	private Long jczj;
	private String billtype;
	private Double stocks;
	private String billState;

	// Constructors

	/** default constructor */
	public ViewWzAccount() {
	}

	/** full constructor */
	public ViewWzAccount(String bm, String dw, Date qrrq, String billname,
			Double sl, Double jhdj, Long jhzj, String sqbm, String bgr,
			String bh, Date zdrq, Long jcsl, Long jczj, String billtype,
			Double stocks, String billState) {
		this.bm = bm;
		this.dw = dw;
		this.qrrq = qrrq;
		this.billname = billname;
		this.sl = sl;
		this.jhdj = jhdj;
		this.jhzj = jhzj;
		this.sqbm = sqbm;
		this.bgr = bgr;
		this.bh = bh;
		this.zdrq = zdrq;
		this.jcsl = jcsl;
		this.jczj = jczj;
		this.billtype = billtype;
		this.stocks = stocks;
		this.billState = billState;
	}

	// Property accessors

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Date getQrrq() {
		return this.qrrq;
	}

	public void setQrrq(Date qrrq) {
		this.qrrq = qrrq;
	}

	public String getBillname() {
		return this.billname;
	}

	public void setBillname(String billname) {
		this.billname = billname;
	}

	public Double getSl() {
		return this.sl;
	}

	public void setSl(Double sl) {
		this.sl = sl;
	}

	public Double getJhdj() {
		return this.jhdj;
	}

	public void setJhdj(Double jhdj) {
		this.jhdj = jhdj;
	}

	public Long getJhzj() {
		return this.jhzj;
	}

	public void setJhzj(Long jhzj) {
		this.jhzj = jhzj;
	}

	public String getSqbm() {
		return this.sqbm;
	}

	public void setSqbm(String sqbm) {
		this.sqbm = sqbm;
	}

	public String getBgr() {
		return this.bgr;
	}

	public void setBgr(String bgr) {
		this.bgr = bgr;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public Date getZdrq() {
		return this.zdrq;
	}

	public void setZdrq(Date zdrq) {
		this.zdrq = zdrq;
	}

	public Long getJcsl() {
		return this.jcsl;
	}

	public void setJcsl(Long jcsl) {
		this.jcsl = jcsl;
	}

	public Long getJczj() {
		return this.jczj;
	}

	public void setJczj(Long jczj) {
		this.jczj = jczj;
	}

	public String getBilltype() {
		return this.billtype;
	}

	public void setBilltype(String billtype) {
		this.billtype = billtype;
	}

	public Double getStocks() {
		return this.stocks;
	}

	public void setStocks(Double stocks) {
		this.stocks = stocks;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof ViewWzAccount))
			return false;
		ViewWzAccount castOther = (ViewWzAccount) other;

		return ((this.getBm() == castOther.getBm()) || (this.getBm() != null
				&& castOther.getBm() != null && this.getBm().equals(
				castOther.getBm())))
				&& ((this.getDw() == castOther.getDw()) || (this.getDw() != null
						&& castOther.getDw() != null && this.getDw().equals(
						castOther.getDw())))
				&& ((this.getQrrq() == castOther.getQrrq()) || (this.getQrrq() != null
						&& castOther.getQrrq() != null && this.getQrrq()
						.equals(castOther.getQrrq())))
				&& ((this.getBillname() == castOther.getBillname()) || (this
						.getBillname() != null
						&& castOther.getBillname() != null && this
						.getBillname().equals(castOther.getBillname())))
				&& ((this.getSl() == castOther.getSl()) || (this.getSl() != null
						&& castOther.getSl() != null && this.getSl().equals(
						castOther.getSl())))
				&& ((this.getJhdj() == castOther.getJhdj()) || (this.getJhdj() != null
						&& castOther.getJhdj() != null && this.getJhdj()
						.equals(castOther.getJhdj())))
				&& ((this.getJhzj() == castOther.getJhzj()) || (this.getJhzj() != null
						&& castOther.getJhzj() != null && this.getJhzj()
						.equals(castOther.getJhzj())))
				&& ((this.getSqbm() == castOther.getSqbm()) || (this.getSqbm() != null
						&& castOther.getSqbm() != null && this.getSqbm()
						.equals(castOther.getSqbm())))
				&& ((this.getBgr() == castOther.getBgr()) || (this.getBgr() != null
						&& castOther.getBgr() != null && this.getBgr().equals(
						castOther.getBgr())))
				&& ((this.getBh() == castOther.getBh()) || (this.getBh() != null
						&& castOther.getBh() != null && this.getBh().equals(
						castOther.getBh())))
				&& ((this.getZdrq() == castOther.getZdrq()) || (this.getZdrq() != null
						&& castOther.getZdrq() != null && this.getZdrq()
						.equals(castOther.getZdrq())))
				&& ((this.getJcsl() == castOther.getJcsl()) || (this.getJcsl() != null
						&& castOther.getJcsl() != null && this.getJcsl()
						.equals(castOther.getJcsl())))
				&& ((this.getJczj() == castOther.getJczj()) || (this.getJczj() != null
						&& castOther.getJczj() != null && this.getJczj()
						.equals(castOther.getJczj())))
				&& ((this.getBilltype() == castOther.getBilltype()) || (this
						.getBilltype() != null
						&& castOther.getBilltype() != null && this
						.getBilltype().equals(castOther.getBilltype())))
				&& ((this.getStocks() == castOther.getStocks()) || (this
						.getStocks() != null
						&& castOther.getStocks() != null && this.getStocks()
						.equals(castOther.getStocks())))
				&& ((this.getBillState() == castOther.getBillState()) || (this
						.getBillState() != null
						&& castOther.getBillState() != null && this
						.getBillState().equals(castOther.getBillState())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + (getBm() == null ? 0 : this.getBm().hashCode());
		result = 37 * result + (getDw() == null ? 0 : this.getDw().hashCode());
		result = 37 * result
				+ (getQrrq() == null ? 0 : this.getQrrq().hashCode());
		result = 37 * result
				+ (getBillname() == null ? 0 : this.getBillname().hashCode());
		result = 37 * result + (getSl() == null ? 0 : this.getSl().hashCode());
		result = 37 * result
				+ (getJhdj() == null ? 0 : this.getJhdj().hashCode());
		result = 37 * result
				+ (getJhzj() == null ? 0 : this.getJhzj().hashCode());
		result = 37 * result
				+ (getSqbm() == null ? 0 : this.getSqbm().hashCode());
		result = 37 * result
				+ (getBgr() == null ? 0 : this.getBgr().hashCode());
		result = 37 * result + (getBh() == null ? 0 : this.getBh().hashCode());
		result = 37 * result
				+ (getZdrq() == null ? 0 : this.getZdrq().hashCode());
		result = 37 * result
				+ (getJcsl() == null ? 0 : this.getJcsl().hashCode());
		result = 37 * result
				+ (getJczj() == null ? 0 : this.getJczj().hashCode());
		result = 37 * result
				+ (getBilltype() == null ? 0 : this.getBilltype().hashCode());
		result = 37 * result
				+ (getStocks() == null ? 0 : this.getStocks().hashCode());
		result = 37 * result
				+ (getBillState() == null ? 0 : this.getBillState().hashCode());
		return result;
	}

}