package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquRecSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquRecSub implements java.io.Serializable {

	// Fields

	private String recsubid;
	private String recid;
	private String equid;
	private String partid;
	private Double pleRecnum;
	private Double recnum;
	private String machineNo;
	private Date recdate;
	private String remark;
	private Date pleRecdate;
	private String conid;
	private String wztype;
	private String ggxh;
	private String box_no;
	private String part_no;
	private String dw;
	private String sccj;
	private String sbmc;
	private Double kcsl;
	
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public EquRecSub() {
	}

	/** full constructor */
	public EquRecSub(String recid, String equid, String partid, Double pleRecnum, 
			Double recnum, String machineNo, Date recdate, String remark,Date pleRecdate) {
		this.recid = recid;
		this.equid = equid;
		this.partid = partid;
		this.pleRecnum = pleRecnum;
		this.recnum = recnum;
		this.machineNo = machineNo;
		this.recdate = recdate;
		this.remark = remark;
		this.pleRecdate = pleRecdate;
	}

	// Property accessors

	public String getRecsubid() {
		return this.recsubid;
	}

	public void setRecsubid(String recsubid) {
		this.recsubid = recsubid;
	}

	public String getRecid() {
		return this.recid;
	}

	public void setRecid(String recid) {
		this.recid = recid;
	}

	public String getPartid() {
		return this.partid;
	}

	public void setPartid(String partid) {
		this.partid = partid;
	}

	public Double getPleRecnum() {
		return this.pleRecnum;
	}

	public void setPleRecnum(Double pleRecnum) {
		this.pleRecnum = pleRecnum;
	}

	public Double getRecnum() {
		return this.recnum;
	}

	public void setRecnum(Double recnum) {
		this.recnum = recnum;
	}

	public String getMachineNo() {
		return this.machineNo;
	}

	public void setMachineNo(String machineNo) {
		this.machineNo = machineNo;
	}

	public Date getRecdate() {
		return this.recdate;
	}

	public void setRecdate(Date recdate) {
		this.recdate = recdate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getEquid() {
		return equid;
	}

	public void setEquid(String equid) {
		this.equid = equid;
	}

	public Date getPleRecdate() {
		return pleRecdate;
	}

	public void setPleRecdate(Date pleRecdate) {
		this.pleRecdate = pleRecdate;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getWztype() {
		return wztype;
	}

	public void setWztype(String wztype) {
		this.wztype = wztype;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getBox_no() {
		return box_no;
	}

	public void setBox_no(String box_no) {
		this.box_no = box_no;
	}

	public String getPart_no() {
		return part_no;
	}

	public void setPart_no(String part_no) {
		this.part_no = part_no;
	}

	public String getDw() {
		return dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public String getSccj() {
		return sccj;
	}

	public void setSccj(String sccj) {
		this.sccj = sccj;
	}

	public String getSbmc() {
		return sbmc;
	}

	public void setSbmc(String sbmc) {
		this.sbmc = sbmc;
	}

	public Double getKcsl() {
		return kcsl;
	}

	public void setKcsl(Double kcsl) {
		this.kcsl = kcsl;
	}
}