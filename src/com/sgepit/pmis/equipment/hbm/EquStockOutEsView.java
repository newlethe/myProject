package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

public class EquStockOutEsView implements java.io.Serializable {
	
	private String uids;
	private String conno;
	private String conmoneyno;
	private String outNo;
	private Date outDate;
	private String unitname;
	private String bdgname;
	private String equname;
	private String waretype;
	private String wareno;
	private String type;
	private String kksNo;//KKS编码
	private String usingPart;
    public String getKksNo() {
		return kksNo;
	}

	public void setKksNo(String kksNo) {
		this.kksNo = kksNo;
	}

	public String getUsingPart() {
		return usingPart;
	}

	public void setUsingPart(String usingPart) {
		this.usingPart = usingPart;
	}

	public EquStockOutEsView() {
		super();
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getConno() {
		return conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConmoneyno() {
		return conmoneyno;
	}

	public void setConmoneyno(String conmoneyno) {
		this.conmoneyno = conmoneyno;
	}

	public String getOutNo() {
		return outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public Date getOutDate() {
		return outDate;
	}

	public void setOutDate(Date outDate) {
		this.outDate = outDate;
	}

	public String getUnitname() {
		return unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public String getEquname() {
		return equname;
	}

	public void setEquname(String equname) {
		this.equname = equname;
	}

	public String getWaretype() {
		return waretype;
	}

	public void setWaretype(String waretype) {
		this.waretype = waretype;
	}

	public String getWareno() {
		return wareno;
	}

	public void setWareno(String wareno) {
		this.wareno = wareno;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
    
}
