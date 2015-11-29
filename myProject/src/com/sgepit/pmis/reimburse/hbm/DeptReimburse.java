package com.sgepit.pmis.reimburse.hbm;

import java.util.Date;

/**
 * DeptReimburse entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class DeptReimburse implements java.io.Serializable {

	// Fields

	private String uids;
	private String title;
	private String reStyle;
	private Date reDate;
	private Double reZje;
	private Double jhje;
	private String jhuid;
	private String billState;
	private String djState;
	private String jhcontent;
	private String memo;
	private String memo1;
	private String memo2;
	private String reUser;
	private String reDept;
	private Double relj;
	private String pid;
	
	// Constructors

	public DeptReimburse(String uids, String title, String reStyle,
			Date reDate, Double reZje, Double jhje, String jhuid, String billState,
			String djState, String jhcontent, String memo, String memo1,
			String memo2, String reUser, String reDept, Double relj) {
		super();
		this.uids = uids;
		this.title = title;
		this.reStyle = reStyle;
		this.reDate = reDate;
		this.reZje = reZje;
		this.jhje = jhje;
		this.jhuid = jhuid;
		this.billState = billState;
		this.djState = djState;
		this.jhcontent = jhcontent;
		this.memo = memo;
		this.memo1 = memo1;
		this.memo2 = memo2;
		this.reUser = reUser;
		this.reDept = reDept;
		this.relj = relj;
	}

	/** default constructor */
	public DeptReimburse() {
	}

	/** full constructor */

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getReStyle() {
		return this.reStyle;
	}

	public void setReStyle(String reStyle) {
		this.reStyle = reStyle;
	}

	public Date getReDate() {
		return this.reDate;
	}

	public void setReDate(Date reDate) {
		this.reDate = reDate;
	}

	public Double getReZje() {
		return this.reZje;
	}

	public void setReZje(Double reZje) {
		this.reZje = reZje;
	}


	public String getJhuid() {
		return this.jhuid;
	}

	public void setJhuid(String jhuid) {
		this.jhuid = jhuid;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getDjState() {
		return this.djState;
	}

	public void setDjState(String djState) {
		this.djState = djState;
	}

	public String getJhcontent() {
		return this.jhcontent;
	}

	public void setJhcontent(String jhcontent) {
		this.jhcontent = jhcontent;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getMemo1() {
		return this.memo1;
	}

	public void setMemo1(String memo1) {
		this.memo1 = memo1;
	}

	public String getMemo2() {
		return this.memo2;
	}

	public void setMemo2(String memo2) {
		this.memo2 = memo2;
	}

	public Double getJhje() {
		return jhje;
	}

	public void setJhje(Double jhje) {
		this.jhje = jhje;
	}

	public String getReUser() {
		return reUser;
	}

	public void setReUser(String reUser) {
		this.reUser = reUser;
	}

	public String getReDept() {
		return reDept;
	}

	public void setReDept(String reDept) {
		this.reDept = reDept;
	}

	public Double getRelj() {
		return relj;
	}

	public void setRelj(Double relj) {
		this.relj = relj;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}