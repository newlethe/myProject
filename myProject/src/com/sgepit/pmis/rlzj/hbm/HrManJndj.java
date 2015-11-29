package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrManJndj entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManJndj implements java.io.Serializable {

	// Fields

	private String seqnum;
	private String personnum;
	private String gh;
	private String bm;
	private String name;
	private String gw;
	private Date qzsj;
	private String fzdw;
	private String jndj;
	private String jnzy;

	// Constructors

	/** default constructor */
	public HrManJndj() {
	}

	/** minimal constructor */
	public HrManJndj(String seqnum, String personnum, String gh) {
		this.seqnum = seqnum;
		this.personnum = personnum;
		this.gh = gh;
	}

	/** full constructor */
	public HrManJndj(String seqnum, String personnum, String gh, String bm, String name,
			String gw, Date qzsj, String fzdw, String jndj, String jnzy) {
		this.seqnum = seqnum;
		this.personnum = personnum;
		this.gh = gh;
		this.bm = bm;
		this.name = name;
		this.gw = gw;
		this.qzsj = qzsj;
		this.fzdw = fzdw;
		this.jndj = jndj;
		this.jnzy = jnzy;
	}

	// Property accessors

	public String getSeqnum() {
		return this.seqnum;
	}

	public void setSeqnum(String seqnum) {
		this.seqnum = seqnum;
	}

	public String getPersonnum() {
		return this.personnum;
	}

	public void setPersonnum(String personnum) {
		this.personnum = personnum;
	}

	public String getGh() {
		return this.gh;
	}

	public void setGh(String gh) {
		this.gh = gh;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGw() {
		return this.gw;
	}

	public void setGw(String gw) {
		this.gw = gw;
	}

	public Date getQzsj() {
		return this.qzsj;
	}

	public void setQzsj(Date qzsj) {
		this.qzsj = qzsj;
	}

	public String getFzdw() {
		return this.fzdw;
	}

	public void setFzdw(String fzdw) {
		this.fzdw = fzdw;
	}

	public String getJndj() {
		return this.jndj;
	}

	public void setJndj(String jndj) {
		this.jndj = jndj;
	}

	public String getJnzy() {
		return this.jnzy;
	}

	public void setJnzy(String jnzy) {
		this.jnzy = jnzy;
	}

}