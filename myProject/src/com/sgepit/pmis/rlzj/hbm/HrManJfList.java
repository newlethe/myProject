package com.sgepit.pmis.rlzj.hbm;

/**
 * HrManJfList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManJfList implements java.io.Serializable {

	// Fields

	private String seqnum;
	private String mainnum;
	private String lb;
	private String jfxm;
	private String jfjs;
	private Long jfz;
	private Long jflj;
	private String djr;
	private String bz;

	// Constructors

	/** default constructor */
	public HrManJfList() {
	}

	/** minimal constructor */
	public HrManJfList(String seqnum, String mainnum, String lb) {
		this.seqnum = seqnum;
		this.mainnum = mainnum;
		this.lb = lb;
	}

	/** full constructor */
	public HrManJfList(String seqnum, String mainnum, String lb, String jfxm,
			String jfjs, Long jfz, Long jflj, String djr, String bz) {
		this.seqnum = seqnum;
		this.mainnum = mainnum;
		this.lb = lb;
		this.jfxm = jfxm;
		this.jfjs = jfjs;
		this.jfz = jfz;
		this.jflj = jflj;
		this.djr = djr;
		this.bz = bz;
	}

	// Property accessors

	public String getSeqnum() {
		return this.seqnum;
	}

	public void setSeqnum(String seqnum) {
		this.seqnum = seqnum;
	}

	public String getMainnum() {
		return this.mainnum;
	}

	public void setMainnum(String mainnum) {
		this.mainnum = mainnum;
	}

	public String getLb() {
		return this.lb;
	}

	public void setLb(String lb) {
		this.lb = lb;
	}

	public String getJfxm() {
		return this.jfxm;
	}

	public void setJfxm(String jfxm) {
		this.jfxm = jfxm;
	}

	public String getJfjs() {
		return this.jfjs;
	}

	public void setJfjs(String jfjs) {
		this.jfjs = jfjs;
	}

	public Long getJfz() {
		return this.jfz;
	}

	public void setJfz(Long jfz) {
		this.jfz = jfz;
	}

	public Long getJflj() {
		return this.jflj;
	}

	public void setJflj(Long jflj) {
		this.jflj = jflj;
	}

	public String getDjr() {
		return this.djr;
	}

	public void setDjr(String djr) {
		this.djr = djr;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

}