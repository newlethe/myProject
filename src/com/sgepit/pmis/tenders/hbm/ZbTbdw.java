package com.sgepit.pmis.tenders.hbm;

import java.util.Date;

/**
 * ZbTbdw generated by MyEclipse Persistence Tools
 */

public class ZbTbdw implements java.io.Serializable {

	// Fields

	private String cleid;

	private String clepid;

	private String cleno;

	private Date cledate;

	private String cleyorn;

	private Double clemoney;

	private String cledept;

	private Double cletomoney;

	// Constructors

	/** default constructor */
	public ZbTbdw() {
	}

	/** minimal constructor */
	public ZbTbdw(String cleid, String clepid, String cleno) {
		this.cleid = cleid;
		this.clepid = clepid;
		this.cleno = cleno;
	}

	/** full constructor */
	public ZbTbdw(String cleid, String clepid, String cleno, Date cledate,
			String cleyorn, Double clemoney, String cledept, Double cletomoney) {
		this.cleid = cleid;
		this.clepid = clepid;
		this.cleno = cleno;
		this.cledate = cledate;
		this.cleyorn = cleyorn;
		this.clemoney = clemoney;
		this.cledept = cledept;
		this.cletomoney = cletomoney;
	}

	// Property accessors

	public String getCleid() {
		return this.cleid;
	}

	public void setCleid(String cleid) {
		this.cleid = cleid;
	}

	public String getClepid() {
		return this.clepid;
	}

	public void setClepid(String clepid) {
		this.clepid = clepid;
	}

	public String getCleno() {
		return this.cleno;
	}

	public void setCleno(String cleno) {
		this.cleno = cleno;
	}

	public Date getCledate() {
		return this.cledate;
	}

	public void setCledate(Date cledate) {
		this.cledate = cledate;
	}

	public String getCleyorn() {
		return this.cleyorn;
	}

	public void setCleyorn(String cleyorn) {
		this.cleyorn = cleyorn;
	}

	public Double getClemoney() {
		return this.clemoney;
	}

	public void setClemoney(Double clemoney) {
		this.clemoney = clemoney;
	}

	public String getCledept() {
		return this.cledept;
	}

	public void setCledept(String cledept) {
		this.cledept = cledept;
	}

	public Double getCletomoney() {
		return this.cletomoney;
	}

	public void setCletomoney(Double cletomoney) {
		this.cletomoney = cletomoney;
	}

}