package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备开箱通知单打印
 */
import java.util.Date;

public class EquGoodsOpenNoticeVGj implements java.io.Serializable{
	private String uids;
	private String partyB;
	private String conNo;
	private String conName;
	private String remark;
	private String equName;
	private String arriveDateDay;
	private String arriveDateMon;
	private String arriveDateYear;
	private String openDateDay;
	private String openDateMon;
	private String openDateYear;
	private String openPlace;
	private String noticeNo;
	
	public EquGoodsOpenNoticeVGj() {
		super();
	}

	public EquGoodsOpenNoticeVGj(String uids, String partyB, String conNo,
			String conName, String remark, String equName,
			String arriveDateDay, String arriveDateMon, String arriveDateYear,
			String openDateDay, String openDateMon, String openDateYear,
			String openPlace) {
		super();
		this.uids = uids;
		this.partyB = partyB;
		this.conNo = conNo;
		this.conName = conName;
		this.remark = remark;
		this.equName = equName;
		this.arriveDateDay = arriveDateDay;
		this.arriveDateMon = arriveDateMon;
		this.arriveDateYear = arriveDateYear;
		this.openDateDay = openDateDay;
		this.openDateMon = openDateMon;
		this.openDateYear = openDateYear;
		this.openPlace = openPlace;
	}

	public EquGoodsOpenNoticeVGj(String uids, String partyB, String conNo,
			String conName, String remark, String equName,
			String arriveDateDay, String arriveDateMon, String arriveDateYear,
			String openDateDay, String openDateMon, String openDateYear,
			String openPlace, String noticeNo) {
		super();
		this.uids = uids;
		this.partyB = partyB;
		this.conNo = conNo;
		this.conName = conName;
		this.remark = remark;
		this.equName = equName;
		this.arriveDateDay = arriveDateDay;
		this.arriveDateMon = arriveDateMon;
		this.arriveDateYear = arriveDateYear;
		this.openDateDay = openDateDay;
		this.openDateMon = openDateMon;
		this.openDateYear = openDateYear;
		this.openPlace = openPlace;
		this.noticeNo = noticeNo;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPartyB() {
		return partyB;
	}

	public void setPartyB(String partyB) {
		this.partyB = partyB;
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

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getEquName() {
		return equName;
	}

	public void setEquName(String equName) {
		this.equName = equName;
	}
	public String getArriveDateDay() {
		return arriveDateDay;
	}

	public void setArriveDateDay(String arriveDateDay) {
		this.arriveDateDay = arriveDateDay;
	}

	public String getArriveDateMon() {
		return arriveDateMon;
	}

	public void setArriveDateMon(String arriveDateMon) {
		this.arriveDateMon = arriveDateMon;
	}

	public String getArriveDateYear() {
		return arriveDateYear;
	}

	public void setArriveDateYear(String arriveDateYear) {
		this.arriveDateYear = arriveDateYear;
	}

	public String getOpenDateDay() {
		return openDateDay;
	}

	public void setOpenDateDay(String openDateDay) {
		this.openDateDay = openDateDay;
	}

	public String getOpenDateMon() {
		return openDateMon;
	}

	public void setOpenDateMon(String openDateMon) {
		this.openDateMon = openDateMon;
	}

	public String getOpenDateYear() {
		return openDateYear;
	}

	public void setOpenDateYear(String openDateYear) {
		this.openDateYear = openDateYear;
	}

	public String getOpenPlace() {
		return openPlace;
	}

	public void setOpenPlace(String openPlace) {
		this.openPlace = openPlace;
	}

	public String getNoticeNo() {
		return noticeNo;
	}

	public void setNoticeNo(String noticeNo) {
		this.noticeNo = noticeNo;
	}
	
}
