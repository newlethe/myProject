package com.sgepit.pmis.equipment.hbm;


import java.util.Date;

/**
 * EquGetGoods entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquGetGoods implements java.io.Serializable {

	// Fields

	private String ggid;
	private String pid;
	private String conid;
	private String ggNo;
	private Date ggDate;
	private Long ggNum;
	private String sgNo;
	private Date sgDate;
	private String sgMan;
	private String incasementNo;
	private String conveyance;
	private String conveyanceNo;
	private String faceNote;
	private String layPlace;
	private String remark;
	private String openBox;
	private Date rkrq;
	private String sbmc;
	private String dw;
	private Double equipfee;
	private Double carryfee;
	private Double otherfee;
	private Double toolfee;
	private Double partfee;
	private Double totalfee;
	private String sysbh;
	private String sysmc;
	private String invoicebh;
	private String checkbh;
	
	//extends
	private String partb;
	private Double conmoney;
	private String conno;
	private String rkzt;
	private String sqr;
	private String bdgid;
	private String bdgname;
	private String openid;
	private String ghfp;
	
	
	private String ywtype;
	private String cgtype;
	private String rktype;
	private String billstate;
	// Constructors


	public EquGetGoods(String ggid, String pid, String conid, String ggNo,
			Date ggDate, Long ggNum, String sgNo, Date sgDate, String sgMan,
			String incasementNo, String conveyance, String conveyanceNo,
			String faceNote, String layPlace, String remark, String openBox,
			Date rkrq, String sbmc, String dw, Double equipfee,
			Double carryfee, Double otherfee, Double toolfee, Double partfee,
			Double totalfee, String sysbh, String sysmc, String invoicebh,
			String checkbh, String partb, Double conmoney, String conno,
			String rkzt, String sqr, String bdgid, String bdgname,
			String openid, String ghfp) {
		super();
		this.ggid = ggid;
		this.pid = pid;
		this.conid = conid;
		this.ggNo = ggNo;
		this.ggDate = ggDate;
		this.ggNum = ggNum;
		this.sgNo = sgNo;
		this.sgDate = sgDate;
		this.sgMan = sgMan;
		this.incasementNo = incasementNo;
		this.conveyance = conveyance;
		this.conveyanceNo = conveyanceNo;
		this.faceNote = faceNote;
		this.layPlace = layPlace;
		this.remark = remark;
		this.openBox = openBox;
		this.rkrq = rkrq;
		this.sbmc = sbmc;
		this.dw = dw;
		this.equipfee = equipfee;
		this.carryfee = carryfee;
		this.otherfee = otherfee;
		this.toolfee = toolfee;
		this.partfee = partfee;
		this.totalfee = totalfee;
		this.sysbh = sysbh;
		this.sysmc = sysmc;
		this.invoicebh = invoicebh;
		this.checkbh = checkbh;
		this.partb = partb;
		this.conmoney = conmoney;
		this.conno = conno;
		this.rkzt = rkzt;
		this.sqr = sqr;
		this.bdgid = bdgid;
		this.bdgname = bdgname;
		this.openid = openid;
		this.ghfp = ghfp;
	}

	public String getPartb() {
		return partb;
	}

	public void setPartb(String partb) {
		this.partb = partb;
	}

	public Double getConmoney() {
		return conmoney;
	}

	public void setConmoney(Double conmoney) {
		this.conmoney = conmoney;
	}

	/** default constructor */
	public EquGetGoods() {
	}

	/** minimal constructor */
	public EquGetGoods(String pid, String conid) {
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */

	// Property accessors

	public String getGgid() {
		return this.ggid;
	}

	public void setGgid(String ggid) {
		this.ggid = ggid;
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

	public String getGgNo() {
		return this.ggNo;
	}

	public void setGgNo(String ggNo) {
		this.ggNo = ggNo;
	}

	public Date getGgDate() {
		return this.ggDate;
	}

	public void setGgDate(Date ggDate) {
		this.ggDate = ggDate;
	}

	public Long getGgNum() {
		return this.ggNum;
	}

	public void setGgNum(Long ggNum) {
		this.ggNum = ggNum;
	}

	public String getSgNo() {
		return this.sgNo;
	}

	public void setSgNo(String sgNo) {
		this.sgNo = sgNo;
	}

	public Date getSgDate() {
		return this.sgDate;
	}

	public void setSgDate(Date sgDate) {
		this.sgDate = sgDate;
	}

	public String getSgMan() {
		return this.sgMan;
	}

	public void setSgMan(String sgMan) {
		this.sgMan = sgMan;
	}

	public String getIncasementNo() {
		return this.incasementNo;
	}

	public void setIncasementNo(String incasementNo) {
		this.incasementNo = incasementNo;
	}

	public String getConveyance() {
		return this.conveyance;
	}

	public void setConveyance(String conveyance) {
		this.conveyance = conveyance;
	}

	public String getConveyanceNo() {
		return this.conveyanceNo;
	}

	public void setConveyanceNo(String conveyanceNo) {
		this.conveyanceNo = conveyanceNo;
	}

	public String getFaceNote() {
		return this.faceNote;
	}

	public void setFaceNote(String faceNote) {
		this.faceNote = faceNote;
	}

	public String getLayPlace() {
		return this.layPlace;
	}

	public void setLayPlace(String layPlace) {
		this.layPlace = layPlace;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getOpenBox() {
		return this.openBox;
	}

	public void setOpenBox(String openBox) {
		this.openBox = openBox;
	}

	public Date getRkrq() {
		return this.rkrq;
	}

	public void setRkrq(Date rkrq) {
		this.rkrq = rkrq;
	}

	public String getSbmc() {
		return this.sbmc;
	}

	public void setSbmc(String sbmc) {
		this.sbmc = sbmc;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getEquipfee() {
		return this.equipfee;
	}

	public void setEquipfee(Double equipfee) {
		this.equipfee = equipfee;
	}

	public Double getCarryfee() {
		return this.carryfee;
	}

	public void setCarryfee(Double carryfee) {
		this.carryfee = carryfee;
	}

	public Double getOtherfee() {
		return this.otherfee;
	}

	public void setOtherfee(Double otherfee) {
		this.otherfee = otherfee;
	}

	public Double getToolfee() {
		return this.toolfee;
	}

	public void setToolfee(Double toolfee) {
		this.toolfee = toolfee;
	}

	public Double getPartfee() {
		return this.partfee;
	}

	public void setPartfee(Double partfee) {
		this.partfee = partfee;
	}

	public Double getTotalfee() {
		return this.totalfee;
	}

	public void setTotalfee(Double totalfee) {
		this.totalfee = totalfee;
	}

	public String getSysbh() {
		return this.sysbh;
	}

	public void setSysbh(String sysbh) {
		this.sysbh = sysbh;
	}

	public String getSysmc() {
		return this.sysmc;
	}

	public void setSysmc(String sysmc) {
		this.sysmc = sysmc;
	}

	public String getInvoicebh() {
		return this.invoicebh;
	}

	public void setInvoicebh(String invoicebh) {
		this.invoicebh = invoicebh;
	}

	public String getCheckbh() {
		return this.checkbh;
	}

	public void setCheckbh(String checkbh) {
		this.checkbh = checkbh;
	}

	public String getConno() {
		return conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getRkzt() {
		return rkzt;
	}

	public void setRkzt(String rkzt) {
		this.rkzt = rkzt;
	}

	public String getSqr() {
		return sqr;
	}

	public void setSqr(String sqr) {
		this.sqr = sqr;
	}

	public String getBdgid() {
		return bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public String getGhfp() {
		return ghfp;
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

	public String getCgtype() {
		return cgtype;
	}

	public void setCgtype(String cgtype) {
		this.cgtype = cgtype;
	}

	public String getRktype() {
		return rktype;
	}

	public void setRktype(String rktype) {
		this.rktype = rktype;
	}

	public String getBillstate() {
		return billstate;
	}

	public void setBillstate(String billstate) {
		this.billstate = billstate;
	}

}