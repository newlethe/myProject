package com.sgepit.pmis.document.hbm;

import java.util.Date;

/**
 * DaDaml entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class DaDaml implements java.io.Serializable {

	// Fields

	private String dzid;
	private String pid;
	private String zlid;
	private String daid;
	private Long sl;
	private Long xh;
	private String yc;
	private Date  stockdate;
	////expend properties
	private String dafileno;//文件编号		
	private String dafilename;//文件名称
	private String dazrz;//责任者
	private String uint;//单位
	private String dzwd;//电子文档
	private Date rkrq;//入库日期
	private String yjr;//移交人
	private String jsr;//经手人
	private String bz;//备注
	private String company;//单位名称
	private String dh;//档号
	private String insid;//流程实例id
    private Long zllx;//资料类型
    private String yh;//页号
	// Constructors

	

	public String getInsid() {
		return insid;
	}

	public void setInsid(String insid) {
		this.insid = insid;
	}

	/**
	 * @return the dh
	 */
	public String getDh() {
		return dh;
	}

	/**
	 * @param dh the dh to set
	 */
	public void setDh(String dh) {
		this.dh = dh;
	}

	/**
	 * @return the stockdate
	 */
	public Date getStockdate() {
		return stockdate;
	}

	/**
	 * @param stockdate the stockdate to set
	 */
	public void setStockdate(Date stockdate) {
		this.stockdate = stockdate;
	}

	/** default constructor */
	public DaDaml() {
	}

	/** minimal constructor */
	public DaDaml(String pid, String zlid, String daid) {
		this.pid = pid;
		this.zlid = zlid;
		this.daid = daid;
	}

	/** full constructor */
	public DaDaml(String pid, String zlid, String daid, Long sl, Long xh,
			String yc) {
		this.pid = pid;
		this.zlid = zlid;
		this.daid = daid;
		this.sl = sl;
		this.xh = xh;
		this.yc = yc;
	}

	// Property accessors

	public String getDzid() {
		return this.dzid;
	}

	public void setDzid(String dzid) {
		this.dzid = dzid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getZlid() {
		return this.zlid;
	}

	public void setZlid(String zlid) {
		this.zlid = zlid;
	}

	public String getDaid() {
		return this.daid;
	}

	public void setDaid(String daid) {
		this.daid = daid;
	}

	public Long getSl() {
		return this.sl;
	}

	public void setSl(Long sl) {
		this.sl = sl;
	}

	public Long getXh() {
		return this.xh;
	}

	public void setXh(Long xh) {
		this.xh = xh;
	}

	public String getYc() {
		return this.yc;
	}

	public void setYc(String yc) {
		this.yc = yc;
	}

	/**
	 * @return the dafileno
	 */
	public String getDafileno() {
		return dafileno;
	}

	/**
	 * @param dafileno the dafileno to set
	 */
	public void setDafileno(String dafileno) {
		this.dafileno = dafileno;
	}

	/**
	 * @return the dafilename
	 */
	public String getDafilename() {
		return dafilename;
	}

	/**
	 * @param dafilename the dafilename to set
	 */
	public void setDafilename(String dafilename) {
		this.dafilename = dafilename;
	}

	/**
	 * @return the dazrz
	 */
	public String getDazrz() {
		return dazrz;
	}

	/**
	 * @param dazrz the dazrz to set
	 */
	public void setDazrz(String dazrz) {
		this.dazrz = dazrz;
	}

	/**
	 * @return the uint
	 */
	public String getUint() {
		return uint;
	}

	/**
	 * @param uint the uint to set
	 */
	public void setUint(String uint) {
		this.uint = uint;
	}

	/**
	 * @return the dzwd
	 */
	public String getDzwd() {
		return dzwd;
	}

	/**
	 * @param dzwd the dzwd to set
	 */
	public void setDzwd(String dzwd) {
		this.dzwd = dzwd;
	}

	/**
	 * @return the rkrq
	 */
	public Date getRkrq() {
		return rkrq;
	}

	/**
	 * @param rkrq the rkrq to set
	 */
	public void setRkrq(Date rkrq) {
		this.rkrq = rkrq;
	}

	/**
	 * @return the yjr
	 */
	public String getYjr() {
		return yjr;
	}

	/**
	 * @param yjr the yjr to set
	 */
	public void setYjr(String yjr) {
		this.yjr = yjr;
	}

	/**
	 * @return the jsr
	 */
	public String getJsr() {
		return jsr;
	}

	/**
	 * @param jsr the jsr to set
	 */
	public void setJsr(String jsr) {
		this.jsr = jsr;
	}

	/**
	 * @return the bz
	 */
	public String getBz() {
		return bz;
	}

	/**
	 * @param bz the bz to set
	 */
	public void setBz(String bz) {
		this.bz = bz;
	}

	/**
	 * @return the company
	 */
	public String getCompany() {
		return company;
	}

	/**
	 * @param company the company to set
	 */
	public void setCompany(String company) {
		this.company = company;
	}

	public Long getZllx() {
		return zllx;
	}

	public void setZllx(Long zllx) {
		this.zllx = zllx;
	}

	public String getYh() {
		return yh;
	}

	public void setYh(String yh) {
		this.yh = yh;
	}
	
}