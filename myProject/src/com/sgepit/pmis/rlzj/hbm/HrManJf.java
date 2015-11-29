package com.sgepit.pmis.rlzj.hbm;

/**
 * HrManJf entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManJf implements java.io.Serializable {

	// Fields

	private String seqnum;
	private String personnum;
	private Long nd;
	private Long ndjf;
	private Long sndcbjf;
	private Long bndcbjf;
	private String nzsh;

	// Constructors

	/** default constructor */
	public HrManJf() {
	}

	/** minimal constructor */
	public HrManJf(String seqnum, Long nd) {
		this.seqnum = seqnum;
		this.nd = nd;
	}

	/** full constructor */
	public HrManJf(String seqnum, String personnum, Long nd, Long ndjf,
			Long sndcbjf, Long bndcbjf, String nzsh) {
		this.seqnum = seqnum;
		this.personnum = personnum;
		this.nd = nd;
		this.ndjf = ndjf;
		this.sndcbjf = sndcbjf;
		this.bndcbjf = bndcbjf;
		this.nzsh = nzsh;
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

	public Long getNd() {
		return this.nd;
	}

	public void setNd(Long nd) {
		this.nd = nd;
	}

	public Long getNdjf() {
		return this.ndjf;
	}

	public void setNdjf(Long ndjf) {
		this.ndjf = ndjf;
	}

	public Long getSndcbjf() {
		return this.sndcbjf;
	}

	public void setSndcbjf(Long sndcbjf) {
		this.sndcbjf = sndcbjf;
	}

	public Long getBndcbjf() {
		return this.bndcbjf;
	}

	public void setBndcbjf(Long bndcbjf) {
		this.bndcbjf = bndcbjf;
	}

	public String getNzsh() {
		return this.nzsh;
	}

	public void setNzsh(String nzsh) {
		this.nzsh = nzsh;
	}

}