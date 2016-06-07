package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquHouseout entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquHouseout implements java.io.Serializable {

	// Fields

	private String outid;
	private String pid;
	private String conid;
	private String getPart;
	private String getPerson;
	private Double equMoney;
	private Double sumMoney;
	private String wareAdmin;
	private String state;
	private Date outDate;
	private String remark;
	private String outno;
	private Long equipfee;
	private Long carryfee;
	private Long otherfee;
	private Long toolfee;
	private Long partfee;
	private Long totalfee;
	private String checkbh;
	private String rkzt;
	private String sqr;
	private String bdgid;
	private String bdgname;
	private String openid;
	private String ghfp;

	
	private String ywtype;
	private String cktype;
	private String billstate;
	
	// Constructors

	/** default constructor */
	public EquHouseout() {
	}

	/** minimal constructor */
	public EquHouseout(String outid, String pid, String conid) {
		this.outid = outid;
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public EquHouseout(String outid, String pid, String conid, String getPart,
			String getPerson, Double equMoney, Double sumMoney,
			String wareAdmin, String state, Date outDate, String remark,
			String outno, Long equipfee, Long carryfee, Long otherfee,
			Long toolfee, Long partfee, Long totalfee, String checkbh,
			String rkzt, String sqr, String bdgid, String bdgname,
			String openid, String ghfp) {
		this.outid = outid;
		this.pid = pid;
		this.conid = conid;
		this.getPart = getPart;
		this.getPerson = getPerson;
		this.equMoney = equMoney;
		this.sumMoney = sumMoney;
		this.wareAdmin = wareAdmin;
		this.state = state;
		this.outDate = outDate;
		this.remark = remark;
		this.outno = outno;
		this.equipfee = equipfee;
		this.carryfee = carryfee;
		this.otherfee = otherfee;
		this.toolfee = toolfee;
		this.partfee = partfee;
		this.totalfee = totalfee;
		this.checkbh = checkbh;
		this.rkzt = rkzt;
		this.sqr = sqr;
		this.bdgid = bdgid;
		this.bdgname = bdgname;
		this.openid = openid;
		this.ghfp = ghfp;
	}

	// Property accessors

	public String getOutid() {
		return this.outid;
	}

	public void setOutid(String outid) {
		this.outid = outid;
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

	public String getGetPart() {
		return this.getPart;
	}

	public void setGetPart(String getPart) {
		this.getPart = getPart;
	}

	public String getGetPerson() {
		return this.getPerson;
	}

	public void setGetPerson(String getPerson) {
		this.getPerson = getPerson;
	}

	public Double getEquMoney() {
		return this.equMoney;
	}

	public void setEquMoney(Double equMoney) {
		this.equMoney = equMoney;
	}

	public Double getSumMoney() {
		return this.sumMoney;
	}

	public void setSumMoney(Double sumMoney) {
		this.sumMoney = sumMoney;
	}

	public String getWareAdmin() {
		return this.wareAdmin;
	}

	public void setWareAdmin(String wareAdmin) {
		this.wareAdmin = wareAdmin;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public Date getOutDate() {
		return this.outDate;
	}

	public void setOutDate(Date outDate) {
		this.outDate = outDate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getOutno() {
		return this.outno;
	}

	public void setOutno(String outno) {
		this.outno = outno;
	}

	public Long getEquipfee() {
		return this.equipfee;
	}

	public void setEquipfee(Long equipfee) {
		this.equipfee = equipfee;
	}

	public Long getCarryfee() {
		return this.carryfee;
	}

	public void setCarryfee(Long carryfee) {
		this.carryfee = carryfee;
	}

	public Long getOtherfee() {
		return this.otherfee;
	}

	public void setOtherfee(Long otherfee) {
		this.otherfee = otherfee;
	}

	public Long getToolfee() {
		return this.toolfee;
	}

	public void setToolfee(Long toolfee) {
		this.toolfee = toolfee;
	}

	public Long getPartfee() {
		return this.partfee;
	}

	public void setPartfee(Long partfee) {
		this.partfee = partfee;
	}

	public Long getTotalfee() {
		return this.totalfee;
	}

	public void setTotalfee(Long totalfee) {
		this.totalfee = totalfee;
	}

	public String getCheckbh() {
		return this.checkbh;
	}

	public void setCheckbh(String checkbh) {
		this.checkbh = checkbh;
	}

	public String getRkzt() {
		return this.rkzt;
	}

	public void setRkzt(String rkzt) {
		this.rkzt = rkzt;
	}

	public String getSqr() {
		return this.sqr;
	}

	public void setSqr(String sqr) {
		this.sqr = sqr;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgname() {
		return this.bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public String getOpenid() {
		return this.openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public String getGhfp() {
		return this.ghfp;
	}

	public void setGhfp(String ghfp) {
		this.ghfp = ghfp;
	}

	public String getYwtype() {
		return ywtype;
	}

	public void setYwtype(String ywtype) {
		this.ywtype = ywtype;
	}

	public String getCktype() {
		return cktype;
	}

	public void setCktype(String cktype) {
		this.cktype = cktype;
	}

	public String getBillstate() {
		return billstate;
	}

	public void setBillstate(String billstate) {
		this.billstate = billstate;
	}

}