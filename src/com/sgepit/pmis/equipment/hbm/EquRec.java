package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquRec entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquRec implements java.io.Serializable {

	// Fields

	private String recid;
	private String pid;
	private Date recdate;
	private String recunit;
	private String recman;
	private String remark;
	private Long billstate;
	private String recno;
	private String conid;
	private Date pleRecdate;

	// Constructors

	/** default constructor */
	public EquRec() {
	}

	/** minimal constructor */
	public EquRec(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public EquRec(String pid, Date recdate, String recunit, String recman,
			String remark, Long billstate, String recno, String conid,Date pleRecdate) {
		this.pid = pid;
		this.recdate = recdate;
		this.recunit = recunit;
		this.recman = recman;
		this.remark = remark;
		this.billstate = billstate;
		this.recno = recno;
		this.conid = conid;
		this.pleRecdate = pleRecdate;
	}

	// Property accessors

	public String getRecid() {
		return this.recid;
	}

	public void setRecid(String recid) {
		this.recid = recid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Date getRecdate() {
		return this.recdate;
	}

	public void setRecdate(Date recdate) {
		this.recdate = recdate;
	}

	public String getRecunit() {
		return this.recunit;
	}

	public void setRecunit(String recunit) {
		this.recunit = recunit;
	}

	public String getRecman() {
		return this.recman;
	}

	public void setRecman(String recman) {
		this.recman = recman;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public String getRecno() {
		return this.recno;
	}

	public void setRecno(String recno) {
		this.recno = recno;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Date getPleRecdate() {
		return pleRecdate;
	}

	public void setPleRecdate(Date pleRecdate) {
		this.pleRecdate = pleRecdate;
	}

}