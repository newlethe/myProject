package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzCjspb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzCjspb implements java.io.Serializable {

	// Fields

	private String uids;
	private String bh;
	private String pid;
	private String hth;
	private String fybh;
	private String cwbm;
	private Date sqrq;
	private String jhlb;
	private String bmmc;
	private String sqr;
	private String spr;
	private String billState;
	private Date pzrq;
	private String phbh;
	private String xz;
	private String userid;
	private String wonum;
	private String wzlb;
	private String xmbm;
	private String cjyy;
	private String cjmm;
	private String stage;
	private String bgdid;

	// Constructors

	/** default constructor */
	public WzCjspb() {
	}

	/** minimal constructor */
	public WzCjspb(String bh) {
		this.bh = bh;
	}

	/** full constructor */
	public WzCjspb(String bh, String pid, String hth, String fybh, String cwbm,
			Date sqrq, String jhlb, String bmmc, String sqr, String spr,
			String billState, Date pzrq, String phbh, String xz, String userid,
			String wonum, String wzlb, String xmbm, String cjyy, String cjmm,
			String stage, String bgdid) {
		this.bh = bh;
		this.pid = pid;
		this.hth = hth;
		this.fybh = fybh;
		this.cwbm = cwbm;
		this.sqrq = sqrq;
		this.jhlb = jhlb;
		this.bmmc = bmmc;
		this.sqr = sqr;
		this.spr = spr;
		this.billState = billState;
		this.pzrq = pzrq;
		this.phbh = phbh;
		this.xz = xz;
		this.userid = userid;
		this.wonum = wonum;
		this.wzlb = wzlb;
		this.xmbm = xmbm;
		this.cjyy = cjyy;
		this.cjmm = cjmm;
		this.stage = stage;
		this.bgdid = bgdid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getHth() {
		return this.hth;
	}

	public void setHth(String hth) {
		this.hth = hth;
	}

	public String getFybh() {
		return this.fybh;
	}

	public void setFybh(String fybh) {
		this.fybh = fybh;
	}

	public String getCwbm() {
		return this.cwbm;
	}

	public void setCwbm(String cwbm) {
		this.cwbm = cwbm;
	}

	public Date getSqrq() {
		return this.sqrq;
	}

	public void setSqrq(Date sqrq) {
		this.sqrq = sqrq;
	}

	public String getJhlb() {
		return this.jhlb;
	}

	public void setJhlb(String jhlb) {
		this.jhlb = jhlb;
	}

	public String getBmmc() {
		return this.bmmc;
	}

	public void setBmmc(String bmmc) {
		this.bmmc = bmmc;
	}

	public String getSqr() {
		return this.sqr;
	}

	public void setSqr(String sqr) {
		this.sqr = sqr;
	}

	public String getSpr() {
		return this.spr;
	}

	public void setSpr(String spr) {
		this.spr = spr;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public Date getPzrq() {
		return this.pzrq;
	}

	public void setPzrq(Date pzrq) {
		this.pzrq = pzrq;
	}

	public String getPhbh() {
		return this.phbh;
	}

	public void setPhbh(String phbh) {
		this.phbh = phbh;
	}

	public String getXz() {
		return this.xz;
	}

	public void setXz(String xz) {
		this.xz = xz;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getWonum() {
		return this.wonum;
	}

	public void setWonum(String wonum) {
		this.wonum = wonum;
	}

	public String getWzlb() {
		return this.wzlb;
	}

	public void setWzlb(String wzlb) {
		this.wzlb = wzlb;
	}

	public String getXmbm() {
		return this.xmbm;
	}

	public void setXmbm(String xmbm) {
		this.xmbm = xmbm;
	}

	public String getCjyy() {
		return this.cjyy;
	}

	public void setCjyy(String cjyy) {
		this.cjyy = cjyy;
	}

	public String getCjmm() {
		return this.cjmm;
	}

	public void setCjmm(String cjmm) {
		this.cjmm = cjmm;
	}

	public String getStage() {
		return this.stage;
	}

	public void setStage(String stage) {
		this.stage = stage;
	}

	public String getBgdid() {
		return this.bgdid;
	}

	public void setBgdid(String bgdid) {
		this.bgdid = bgdid;
	}

}