package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备开箱检验单打印
 */
import java.util.Date;

public class EquGoodsOpenboxView implements java.io.Serializable{
	private String uids;
	private String conNo;
	private String conName;
	private String openPlace;
	private Date openDate;
	private String sysName;
	private String partyB;
	public EquGoodsOpenboxView() {
		super();
	}
	public EquGoodsOpenboxView(String uids, String conNo, String conName,
			String openPlace, Date openDate, String sysName, String partyB) {
		super();
		this.uids = uids;
		this.conNo = conNo;
		this.conName = conName;
		this.openPlace = openPlace;
		this.openDate = openDate;
		this.sysName = sysName;
		this.partyB = partyB;
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
}
