package com.sgepit.pmis.wzgl.hbm;

/**
 * WztzCgjhView entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WztzView implements java.io.Serializable {

	// Fields
	private String uids;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Double jhdj;
	private Double sl;
	private Double jcje;
	private String kw;
	private String bz;
	private String pid;
	private Double sqsl;
	private Double cgsl;
	private Double rksl;
	private Double cksl;
	private String kgry;
	
	// Constructors

	/** default constructor */
	public WztzView() {
	}

	/** minimal constructor */
	public WztzView(String uids) {
		this.uids = uids;
	}
	
	/** full constructor */
	public WztzView(String uids, String bm, String pm, String gg, String dw,
			Double jhdj, Double sl, Double jcje, String kw, String bz,
			String pid, Double sqsl, Double cgsl, Double rksl, Double cksl,
			String kgry) {
		super();
		this.uids = uids;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.jhdj = jhdj;
		this.sl = sl;
		this.jcje = jcje;
		this.kw = kw;
		this.bz = bz;
		this.pid = pid;
		this.sqsl = sqsl;
		this.cgsl = cgsl;
		this.rksl = rksl;
		this.cksl = cksl;
		this.kgry = kgry;
	}

	// Property accessors
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getBm() {
		return bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getPm() {
		return pm;
	}

	public void setPm(String pm) {
		this.pm = pm;
	}

	public String getGg() {
		return gg;
	}

	public void setGg(String gg) {
		this.gg = gg;
	}

	public String getDw() {
		return dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getJhdj() {
		return jhdj;
	}

	public void setJhdj(Double jhdj) {
		this.jhdj = jhdj;
	}

	public Double getSl() {
		return sl;
	}

	public void setSl(Double sl) {
		this.sl = sl;
	}

	public Double getJcje() {
		return jcje;
	}

	public void setJcje(Double jcje) {
		this.jcje = jcje;
	}

	public String getKw() {
		return kw;
	}

	public void setKw(String kw) {
		this.kw = kw;
	}

	public String getBz() {
		return bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Double getSqsl() {
		return sqsl;
	}

	public void setSqsl(Double sqsl) {
		this.sqsl = sqsl;
	}

	public Double getCgsl() {
		return cgsl;
	}

	public void setCgsl(Double cgsl) {
		this.cgsl = cgsl;
	}

	public Double getRksl() {
		return rksl;
	}

	public void setRksl(Double rksl) {
		this.rksl = rksl;
	}

	public Double getCksl() {
		return cksl;
	}

	public void setCksl(Double cksl) {
		this.cksl = cksl;
	}

	public String getKgry() {
		return kgry;
	}

	public void setKgry(String kgry) {
		this.kgry = kgry;
	}

}