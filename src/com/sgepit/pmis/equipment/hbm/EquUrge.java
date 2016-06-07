package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquUrge entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquUrge implements java.io.Serializable {

	// Fields

	private String urgeid;
	private String sbId;
	private String pid;
	private Date yjdhrq;
	private Date sjdhrq;
	private String ycjhyy;
	private String fzr;
	private String bak1;
	private String bak2;
	private String bak3;

	// Constructors

	/** default constructor */
	public EquUrge() {
	}

	/** minimal constructor */
	public EquUrge(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public EquUrge(String sbId, String pid, Date yjdhrq, Date sjdhrq,
			String ycjhyy, String fzr, String bak1, String bak2, String bak3) {
		this.sbId = sbId;
		this.pid = pid;
		this.yjdhrq = yjdhrq;
		this.sjdhrq = sjdhrq;
		this.ycjhyy = ycjhyy;
		this.fzr = fzr;
		this.bak1 = bak1;
		this.bak2 = bak2;
		this.bak3 = bak3;
	}

	// Property accessors

	public String getUrgeid() {
		return this.urgeid;
	}

	public void setUrgeid(String urgeid) {
		this.urgeid = urgeid;
	}

	public String getSbId() {
		return sbId;
	}

	public void setSbId(String sbId) {
		this.sbId = sbId;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Date getYjdhrq() {
		return this.yjdhrq;
	}

	public void setYjdhrq(Date yjdhrq) {
		this.yjdhrq = yjdhrq;
	}

	public Date getSjdhrq() {
		return this.sjdhrq;
	}

	public void setSjdhrq(Date sjdhrq) {
		this.sjdhrq = sjdhrq;
	}

	public String getYcjhyy() {
		return this.ycjhyy;
	}

	public void setYcjhyy(String ycjhyy) {
		this.ycjhyy = ycjhyy;
	}

	public String getFzr() {
		return this.fzr;
	}

	public void setFzr(String fzr) {
		this.fzr = fzr;
	}

	public String getBak1() {
		return this.bak1;
	}

	public void setBak1(String bak1) {
		this.bak1 = bak1;
	}

	public String getBak2() {
		return this.bak2;
	}

	public void setBak2(String bak2) {
		this.bak2 = bak2;
	}

	public String getBak3() {
		return this.bak3;
	}

	public void setBak3(String bak3) {
		this.bak3 = bak3;
	}

}