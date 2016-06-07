package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备到货单打印
 *
 */
import java.util.Date;

public class EquGoodsArrivalVGj implements java.io.Serializable{
	private String uids;
	private String flowId;
	//private String joinUnit;
	private Date dh_date;
	private Date dem_dh_date;
	private Date pla_dh_date;
	private String dhDesc;
	private String csno;
	private String sendNum;
	private String conNo;
	private String conName;
	private String dhNo;
	private String joinPlace;
	private String receiveUser;
	private String carNo;
	
	public EquGoodsArrivalVGj(String uids, String flowId,
			Date dh_date, Date dem_dh_date, Date pla_dh_date, String dhDesc,
			String csno, String sendNum, String conNo, String conName,
			String dhNo, String joinPlace) {
		super();
		this.uids = uids;
		this.flowId = flowId;
		//this.joinUnit = joinUnit;
		this.dh_date = dh_date;
		this.dem_dh_date = dem_dh_date;
		this.pla_dh_date = pla_dh_date;
		this.dhDesc = dhDesc;
		this.csno = csno;
		this.sendNum = sendNum;
		this.conNo = conNo;
		this.conName = conName;
		this.dhNo = dhNo;
		this.joinPlace = joinPlace;
	}


	public EquGoodsArrivalVGj(String uids, String flowId, Date dh_date,
			Date dem_dh_date, Date pla_dh_date, String dhDesc, String csno,
			String sendNum, String conNo, String conName, String dhNo,
			String joinPlace, String receiveUser, String carNo) {
		super();
		this.uids = uids;
		this.flowId = flowId;
		this.dh_date = dh_date;
		this.dem_dh_date = dem_dh_date;
		this.pla_dh_date = pla_dh_date;
		this.dhDesc = dhDesc;
		this.csno = csno;
		this.sendNum = sendNum;
		this.conNo = conNo;
		this.conName = conName;
		this.dhNo = dhNo;
		this.joinPlace = joinPlace;
		this.receiveUser = receiveUser;
		this.carNo = carNo;
	}


	public EquGoodsArrivalVGj() {
		super();
	}
	//full constructor
	
	
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getFlowId() {
		return flowId;
	}
	public void setFlowId(String flowId) {
		this.flowId = flowId;
	}
//	public String getJoinUnit() {
//		return joinUnit;
//	}
//	public void setJoinUnit(String joinUnit) {
//		this.joinUnit = joinUnit;
//	}
	
	public Date getDh_date() {
		return dh_date;
	}
	public void setDh_date(Date dh_date) {
		this.dh_date = dh_date;
	}
	public Date getDem_dh_date() {
		return dem_dh_date;
	}
	public void setDem_dh_date(Date dem_dh_date) {
		this.dem_dh_date = dem_dh_date;
	}
	public Date getPla_dh_date() {
		return pla_dh_date;
	}
	public void setPla_dh_date(Date pla_dh_date) {
		this.pla_dh_date = pla_dh_date;
	}
	public String getDhDesc() {
		return dhDesc;
	}
	public void setDhDesc(String dhDesc) {
		this.dhDesc = dhDesc;
	}
	public String getCsno() {
		return csno;
	}
	public void setCsno(String csno) {
		this.csno = csno;
	}
	public String getSendNum() {
		return sendNum;
	}
	public void setSendNum(String sendNum) {
		this.sendNum = sendNum;
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
	public String getDhNo() {
		return dhNo;
	}
	public void setDhNo(String dhNo) {
		this.dhNo = dhNo;
	}
	public String getJoinPlace() {
		return joinPlace;
	}
	public void setJoinPlace(String joinPlace) {
		this.joinPlace = joinPlace;
	}


	public String getReceiveUser() {
		return receiveUser;
	}


	public void setReceiveUser(String receiveUser) {
		this.receiveUser = receiveUser;
	}


	public String getCarNo() {
		return carNo;
	}


	public void setCarNo(String carNo) {
		this.carNo = carNo;
	}
}
