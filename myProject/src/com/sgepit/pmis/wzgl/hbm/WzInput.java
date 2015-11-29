package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzInput entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzInput implements java.io.Serializable {

	// Fields

	private String uids;
	private String bh;
	private String hth;
	private String cgbh;
	private String ghdw;
	private Date rq;
	private Double yzf;
	private Double zj;
	private Date dhrq;
	private Double sv;
	private String cgr;
	private String ysr;
	private String bgr;
	private String jhr;
	private String bz;
	private String billState;
	private String bm;
	private String pm;
	private String gg;
	private String cz;
	private String dw;
	private String sczs;
	private Double sqsl;
	private Double sl;
	private Double sjdj;
	private Double jhdj;
	private Double jhzj;
	private Double pzdj;
	private Double pzzj;
	private Double pzsv;
	private Double sjzj;
	private String czbgbh;
	private String fileLsh;
	private String filename;
	private String zjbh;
	private String ckh;
	private String billType;
	private Date zdrq;
	private Date qrrq;
	private String projectId;
	private String billname;
	private String stage;
	private String jhbh;
	private String sqbm;
	private String pbbh;
	private Double stocks;
	private Double strikenum;
	private String strikebh;
	private String cjhxbbh;
	private String pid;

	// Constructors

	/** default constructor */
	public WzInput() {
	}

	/** full constructor */
	public WzInput(String bh, String hth, String cgbh, String ghdw, Date rq,
			Double yzf, Double zj, Date dhrq, Double sv, String cgr,
			String ysr, String bgr, String jhr, String bz, String billState,
			String bm, String pm, String gg, String cz, String dw, String sczs,
			Double sqsl, Double sl, Double sjdj, Double jhdj, Double jhzj,
			Double pzdj, Double pzzj, Double pzsv, Double sjzj, String czbgbh,
			String fileLsh, String filename, String zjbh, String ckh,
			String billType, Date zdrq, Date qrrq, String projectId,
			String billname, String stage, String jhbh, String sqbm,
			String pbbh, Double stocks, Double strikenum, String strikebh,
			String cjhxbbh, String pid) {
		this.bh = bh;
		this.hth = hth;
		this.cgbh = cgbh;
		this.ghdw = ghdw;
		this.rq = rq;
		this.yzf = yzf;
		this.zj = zj;
		this.dhrq = dhrq;
		this.sv = sv;
		this.cgr = cgr;
		this.ysr = ysr;
		this.bgr = bgr;
		this.jhr = jhr;
		this.bz = bz;
		this.billState = billState;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.cz = cz;
		this.dw = dw;
		this.sczs = sczs;
		this.sqsl = sqsl;
		this.sl = sl;
		this.sjdj = sjdj;
		this.jhdj = jhdj;
		this.jhzj = jhzj;
		this.pzdj = pzdj;
		this.pzzj = pzzj;
		this.pzsv = pzsv;
		this.sjzj = sjzj;
		this.czbgbh = czbgbh;
		this.fileLsh = fileLsh;
		this.filename = filename;
		this.zjbh = zjbh;
		this.ckh = ckh;
		this.billType = billType;
		this.zdrq = zdrq;
		this.qrrq = qrrq;
		this.projectId = projectId;
		this.billname = billname;
		this.stage = stage;
		this.jhbh = jhbh;
		this.sqbm = sqbm;
		this.pbbh = pbbh;
		this.stocks = stocks;
		this.strikenum = strikenum;
		this.strikebh = strikebh;
		this.cjhxbbh = cjhxbbh;
		this.pid = pid;
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

	public String getHth() {
		return this.hth;
	}

	public void setHth(String hth) {
		this.hth = hth;
	}

	public String getCgbh() {
		return this.cgbh;
	}

	public void setCgbh(String cgbh) {
		this.cgbh = cgbh;
	}

	public String getGhdw() {
		return this.ghdw;
	}

	public void setGhdw(String ghdw) {
		this.ghdw = ghdw;
	}

	public Date getRq() {
		return this.rq;
	}

	public void setRq(Date rq) {
		this.rq = rq;
	}

	public Double getYzf() {
		return this.yzf;
	}

	public void setYzf(Double yzf) {
		this.yzf = yzf;
	}

	public Double getZj() {
		return this.zj;
	}

	public void setZj(Double zj) {
		this.zj = zj;
	}

	public Date getDhrq() {
		return this.dhrq;
	}

	public void setDhrq(Date dhrq) {
		this.dhrq = dhrq;
	}

	public Double getSv() {
		return this.sv;
	}

	public void setSv(Double sv) {
		this.sv = sv;
	}

	public String getCgr() {
		return this.cgr;
	}

	public void setCgr(String cgr) {
		this.cgr = cgr;
	}

	public String getYsr() {
		return this.ysr;
	}

	public void setYsr(String ysr) {
		this.ysr = ysr;
	}

	public String getBgr() {
		return this.bgr;
	}

	public void setBgr(String bgr) {
		this.bgr = bgr;
	}

	public String getJhr() {
		return this.jhr;
	}

	public void setJhr(String jhr) {
		this.jhr = jhr;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
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

	public String getSczs() {
		return this.sczs;
	}

	public void setSczs(String sczs) {
		this.sczs = sczs;
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

	public Double getSjdj() {
		return this.sjdj;
	}

	public void setSjdj(Double sjdj) {
		this.sjdj = sjdj;
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

	public Double getPzdj() {
		return this.pzdj;
	}

	public void setPzdj(Double pzdj) {
		this.pzdj = pzdj;
	}

	public Double getPzzj() {
		return this.pzzj;
	}

	public void setPzzj(Double pzzj) {
		this.pzzj = pzzj;
	}

	public Double getPzsv() {
		return this.pzsv;
	}

	public void setPzsv(Double pzsv) {
		this.pzsv = pzsv;
	}

	public Double getSjzj() {
		return this.sjzj;
	}

	public void setSjzj(Double sjzj) {
		this.sjzj = sjzj;
	}

	public String getCzbgbh() {
		return this.czbgbh;
	}

	public void setCzbgbh(String czbgbh) {
		this.czbgbh = czbgbh;
	}

	public String getFileLsh() {
		return this.fileLsh;
	}

	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}

	public String getFilename() {
		return this.filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getZjbh() {
		return this.zjbh;
	}

	public void setZjbh(String zjbh) {
		this.zjbh = zjbh;
	}

	public String getCkh() {
		return this.ckh;
	}

	public void setCkh(String ckh) {
		this.ckh = ckh;
	}

	public String getBillType() {
		return this.billType;
	}

	public void setBillType(String billType) {
		this.billType = billType;
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

	public String getProjectId() {
		return this.projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getBillname() {
		return this.billname;
	}

	public void setBillname(String billname) {
		this.billname = billname;
	}

	public String getStage() {
		return this.stage;
	}

	public void setStage(String stage) {
		this.stage = stage;
	}

	public String getJhbh() {
		return this.jhbh;
	}

	public void setJhbh(String jhbh) {
		this.jhbh = jhbh;
	}

	public String getSqbm() {
		return this.sqbm;
	}

	public void setSqbm(String sqbm) {
		this.sqbm = sqbm;
	}

	public String getPbbh() {
		return this.pbbh;
	}

	public void setPbbh(String pbbh) {
		this.pbbh = pbbh;
	}

	public Double getStocks() {
		return this.stocks;
	}

	public void setStocks(Double stocks) {
		this.stocks = stocks;
	}

	public Double getStrikenum() {
		return this.strikenum;
	}

	public void setStrikenum(Double strikenum) {
		this.strikenum = strikenum;
	}

	public String getStrikebh() {
		return this.strikebh;
	}

	public void setStrikebh(String strikebh) {
		this.strikebh = strikebh;
	}

	public String getCjhxbbh() {
		return this.cjhxbbh;
	}

	public void setCjhxbbh(String cjhxbbh) {
		this.cjhxbbh = cjhxbbh;
	}
	
	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
}