package com.sgepit.pcmis.zlgk.hbm;

import java.util.Date;

public class PcZlgkZlypReport  implements java.io.Serializable{
	
	private String uuid;
	private String recordUuid;
	private String unit;
	private String makeMan;
	private Date   makeDate;
	private String makeAction;
	private String pid;
	private String message;
	private String makeOrder;
	
	public PcZlgkZlypReport(){}
	
	public PcZlgkZlypReport(String uuid,String recordUuid,String unit,String makeMan,
			Date makeDate,String makeAction,String pid,String message,String makeOrder){
		  this.uuid = uuid;
		  this.recordUuid = recordUuid;
		  this.unit = unit;
		  this.makeMan = makeMan;
		  this.makeDate = makeDate;
		  this.makeAction = makeAction;
		  this.pid = pid;
		  this.message = message;
		  this.makeOrder = makeOrder;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getRecordUuid() {
		return recordUuid;
	}

	public void setRecordUuid(String recordUuid) {
		this.recordUuid = recordUuid;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getMakeMan() {
		return makeMan;
	}

	public void setMakeMan(String makeMan) {
		this.makeMan = makeMan;
	}

	public Date getMakeDate() {
		return makeDate;
	}

	public void setMakeDate(Date makeDate) {
		this.makeDate = makeDate;
	}

	public String getMakeAction() {
		return makeAction;
	}

	public void setMakeAction(String makeAction) {
		this.makeAction = makeAction;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getMakeOrder() {
		return makeOrder;
	}

	public void setMakeOrder(String makeOrder) {
		this.makeOrder = makeOrder;
	}
   
}
