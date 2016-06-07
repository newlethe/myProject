package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquList;
import com.sgepit.pmis.wzgl.dao.WZglDAO;

/**
 * ConMat entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConMat implements java.io.Serializable {

	// Fields
	private String uids;
	private String hth;	
	private String pid;
	private String bm;  //物资主键
	private String pm;
	private String gg;
	private String zzcs;
	private String dw;
	private Double sl;
	private Double dhsl;
	private Double dj;
	private Double zj;
	private Date dhrq;
	private String cgjhbh;
	private String bz;
	private Double hszj;
	private Long isvalid;
	private Double jhdj;
	private String wzbm;  //物资编码
	// Constructors

	/** default constructor */
	public ConMat() {
	}

	
	/** minimal constructor */
	public ConMat(String uids,String hth) {
		this.uids = uids;
		this.hth = hth;
	}

	/** full constructor */
	public ConMat(String uids, String hth, String pid, String bm, String pm, String gg,
			String zzcs, String dw, Double sl, Double dhsl, Double dj,
			Double zj, Date dhrq, String cgjhbh, String bz, Double hszj,
			Long isvalid, Double jhdj) {
		this.uids = uids;
		this.hth = hth;
		this.pid = pid;
		this.bm = bm;
		this.pm = pm;
		this.gg = gg;
		this.zzcs = zzcs;
		this.dw = dw;
		this.sl = sl;
		this.dhsl = dhsl;
		this.dj = dj;
		this.zj = zj;
		this.dhrq = dhrq;
		this.cgjhbh = cgjhbh;
		this.bz = bz;
		this.hszj = hszj;
		this.isvalid = isvalid;
		this.jhdj = jhdj;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getHth() {
		return hth;
	}


	public void setHth(String hth) {
		this.hth = hth;
	}


	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getBm() {
		return this.bm;		
	}

	public void setBm(String bm) {
		this.bm = bm;     //物资主键
		System.out.println("====="+bm);
		WZglDAO wzgldao = WZglDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);		
		WzBm equ = (WzBm) wzgldao.findById("com.sgepit.pmis.wzgl.hbm.WzBm",bm);
		if(equ==null){
			this.wzbm = bm;
		}else{
			this.wzbm = equ.getBm();  //物资编码
		}
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

	public String getZzcs() {
		return this.zzcs;
	}

	public void setZzcs(String zzcs) {
		this.zzcs = zzcs;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getSl() {
		return this.sl;
	}

	public void setSl(Double sl) {
		this.sl = sl;
	}

	public Double getDhsl() {
		return this.dhsl;
	}

	public void setDhsl(Double dhsl) {
		this.dhsl = dhsl;
	}

	public Double getDj() {
		return this.dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
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

	public String getCgjhbh() {
		return this.cgjhbh;
	}

	public void setCgjhbh(String cgjhbh) {
		this.cgjhbh = cgjhbh;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public Double getHszj() {
		return this.hszj;
	}

	public void setHszj(Double hszj) {
		this.hszj = hszj;
	}

	public Long getIsvalid() {
		return this.isvalid;
	}

	public void setIsvalid(Long isvalid) {
		this.isvalid = isvalid;
	}

	public Double getJhdj() {
		return this.jhdj;
	}

	public void setJhdj(Double jhdj) {
		this.jhdj = jhdj;
	}


	public String getWzbm() {
		return wzbm;
	}
}