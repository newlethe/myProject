package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzOutput entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzOutput implements java.io.Serializable {

	// Fields

	private String uids;
	private String billname;
	private String bh;
	private Date rq;
	private String bz;
	private String jjr;
	private String bmzg;
	private String bgr;
	private String wzzg;
	private String jhr;
	private String tl;
	private String ckbh;
	private String rkbh;
	private String jhbh;
	private String bm;
	private String pm;
	private String gg;
	private String cz;
	private String dw;
	private Double sqsl;
	private Double sl;
	private Double jhdj;
	private Double jhzj;
	private String ckh;
	private String billState;
	private Date zdrq;
	private Date qrrq;
	private String lyr;
	private String sqbm;
	private String tyfs;
	private Double glfl;
	private Double glf;
	private String stage;
	private String projectId;
	private String khh;
	private String zh;
	private String address;
	private String dbyj;
	private String dh;
	private Double jsje;
	private Double stocks;
	private String projectLb;
	private String hth;
	private Double sjdj;
	private Double sjzj;
	private String wonum;
	private String bgdid;
	private Double jhdj_sl;
	private String pid;

	// Constructors

	/** default constructor */
	public WzOutput() {
	}


	/** full constructor */
	public WzOutput(String uids,String billname, String bh, Date rq, String bz, String jjr,
			String bmzg, String bgr, String wzzg, String jhr, String tl,
			String ckbh, String rkbh, String jhbh, String bm, String pm,
			String gg, String cz, String dw, Double sqsl, Double sl,
			Double jhdj, Double jhzj, String ckh, String billState, Date zdrq,
			Date qrrq, String lyr, String sqbm, String tyfs, Double glfl,
			Double glf, String stage, String projectId, String khh, String zh,
			String address, String dbyj, String dh, Double jsje, Double stocks,
			String projectLb, String hth, Double sjdj, Double sjzj,
			String wonum, String bgdid, Double jhdj_sl) {
		this.uids = uids;
		this.billname = billname;
		this.bh = bh;
		this.rq = rq;
		this.bz = bz;
		this.jjr = jjr;
		this.bmzg = bmzg;
		this.bgr = bgr;
		this.wzzg = wzzg;
		this.jhr = jhr;
		this.tl = tl;
		this.ckbh = ckbh;
		this.rkbh = rkbh;
		this.jhbh = jhbh;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.cz = cz;
		this.dw = dw;
		this.sqsl = sqsl;
		this.sl = sl;
		this.jhdj = jhdj;
		this.jhzj = jhzj;
		this.ckh = ckh;
		this.billState = billState;
		this.zdrq = zdrq;
		this.qrrq = qrrq;
		this.lyr = lyr;
		this.sqbm = sqbm;
		this.tyfs = tyfs;
		this.glfl = glfl;
		this.glf = glf;
		this.stage = stage;
		this.projectId = projectId;
		this.khh = khh;
		this.zh = zh;
		this.address = address;
		this.dbyj = dbyj;
		this.dh = dh;
		this.jsje = jsje;
		this.stocks = stocks;
		this.projectLb = projectLb;
		this.hth = hth;
		this.sjdj = sjdj;
		this.sjzj = sjzj;
		this.wonum = wonum;
		this.bgdid = bgdid;
		this.jhdj_sl = jhdj_sl;
	}

	// Property accessors


	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public Date getRq() {
		return this.rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getJjr() {
		return this.jjr;
	}

	public void setJjr(String jjr) {
		this.jjr = jjr;
	}

	public String getBmzg() {
		return this.bmzg;
	}

	public void setBmzg(String bmzg) {
		this.bmzg = bmzg;
	}

	public String getBgr() {
		return this.bgr;
	}

	public void setBgr(String bgr) {
		this.bgr = bgr;
	}

	public String getWzzg() {
		return this.wzzg;
	}

	public void setWzzg(String wzzg) {
		this.wzzg = wzzg;
	}

	public String getJhr() {
		return this.jhr;
	}

	public void setJhr(String jhr) {
		this.jhr = jhr;
	}

	public String getTl() {
		return this.tl;
	}

	public void setTl(String tl) {
		this.tl = tl;
	}

	public String getCkbh() {
		return this.ckbh;
	}

	public void setCkbh(String ckbh) {
		this.ckbh = ckbh;
	}

	public String getRkbh() {
		return this.rkbh;
	}

	public void setRkbh(String rkbh) {
		this.rkbh = rkbh;
	}

	public String getJhbh() {
		return this.jhbh;
	}

	public void setJhbh(String jhbh) {
		this.jhbh = jhbh;
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

	public String getCz() {
		return this.cz;
	}

	public void setCz(String cz) {
		this.cz = cz;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getSqsl() {
		return this.sqsl;
	}

	public void setSqsl(Double sqsl) {
		this.sqsl = sqsl;
	}

	public Double getSl() {
		return this.sl;
	}

	public void setSl(Double sl) {
		this.sl = sl;
	}

	public Double getJhdj() {
		return this.jhdj;
	}

	public void setJhdj(Double jhdj) {
		this.jhdj = jhdj;
	}

	public Double getJhzj() {
		return this.jhzj;
	}

	public void setJhzj(Double jhzj) {
		this.jhzj = jhzj;
	}

	public String getCkh() {
		return this.ckh;
	}

	public void setCkh(String ckh) {
		this.ckh = ckh;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public Date getZdrq() {
		return this.zdrq;
	}

	public void setZdrq(Date zdrq) {
		this.zdrq = zdrq;
	}

	public Date getQrrq() {
		return this.qrrq;
	}

	public void setQrrq(Date qrrq) {
		this.qrrq = qrrq;
	}

	public String getLyr() {
		return this.lyr;
	}

	public void setLyr(String lyr) {
		this.lyr = lyr;
	}

	public String getSqbm() {
		return this.sqbm;
	}

	public void setSqbm(String sqbm) {
		this.sqbm = sqbm;
	}

	public String getTyfs() {
		return this.tyfs;
	}

	public void setTyfs(String tyfs) {
		this.tyfs = tyfs;
	}

	public Double getGlfl() {
		return this.glfl;
	}

	public void setGlfl(Double glfl) {
		this.glfl = glfl;
	}

	public Double getGlf() {
		return this.glf;
	}

	public void setGlf(Double glf) {
		this.glf = glf;
	}

	public String getStage() {
		return this.stage;
	}

	public void setStage(String stage) {
		this.stage = stage;
	}

	public String getProjectId() {
		return this.projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getKhh() {
		return this.khh;
	}

	public void setKhh(String khh) {
		this.khh = khh;
	}

	public String getZh() {
		return this.zh;
	}

	public void setZh(String zh) {
		this.zh = zh;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDbyj() {
		return this.dbyj;
	}

	public void setDbyj(String dbyj) {
		this.dbyj = dbyj;
	}

	public String getDh() {
		return this.dh;
	}

	public void setDh(String dh) {
		this.dh = dh;
	}

	public Double getJsje() {
		return this.jsje;
	}

	public void setJsje(Double jsje) {
		this.jsje = jsje;
	}

	public Double getstocks() {
		return this.stocks;
	}

	public void setstocks(Double stocks) {
		this.stocks = stocks;
	}

	public String getProjectLb() {
		return this.projectLb;
	}

	public void setProjectLb(String projectLb) {
		this.projectLb = projectLb;
	}

	public String getHth() {
		return this.hth;
	}

	public void setHth(String hth) {
		this.hth = hth;
	}

	public Double getSjdj() {
		return this.sjdj;
	}

	public void setSjdj(Double sjdj) {
		this.sjdj = sjdj;
	}

	public Double getSjzj() {
		return this.sjzj;
	}

	public void setSjzj(Double sjzj) {
		this.sjzj = sjzj;
	}

	public String getWonum() {
		return this.wonum;
	}

	public void setWonum(String wonum) {
		this.wonum = wonum;
	}

	public String getBgdid() {
		return this.bgdid;
	}

	public void setBgdid(String bgdid) {
		this.bgdid = bgdid;
	}


	public String getUids() {
		return uids;
	}


	public void setUids(String uids) {
		this.uids = uids;
	}


	public String getBillname() {
		return billname;
	}


	public void setBillname(String billname) {
		this.billname = billname;
	}


	public Double getStocks() {
		return stocks;
	}


	public void setStocks(Double stocks) {
		this.stocks = stocks;
	}

	public Double getJhdj_sl() {
		return jhdj_sl;
	}


	public void setJhdj_sl(Double jhdj_sl) {
		this.jhdj_sl = jhdj_sl;
	}

	public String getPid() {
		return pid;
	}


	public void setPid(String pid) {
		this.pid = pid;
	}

}