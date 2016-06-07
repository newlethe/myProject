package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquSbaz entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquSbaz implements java.io.Serializable {

	// Fields

	private String uids;
	private String ckdId;
	private String sbId;
	private String sbKks;
	private Date azSj;
	private String szWz;
	private String memo;
	private String conid;
	private String bdgid;
	private String bdgno;
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public EquSbaz() {
	}

	/** minimal constructor */
	public EquSbaz(String uids, String ckdId, String sbId, String sbKks,
			Date azSj, String szWz) {
		this.uids = uids;
		this.ckdId = ckdId;
		this.sbId = sbId;
		this.sbKks = sbKks;
		this.azSj = azSj;
		this.szWz = szWz;
	}

	/** full constructor */
	public EquSbaz(String uids, String ckdId, String sbId, String sbKks,
			Date azSj, String szWz, String memo) {
		this.uids = uids;
		this.ckdId = ckdId;
		this.sbId = sbId;
		this.sbKks = sbKks;
		this.azSj = azSj;
		this.szWz = szWz;
		this.memo = memo;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCkdId() {
		return this.ckdId;
	}

	public void setCkdId(String ckdId) {
		this.ckdId = ckdId;
	}

	public String getSbId() {
		return this.sbId;
	}

	public void setSbId(String sbId) {
		this.sbId = sbId;
	}

	public String getSbKks() {
		return this.sbKks;
	}

	public void setSbKks(String sbKks) {
		this.sbKks = sbKks;
	}

	public Date getAzSj() {
		return this.azSj;
	}

	public void setAzSj(Date azSj) {
		this.azSj = azSj;
	}

	public String getSzWz() {
		return this.szWz;
	}

	public void setSzWz(String szWz) {
		this.szWz = szWz;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBdgid() {
		return bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

}