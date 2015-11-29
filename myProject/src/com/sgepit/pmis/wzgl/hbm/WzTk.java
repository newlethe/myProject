package com.sgepit.pmis.wzgl.hbm;
import java.util.Date;

/**
 * WzOutput entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzTk implements java.io.Serializable {

	// Fields

	private String uids;
	private String billname;
	private String bh;
	private Date rq;
	private String jhbh;
	private String bm;
	private String pm;
	private String gg;
	private String dw;
	private Double tksl;
	private Double jhdj;
	private Double sl;
	private String billState;
	private Date zdrq;
	private Date qrrq;
	private String pid;



	// Constructors

	/** default constructor */
	public WzTk() {
	}


	/** full constructor */
	public WzTk(String uids,String billname, String bh, Date rq,  String bm, String pm,Double sl,
			String gg, String dw, String jhbh,Date zdrq, Double tksl,String billState,Double jhdj, Date qrrq) {
		this.uids = uids;
		this.billname = billname;
		this.bh = bh;
		this.rq = rq;
        this.jhdj = jhdj;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
	
		this.dw = dw;

		this.tksl = tksl;
		
		this.qrrq = qrrq;

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


	public String getBh() {
		return bh;
	}


	public void setBh(String bh) {
		this.bh = bh;
	}


	public Date getRq() {
		return rq;
	}


	public void setRq(Date rq) {
		this.rq = rq;
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


	public Double getTksl() {
		return tksl;
	}


	public void setTksl(Double tksl) {
		this.tksl = tksl;
	}


	public String getBillState() {
		return billState;
	}


	public void setBillState(String billState) {
		this.billState = billState;
	}


	public Date getQrrq() {
		return qrrq;
	}


	public void setQrrq(Date qrrq) {
		this.qrrq = qrrq;
	}


	public Double getJhdj() {
		return jhdj;
	}


	public void setJhdj(Double jhdj) {
		this.jhdj = jhdj;
	}


	public Date getZdrq() {
		return zdrq;
	}


	public void setZdrq(Date zdrq) {
		this.zdrq = zdrq;
	}


	public String getJhbh() {
		return jhbh;
	}


	public void setJhbh(String jhbh) {
		this.jhbh = jhbh;
	}


	public Double getSl() {
		return sl;
	}


	public void setSl(Double sl) {
		this.sl = sl;
	}


	public String getPid() {
		return pid;
	}


	public void setPid(String pid) {
		this.pid = pid;
	}

	// Property accessors




}