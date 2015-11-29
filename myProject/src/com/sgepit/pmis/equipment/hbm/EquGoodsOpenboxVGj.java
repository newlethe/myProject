package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备开箱检验单打印
 */
import java.util.Date;

public class EquGoodsOpenboxVGj  implements java.io.Serializable{
	private String uids;
	private String conNo;
	private String conName;
	private String openPlace;
	private Date openDate;
	private String sysName;
	private String partyB;
	private Date equArriveDate;
	private String openNo;
	private String openDesc;
	private String factory;
	private String professinal;
	public EquGoodsOpenboxVGj() {
		super();
	}
	public EquGoodsOpenboxVGj(String uids, String conNo, String conName,
			String openPlace, Date openDate, String sysName, String partyB,Date equArriveDate) {
		super();
		this.uids = uids;
		this.conNo = conNo;
		this.conName = conName;
		this.openPlace = openPlace;
		this.openDate = openDate;
		this.sysName = sysName;
		this.partyB = partyB;
		this.equArriveDate = equArriveDate;
	}
	
	public EquGoodsOpenboxVGj(String uids, String conNo, String conName,
			String openPlace, Date openDate, String sysName, String partyB,
			Date equArriveDate, String openNo, String openDesc, String factory,
			String professinal) {
		super();
		this.uids = uids;
		this.conNo = conNo;
		this.conName = conName;
		this.openPlace = openPlace;
		this.openDate = openDate;
		this.sysName = sysName;
		this.partyB = partyB;
		this.equArriveDate = equArriveDate;
		this.openNo = openNo;
		this.openDesc = openDesc;
		this.factory = factory;
		this.professinal = professinal;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getConNo() {
		return conNo;
	}
	public void setConNo(String conNo) {
		this.conNo = conNo;
	}
	public String getConName() {
		return conName;
	}
	public void setConName(String conName) {
		this.conName = conName;
	}
	public String getOpenPlace() {
		return openPlace;
	}
	public void setOpenPlace(String openPlace) {
		this.openPlace = openPlace;
	}
	public Date getOpenDate() {
		return openDate;
	}
	public void setOpenDate(Date openDate) {
		this.openDate = openDate;
	}
	public String getSysName() {
		return sysName;
	}
	public void setSysName(String sysName) {
		this.sysName = sysName;
	}
	public String getPartyB() {
		return partyB;
	}
	public void setPartyB(String partyB) {
		this.partyB = partyB;
	}
	public Date getEquArriveDate() {
		return equArriveDate;
	}
	public void setEquArriveDate(Date equArriveDate) {
		this.equArriveDate = equArriveDate;
	}
	public String getOpenNo() {
		return openNo;
	}
	public void setOpenNo(String openNo) {
		this.openNo = openNo;
	}
	public String getOpenDesc() {
		return openDesc;
	}
	public void setOpenDesc(String openDesc) {
		this.openDesc = openDesc;
	}
	public String getFactory() {
		return factory;
	}
	public void setFactory(String factory) {
		this.factory = factory;
	}
	public String getProfessinal() {
		return professinal;
	}
	public void setProfessinal(String professinal) {
		this.professinal = professinal;
	}
}
