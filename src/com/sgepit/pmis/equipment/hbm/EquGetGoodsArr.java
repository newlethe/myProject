package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGetGoodsArr entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquGetGoodsArr implements java.io.Serializable {

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
	private String receivenum;

    //extends properties
	
	private Date yjfhrq;
	private Date sjfhrq;
	private Date yjdhrq;
	private String csno;
	private String dhph;
	private String fhtzd;
	private String fhgz;
	private String dhgz;
	private String thr;
	private String fph;
	private Long fpje;
	private String dhzt;
	private Date conjh_date;
	private Date consj_date;
	private String conys;
	private String dhsb;
	private Long billstate;
	// Constructors

	public EquGetGoodsArr(String ggid, String pid, String conid, String ggNo,
			Date ggDate, Long ggNum, String sgNo, Date sgDate, String sgMan,
			String incasementNo, String conveyance, String conveyanceNo,
			String faceNote, String layPlace, String remark, String openBox,
			String receivenum, Date yjfhrq, Date sjfhrq, Date yjdhrq,
			String csno, String dhph, String fhtzd, String fhgz, String dhgz,
			String thr, String fph, Long fpje, String dhzt, Date conjh_date,
			Date consj_date, String conys, String dhsb,Long billstate) {
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
		this.receivenum = receivenum;
		this.yjfhrq = yjfhrq;
		this.sjfhrq = sjfhrq;
		this.yjdhrq = yjdhrq;
		this.csno = csno;
		this.dhph = dhph;
		this.fhtzd = fhtzd;
		this.fhgz = fhgz;
		this.dhgz = dhgz;
		this.thr = thr;
		this.fph = fph;
		this.fpje = fpje;
		this.dhzt = dhzt;
		this.conjh_date = conjh_date;
		this.consj_date = consj_date;
		this.conys = conys;
		this.dhsb = dhsb;
		this.billstate = billstate;
	}

	/** default constructor */
	public EquGetGoodsArr() {
	}

	/** minimal constructor */
	public EquGetGoodsArr(String pid, String conid) {
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

	public String getReceivenum() {
		return receivenum;
	}

	public void setReceivenum(String receivenum) {
		this.receivenum = receivenum;
	}

	public Date getYjfhrq() {
		return yjfhrq;
	}

	public void setYjfhrq(Date yjfhrq) {
		this.yjfhrq = yjfhrq;
	}

	public Date getSjfhrq() {
		return sjfhrq;
	}

	public void setSjfhrq(Date sjfhrq) {
		this.sjfhrq = sjfhrq;
	}

	public Date getYjdhrq() {
		return yjdhrq;
	}

	public void setYjdhrq(Date yjdhrq) {
		this.yjdhrq = yjdhrq;
	}

	public String getCsno() {
		return csno;
	}

	public void setCsno(String csno) {
		this.csno = csno;
	}

	public String getDhph() {
		return dhph;
	}

	public void setDhph(String dhph) {
		this.dhph = dhph;
	}

	public String getFhtzd() {
		return fhtzd;
	}

	public void setFhtzd(String fhtzd) {
		this.fhtzd = fhtzd;
	}

	public String getFhgz() {
		return fhgz;
	}

	public void setFhgz(String fhgz) {
		this.fhgz = fhgz;
	}

	public String getDhgz() {
		return dhgz;
	}

	public void setDhgz(String dhgz) {
		this.dhgz = dhgz;
	}

	public String getThr() {
		return thr;
	}

	public void setThr(String thr) {
		this.thr = thr;
	}

	public String getFph() {
		return fph;
	}

	public void setFph(String fph) {
		this.fph = fph;
	}

	public Long getFpje() {
		return fpje;
	}

	public void setFpje(Long fpje) {
		this.fpje = fpje;
	}

	public String getDhzt() {
		return dhzt;
	}

	public void setDhzt(String dhzt) {
		this.dhzt = dhzt;
	}

	public Date getConjh_date() {
		return conjh_date;
	}

	public void setConjh_date(Date conjh_date) {
		this.conjh_date = conjh_date;
	}

	public Date getConsj_date() {
		return consj_date;
	}

	public void setConsj_date(Date consj_date) {
		this.consj_date = consj_date;
	}

	public String getConys() {
		return conys;
	}

	public void setConys(String conys) {
		this.conys = conys;
	}

	public String getDhsb() {
		return dhsb;
	}

	public void setDhsb(String dhsb) {
		this.dhsb = dhsb;
	}

	public Long getBillstate() {
		return billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}
}