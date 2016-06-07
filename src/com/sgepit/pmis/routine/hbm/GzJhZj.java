package com.sgepit.pmis.routine.hbm;

import java.util.Date;


/**
 * GzJhZjId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GzJhZj implements java.io.Serializable {

	// Fields

	private String dyzj;
	private String xyjh;
	private String uids;
	private String puids;
	private Long state1;
	private Long state2;
	// Constructors

	/** default constructor */
	public GzJhZj() {
	}

	/** minimal constructor */
	public GzJhZj(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public GzJhZj( String dyzj, String xyjh,Long state1,Long state2, String uids,String puids
			) {
		this.dyzj = dyzj;
		this.xyjh = xyjh;
		this.uids = uids;
		this.state1 = state1;
		this.state2 = state2;
		this.puids = puids;
	}

	// Property accessors


	public String getDyzj() {
		return this.dyzj;
	}

	public void setDyzj(String dyzj) {
		this.dyzj = dyzj;
	}

	public String getXyjh() {
		return this.xyjh;
	}

	public void setXyjh(String xyjh) {
		this.xyjh = xyjh;
	}

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPuids() {
		return puids;
	}

	public void setPuids(String puids) {
		this.puids = puids;
	}

	public Long getState1() {
		return state1;
	}

	public void setState1(Long state1) {
		this.state1 = state1;
	}

	public Long getState2() {
		return state2;
	}

	public void setState2(Long state2) {
		this.state2 = state2;
	}

	
}