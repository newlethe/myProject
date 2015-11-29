package com.sgepit.pmis.gczl.hbm;

/**
 * GczlJyxm entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GczlJyxm implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String xmbh;
	private String parentbh;
	private String isleaf;
	private String xmmc;
	private String sgdw;
	private Long jyjb;
	private String gjfb;
	private String jydwbz;
	private String jydwgd;
	private String zjkjy;
	private String jydwgs;
	private String jyjsdw;
	private String wd;
	private String hd;
	private String sd;
	private String ylwt;
	private String zljl;
	private String ypjg;
	private String cykh;
	private String wcf;
	private String zlkzd;
	private Long lvl;
	private String isEnshroud;
	private Long activeid;
	private String bzxmbh;
	//工程类别 11-01-10
	private String gcType;

	// Constructors

	public String getGcType() {
		return gcType;
	}

	public void setGcType(String gcType) {
		this.gcType = gcType;
	}

	/** default constructor */
	public GczlJyxm() {
	}

	/** minimal constructor */
	public GczlJyxm(String pid, String xmbh) {
		this.pid = pid;
		this.xmbh = xmbh;
	}

	/** full constructor */
	public GczlJyxm(String pid, String xmbh, String parentbh, String leaf,
			String xmmc, String sgdw, Long jyjb, String gjfb, String jydwbz,
			String jydwgd, String zjkjy, String jydwgs, String jyjsdw,
			String wd, String hd, String sd, String ylwt, String zljl,
			String ypjg, String cykh, String wcf, String zlkzd, Long lvl,
			String isEnshroud, Long activeid, String bzxmbh) {
		this.pid = pid;
		this.xmbh = xmbh;
		this.parentbh = parentbh;
		this.isleaf = leaf;
		this.xmmc = xmmc;
		this.sgdw = sgdw;
		this.jyjb = jyjb;
		this.gjfb = gjfb;
		this.jydwbz = jydwbz;
		this.jydwgd = jydwgd;
		this.zjkjy = zjkjy;
		this.jydwgs = jydwgs;
		this.jyjsdw = jyjsdw;
		this.wd = wd;
		this.hd = hd;
		this.sd = sd;
		this.ylwt = ylwt;
		this.zljl = zljl;
		this.ypjg = ypjg;
		this.cykh = cykh;
		this.wcf = wcf;
		this.zlkzd = zlkzd;
		this.lvl = lvl;
		this.isEnshroud = isEnshroud;
		this.activeid = activeid;
		this.bzxmbh = bzxmbh;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getXmbh() {
		return this.xmbh;
	}

	public void setXmbh(String xmbh) {
		this.xmbh = xmbh;
	}

	public String getParentbh() {
		return this.parentbh;
	}

	public void setParentbh(String parentbh) {
		this.parentbh = parentbh;
	}


	public String getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(String isleaf) {
		this.isleaf = isleaf;
	}

	public String getXmmc() {
		return this.xmmc;
	}

	public void setXmmc(String xmmc) {
		this.xmmc = xmmc;
	}

	public String getSgdw() {
		return this.sgdw;
	}

	public void setSgdw(String sgdw) {
		this.sgdw = sgdw;
	}

	public Long getJyjb() {
		return this.jyjb;
	}

	public void setJyjb(Long jyjb) {
		this.jyjb = jyjb;
	}

	public String getGjfb() {
		return this.gjfb;
	}

	public void setGjfb(String gjfb) {
		this.gjfb = gjfb;
	}

	public String getJydwbz() {
		return this.jydwbz;
	}

	public void setJydwbz(String jydwbz) {
		this.jydwbz = jydwbz;
	}

	public String getJydwgd() {
		return this.jydwgd;
	}

	public void setJydwgd(String jydwgd) {
		this.jydwgd = jydwgd;
	}

	public String getZjkjy() {
		return this.zjkjy;
	}

	public void setZjkjy(String zjkjy) {
		this.zjkjy = zjkjy;
	}

	public String getJydwgs() {
		return this.jydwgs;
	}

	public void setJydwgs(String jydwgs) {
		this.jydwgs = jydwgs;
	}

	public String getJyjsdw() {
		return this.jyjsdw;
	}

	public void setJyjsdw(String jyjsdw) {
		this.jyjsdw = jyjsdw;
	}

	public String getWd() {
		return this.wd;
	}

	public void setWd(String wd) {
		this.wd = wd;
	}

	public String getHd() {
		return this.hd;
	}

	public void setHd(String hd) {
		this.hd = hd;
	}

	public String getSd() {
		return this.sd;
	}

	public void setSd(String sd) {
		this.sd = sd;
	}

	public String getYlwt() {
		return this.ylwt;
	}

	public void setYlwt(String ylwt) {
		this.ylwt = ylwt;
	}

	public String getZljl() {
		return this.zljl;
	}

	public void setZljl(String zljl) {
		this.zljl = zljl;
	}

	public String getYpjg() {
		return this.ypjg;
	}

	public void setYpjg(String ypjg) {
		this.ypjg = ypjg;
	}

	public String getCykh() {
		return this.cykh;
	}

	public void setCykh(String cykh) {
		this.cykh = cykh;
	}

	public String getWcf() {
		return this.wcf;
	}

	public void setWcf(String wcf) {
		this.wcf = wcf;
	}

	public String getZlkzd() {
		return this.zlkzd;
	}

	public void setZlkzd(String zlkzd) {
		this.zlkzd = zlkzd;
	}

	public Long getLvl() {
		return this.lvl;
	}

	public void setLvl(Long lvl) {
		this.lvl = lvl;
	}

	public String getIsEnshroud() {
		return this.isEnshroud;
	}

	public void setIsEnshroud(String isEnshroud) {
		this.isEnshroud = isEnshroud;
	}

	public Long getActiveid() {
		return this.activeid;
	}

	public void setActiveid(Long activeid) {
		this.activeid = activeid;
	}

	public String getBzxmbh() {
		return this.bzxmbh;
	}

	public void setBzxmbh(String bzxmbh) {
		this.bzxmbh = bzxmbh;
	}

}