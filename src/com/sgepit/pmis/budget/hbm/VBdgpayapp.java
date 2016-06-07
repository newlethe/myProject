package com.sgepit.pmis.budget.hbm;

import java.util.Date;

/**
 * VBdgpayappId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VBdgpayapp implements java.io.Serializable {

	// Fields

	private String payappid;
	private String payappno;
	private String bdgid;
	private String pid;
	private String conid;
	private String proname;
	private Date actiondate;
	private String remark;
	private Long isleaf;
	private String parent;
	private Date begindate;
	private Date enddate;
	private Double applypay;
	private Double auditing;
	private Double factpay;
	private Double passpay;
	private Long sumfactpay;
	//extend 
	private Double bdgmoney;
	private String bdgno;
	private String bdgname;
	private Double realbdgmoney;
	private Double   sumrealmoney;
	// Constructors

	public Double getBdgmoney() {
		return bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public Double getRealbdgmoney() {
		return realbdgmoney;
	}

	public void setRealbdgmoney(Double realbdgmoney) {
		this.realbdgmoney = realbdgmoney;
	}

	/** default constructor */
	public VBdgpayapp() {
	}

	/** minimal constructor */
	public VBdgpayapp(String payappid, String bdgid, String pid, String conid) {
		this.payappid = payappid;
		this.bdgid = bdgid;
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public VBdgpayapp(String payappid, String payappno, String bdgid,
			String pid, String conid, String proname, Date actiondate,
			String remark, Long isleaf, String parent, Date begindate,
			Date enddate, Double applypay, Double auditing, Double factpay,
			Double passpay, Long sumfactpay) {
		this.payappid = payappid;
		this.payappno = payappno;
		this.bdgid = bdgid;
		this.pid = pid;
		this.conid = conid;
		this.proname = proname;
		this.actiondate = actiondate;
		this.remark = remark;
		this.isleaf = isleaf;
		this.parent = parent;
		this.begindate = begindate;
		this.enddate = enddate;
		this.applypay = applypay;
		this.auditing = auditing;
		this.factpay = factpay;
		this.passpay = passpay;
		this.sumfactpay = sumfactpay;
	}

	// Property accessors

	public String getPayappid() {
		return this.payappid;
	}

	public void setPayappid(String payappid) {
		this.payappid = payappid;
	}

	public String getPayappno() {
		return this.payappno;
	}

	public void setPayappno(String payappno) {
		this.payappno = payappno;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getProname() {
		return this.proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

	public Date getActiondate() {
		return this.actiondate;
	}

	public void setActiondate(Date actiondate) {
		this.actiondate = actiondate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Date getBegindate() {
		return this.begindate;
	}

	public void setBegindate(Date begindate) {
		this.begindate = begindate;
	}

	public Date getEnddate() {
		return this.enddate;
	}

	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}

	public Double getApplypay() {
		return this.applypay;
	}

	public void setApplypay(Double applypay) {
		this.applypay = applypay;
	}

	public Double getAuditing() {
		return this.auditing;
	}

	public void setAuditing(Double auditing) {
		this.auditing = auditing;
	}

	public Double getFactpay() {
		return this.factpay;
	}

	public void setFactpay(Double factpay) {
		this.factpay = factpay;
	}

	public Double getPasspay() {
		return this.passpay;
	}

	public void setPasspay(Double passpay) {
		this.passpay = passpay;
	}

	public Long getSumfactpay() {
		return this.sumfactpay;
	}

	public void setSumfactpay(Long sumfactpay) {
		this.sumfactpay = sumfactpay;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof VBdgpayapp))
			return false;
		VBdgpayapp castOther = (VBdgpayapp) other;

		return ((this.getPayappid() == castOther.getPayappid()) || (this
				.getPayappid() != null
				&& castOther.getPayappid() != null && this.getPayappid()
				.equals(castOther.getPayappid())))
				&& ((this.getPayappno() == castOther.getPayappno()) || (this
						.getPayappno() != null
						&& castOther.getPayappno() != null && this
						.getPayappno().equals(castOther.getPayappno())))
				&& ((this.getBdgid() == castOther.getBdgid()) || (this
						.getBdgid() != null
						&& castOther.getBdgid() != null && this.getBdgid()
						.equals(castOther.getBdgid())))
				&& ((this.getPid() == castOther.getPid()) || (this.getPid() != null
						&& castOther.getPid() != null && this.getPid().equals(
						castOther.getPid())))
				&& ((this.getConid() == castOther.getConid()) || (this
						.getConid() != null
						&& castOther.getConid() != null && this.getConid()
						.equals(castOther.getConid())))
				&& ((this.getProname() == castOther.getProname()) || (this
						.getProname() != null
						&& castOther.getProname() != null && this.getProname()
						.equals(castOther.getProname())))
				&& ((this.getActiondate() == castOther.getActiondate()) || (this
						.getActiondate() != null
						&& castOther.getActiondate() != null && this
						.getActiondate().equals(castOther.getActiondate())))
				&& ((this.getRemark() == castOther.getRemark()) || (this
						.getRemark() != null
						&& castOther.getRemark() != null && this.getRemark()
						.equals(castOther.getRemark())))
				&& ((this.getIsleaf() == castOther.getIsleaf()) || (this
						.getIsleaf() != null
						&& castOther.getIsleaf() != null && this.getIsleaf()
						.equals(castOther.getIsleaf())))
				&& ((this.getParent() == castOther.getParent()) || (this
						.getParent() != null
						&& castOther.getParent() != null && this.getParent()
						.equals(castOther.getParent())))
				&& ((this.getBegindate() == castOther.getBegindate()) || (this
						.getBegindate() != null
						&& castOther.getBegindate() != null && this
						.getBegindate().equals(castOther.getBegindate())))
				&& ((this.getEnddate() == castOther.getEnddate()) || (this
						.getEnddate() != null
						&& castOther.getEnddate() != null && this.getEnddate()
						.equals(castOther.getEnddate())))
				&& ((this.getApplypay() == castOther.getApplypay()) || (this
						.getApplypay() != null
						&& castOther.getApplypay() != null && this
						.getApplypay().equals(castOther.getApplypay())))
				&& ((this.getAuditing() == castOther.getAuditing()) || (this
						.getAuditing() != null
						&& castOther.getAuditing() != null && this
						.getAuditing().equals(castOther.getAuditing())))
				&& ((this.getFactpay() == castOther.getFactpay()) || (this
						.getFactpay() != null
						&& castOther.getFactpay() != null && this.getFactpay()
						.equals(castOther.getFactpay())))
				&& ((this.getPasspay() == castOther.getPasspay()) || (this
						.getPasspay() != null
						&& castOther.getPasspay() != null && this.getPasspay()
						.equals(castOther.getPasspay())))
				&& ((this.getSumfactpay() == castOther.getSumfactpay()) || (this
						.getSumfactpay() != null
						&& castOther.getSumfactpay() != null && this
						.getSumfactpay().equals(castOther.getSumfactpay())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getPayappid() == null ? 0 : this.getPayappid().hashCode());
		result = 37 * result
				+ (getPayappno() == null ? 0 : this.getPayappno().hashCode());
		result = 37 * result
				+ (getBdgid() == null ? 0 : this.getBdgid().hashCode());
		result = 37 * result
				+ (getPid() == null ? 0 : this.getPid().hashCode());
		result = 37 * result
				+ (getConid() == null ? 0 : this.getConid().hashCode());
		result = 37 * result
				+ (getProname() == null ? 0 : this.getProname().hashCode());
		result = 37
				* result
				+ (getActiondate() == null ? 0 : this.getActiondate()
						.hashCode());
		result = 37 * result
				+ (getRemark() == null ? 0 : this.getRemark().hashCode());
		result = 37 * result
				+ (getIsleaf() == null ? 0 : this.getIsleaf().hashCode());
		result = 37 * result
				+ (getParent() == null ? 0 : this.getParent().hashCode());
		result = 37 * result
				+ (getBegindate() == null ? 0 : this.getBegindate().hashCode());
		result = 37 * result
				+ (getEnddate() == null ? 0 : this.getEnddate().hashCode());
		result = 37 * result
				+ (getApplypay() == null ? 0 : this.getApplypay().hashCode());
		result = 37 * result
				+ (getAuditing() == null ? 0 : this.getAuditing().hashCode());
		result = 37 * result
				+ (getFactpay() == null ? 0 : this.getFactpay().hashCode());
		result = 37 * result
				+ (getPasspay() == null ? 0 : this.getPasspay().hashCode());
		result = 37
				* result
				+ (getSumfactpay() == null ? 0 : this.getSumfactpay()
						.hashCode());
		return result;
	}

	public Double getSumrealmoney() {
		return sumrealmoney;
	}

	public void setSumrealmoney(Double sumrealmoney) {
		this.sumrealmoney = sumrealmoney;
	}
}