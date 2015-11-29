package com.sgepit.pmis.document.hbm;



import java.util.Date;

/**
 * DaZlJy entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class DaZlJy implements java.io.Serializable {

	// Fields

	private String uids;
	private String infoid;
	private String jyr;
	private String deptid;
	private Date jysj;
	private Date ghsj;
	private String xjsj;
	private Long xjcs;
	private String memo;
	private String memo1;
	private String memo2;
	private Long fs;
	private String dh;
	private String mc;

	// Constructors

	/** default constructor */
	public DaZlJy() {
	}

	/** minimal constructor */
	public DaZlJy(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public DaZlJy(String uids, String infoid, String jyr, String deptid,
			Date jysj, Date ghsj, String xjsj, Long xjcs, String memo,
			String memo1, String memo2, Long fs,String dh,String mc) {
		this.uids = uids;
		this.infoid = infoid;
		this.jyr = jyr;
		this.deptid = deptid;
		this.jysj = jysj;
		this.ghsj = ghsj;
		this.xjsj = xjsj;
		this.xjcs = xjcs;
		this.memo = memo;
		this.memo1 = memo1;
		this.memo2 = memo2;
		this.fs = fs;
		this.dh = dh;
		this.mc = mc;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getInfoid() {
		return this.infoid;
	}

	public void setInfoid(String infoid) {
		this.infoid = infoid;
	}

	public String getJyr() {
		return this.jyr;
	}

	public void setJyr(String jyr) {
		this.jyr = jyr;
	}

	public String getDeptid() {
		return this.deptid;
	}

	public void setDeptid(String deptid) {
		this.deptid = deptid;
	}

	public Date getJysj() {
		return this.jysj;
	}

	public void setJysj(Date jysj) {
		this.jysj = jysj;
	}

	public Date getGhsj() {
		return this.ghsj;
	}

	public void setGhsj(Date ghsj) {
		this.ghsj = ghsj;
	}

	public String getXjsj() {
		return this.xjsj;
	}

	public void setXjsj(String xjsj) {
		this.xjsj = xjsj;
	}

	public Long getXjcs() {
		return this.xjcs;
	}

	public void setXjcs(Long xjcs) {
		this.xjcs = xjcs;
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

	public Long getFs() {
		return this.fs;
	}

	public void setFs(Long fs) {
		this.fs = fs;
	}

	public String getDh() {
		return dh;
	}

	public void setDh(String dh) {
		this.dh = dh;
	}

	public String getMc() {
		return mc;
	}

	public void setMc(String mc) {
		this.mc = mc;
	}

}