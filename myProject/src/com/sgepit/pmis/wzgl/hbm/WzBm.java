package com.sgepit.pmis.wzgl.hbm;

/**
 * WzBm entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzBm implements java.io.Serializable {

	// Fields

	private String uids;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Double jhdj;
	private String byyq;
	private String flbm;
	private String wzType;
	private String wzProperty;
	private String abc;
	private Double priceAvg;
	private Double priceLast;
	private String epm;
	private String bmState;
	private String bz;
	private Double ge;
	private Double de;
	private Double sl;
	private String ckh;
	private String hwh;
	private String th;
	private Double rate;
	private String hsdw;
	private String scd;
	private String stage;
	private String cz;
	private String yy;
	private Double yysl;
	
	private String pid;

	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public WzBm() {
	}

	/** minimal constructor */
	public WzBm(String bm) {
		this.bm = bm;
	}

	/** full constructor */
	public WzBm(String bm, String pm, String gg, String dw, Double jhdj,
			String byyq, String flbm, String wzType, String wzProperty,
			String abc, Double priceAvg, Double priceLast, String epm,
			String bmState, String bz, Double ge, Double de, Double sl,
			String ckh, String hwh, String th, Double rate, String hsdw,
			String scd, String stage, String cz, String yy, Double yysl) {
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.dw = dw;
		this.jhdj = jhdj;
		this.byyq = byyq;
		this.flbm = flbm;
		this.wzType = wzType;
		this.wzProperty = wzProperty;
		this.abc = abc;
		this.priceAvg = priceAvg;
		this.priceLast = priceLast;
		this.epm = epm;
		this.bmState = bmState;
		this.bz = bz;
		this.ge = ge;
		this.de = de;
		this.sl = sl;
		this.ckh = ckh;
		this.hwh = hwh;
		this.th = th;
		this.rate = rate;
		this.hsdw = hsdw;
		this.scd = scd;
		this.stage = stage;
		this.cz = cz;
		this.yy = yy;
		this.yysl = yysl;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getBm() {
		return this.bm;
	}

	public void setBm(String bm) {
		this.bm = bm;
	}

	public String getPm() {
		return this.pm;
	}

	public void setPm(String pm) {
		this.pm = pm;
	}

	public String getGg() {
		return this.gg;
	}

	public void setGg(String gg) {
		this.gg = gg;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getJhdj() {
		return this.jhdj;
	}

	public void setJhdj(Double jhdj) {
		this.jhdj = jhdj;
	}

	public String getByyq() {
		return this.byyq;
	}

	public void setByyq(String byyq) {
		this.byyq = byyq;
	}

	public String getFlbm() {
		return this.flbm;
	}

	public void setFlbm(String flbm) {
		this.flbm = flbm;
	}

	public String getWzType() {
		return this.wzType;
	}

	public void setWzType(String wzType) {
		this.wzType = wzType;
	}

	public String getWzProperty() {
		return this.wzProperty;
	}

	public void setWzProperty(String wzProperty) {
		this.wzProperty = wzProperty;
	}

	public String getAbc() {
		return this.abc;
	}

	public void setAbc(String abc) {
		this.abc = abc;
	}

	public Double getPriceAvg() {
		return this.priceAvg;
	}

	public void setPriceAvg(Double priceAvg) {
		this.priceAvg = priceAvg;
	}

	public Double getPriceLast() {
		return this.priceLast;
	}

	public void setPriceLast(Double priceLast) {
		this.priceLast = priceLast;
	}

	public String getEpm() {
		return this.epm;
	}

	public void setEpm(String epm) {
		this.epm = epm;
	}

	public String getBmState() {
		return this.bmState;
	}

	public void setBmState(String bmState) {
		this.bmState = bmState;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public Double getGe() {
		return this.ge;
	}

	public void setGe(Double ge) {
		this.ge = ge;
	}

	public Double getDe() {
		return this.de;
	}

	public void setDe(Double de) {
		this.de = de;
	}

	public Double getSl() {
		return this.sl;
	}

	public void setSl(Double sl) {
		this.sl = sl;
	}

	public String getCkh() {
		return this.ckh;
	}

	public void setCkh(String ckh) {
		this.ckh = ckh;
	}

	public String getHwh() {
		return this.hwh;
	}

	public void setHwh(String hwh) {
		this.hwh = hwh;
	}

	public String getTh() {
		return this.th;
	}

	public void setTh(String th) {
		this.th = th;
	}

	public Double getRate() {
		return this.rate;
	}

	public void setRate(Double rate) {
		this.rate = rate;
	}

	public String getHsdw() {
		return this.hsdw;
	}

	public void setHsdw(String hsdw) {
		this.hsdw = hsdw;
	}

	public String getScd() {
		return this.scd;
	}

	public void setScd(String scd) {
		this.scd = scd;
	}

	public String getStage() {
		return this.stage;
	}

	public void setStage(String stage) {
		this.stage = stage;
	}

	public String getCz() {
		return this.cz;
	}

	public void setCz(String cz) {
		this.cz = cz;
	}

	public String getYy() {
		return this.yy;
	}

	public void setYy(String yy) {
		this.yy = yy;
	}

	public Double getYysl() {
		return this.yysl;
	}

	public void setYysl(Double yysl) {
		this.yysl = yysl;
	}

}