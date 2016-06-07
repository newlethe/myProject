package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrManArt entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManArt implements java.io.Serializable {

	// Fields

	private String seqnum;
	private String personnum;
	private String zyjszg;
	private String zyjszglb;
	private Date pdsj;
	private String fzjg;
	private String fzwh;
	private Date fzsj;
	private String sfpr;
	private String prdw;
	private Date prsj;
	private String prwh;

	// Constructors

	/** default constructor */
	public HrManArt() {
	}

	/** minimal constructor */
	public HrManArt(String seqnum, String zyjszg) {
		this.seqnum = seqnum;
		this.zyjszg = zyjszg;
	}

	/** full constructor */
	public HrManArt(String seqnum, String personnum, String zyjszg,
			String zyjszglb, Date pdsj, String fzjg, String fzwh, Date fzsj,
			String sfpr, String prdw, Date prsj, String prwh) {
		this.seqnum = seqnum;
		this.personnum = personnum;
		this.zyjszg = zyjszg;
		this.zyjszglb = zyjszglb;
		this.pdsj = pdsj;
		this.fzjg = fzjg;
		this.fzwh = fzwh;
		this.fzsj = fzsj;
		this.sfpr = sfpr;
		this.prdw = prdw;
		this.prsj = prsj;
		this.prwh = prwh;
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

	public String getZyjszg() {
		return this.zyjszg;
	}

	public void setZyjszg(String zyjszg) {
		this.zyjszg = zyjszg;
	}

	public String getZyjszglb() {
		return this.zyjszglb;
	}

	public void setZyjszglb(String zyjszglb) {
		this.zyjszglb = zyjszglb;
	}

	public Date getPdsj() {
		return this.pdsj;
	}

	public void setPdsj(Date pdsj) {
		this.pdsj = pdsj;
	}

	public String getFzjg() {
		return this.fzjg;
	}

	public void setFzjg(String fzjg) {
		this.fzjg = fzjg;
	}

	public String getFzwh() {
		return this.fzwh;
	}

	public void setFzwh(String fzwh) {
		this.fzwh = fzwh;
	}

	public Date getFzsj() {
		return this.fzsj;
	}

	public void setFzsj(Date fzsj) {
		this.fzsj = fzsj;
	}

	public String getSfpr() {
		return this.sfpr;
	}

	public void setSfpr(String sfpr) {
		this.sfpr = sfpr;
	}

	public String getPrdw() {
		return this.prdw;
	}

	public void setPrdw(String prdw) {
		this.prdw = prdw;
	}

	public Date getPrsj() {
		return this.prsj;
	}

	public void setPrsj(Date prsj) {
		this.prsj = prsj;
	}

	public String getPrwh() {
		return this.prwh;
	}

	public void setPrwh(String prwh) {
		this.prwh = prwh;
	}

}