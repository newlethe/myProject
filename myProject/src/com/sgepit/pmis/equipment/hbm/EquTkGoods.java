package com.sgepit.pmis.equipment.hbm;


import java.util.Date;

/**
 * EquGetGoods entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquTkGoods implements java.io.Serializable {

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
	private Date tkrq;
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
	

	// Constructors

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
	public EquTkGoods() {
	}

	/** minimal constructor */
	public EquTkGoods(String pid, String conid) {
		this.pid = pid;
		this.conid = conid;
	}

	/** full constructor */
	public EquTkGoods(String pid, String conid, String ggNo, Date ggDate,
			Long ggNum, String sgNo, Date sgDate, String sgMan,
			String incasementNo, String conveyance, String conveyanceNo,
			String faceNote, String layPlace, String remark, String openBox,
			Date tkrq, String sbmc, String dw, Double equipfee, Double carryfee,
			Double otherfee, Double toolfee, Double partfee, Double totalfee,
			String sysbh, String sysmc, String invoicebh, String checkbh) {
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
		this.tkrq = tkrq;
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
	}

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


	public void setRkrq(Date tkrq) {
		this.tkrq = tkrq;
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

	public Date getTkrq() {
		return tkrq;
	}

	public void setTkrq(Date tkrq) {
		this.tkrq = tkrq;
	}

}