package com.sgepit.frame.flow.hbm;

import java.util.Date;

/**
 * ZlInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ZlInfo implements java.io.Serializable {

	// Fields

	private String infoid;//主键
	private String pid; //项目别
	private String indexid; //分类条件
	private String fileno; //文件编号
	private String materialname; //材料名称
	private String responpeople; //录入人
	private Date stockdate; // 文件形成日期
	private Long quantity; //每份数量
	private Long book; //单位
	private Long portion; //份
	private String filelsh; //附件流水号
	private Long billstate; //单据状态
	private String orgid; //部门id
	private String weavecompany; //责任者
	private Long infgrade; //资料电子文档密级
	private String filename; //附件文件名称
	private String remark; //备注
	private String yjr;//移交人
	private String jsr;//经手人
	private Long zltype;//资料类型
	private Date rkrq; // 入库日期
	private String modtabid;
	private String flwinsid;//流程实例
	private String yc;//页数
	// Constructors
    //扩展属性
	private String zldaid;
	private String yh; //页号
	
	/*
	 *	从其他业务模块资料移交时，关联业务模块的表及主键； 
	 */
	private String yjTableAndId;
	
	public String getZldaid() {
		return zldaid;
	}

	public void setZldaid(String zldaid) {
		this.zldaid = zldaid;
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

	/** default constructor */
	public ZlInfo() {
	}

	/** minimal constructor */
	public ZlInfo(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public ZlInfo(String pid, String indexid, String fileno,
			String materialname, String responpeople, Date stockdate,
			Long quantity, Long book, Long portion, String filelsh,
			Long billstate, String orgid, String weavecompany, Long infgrade,
			String filename, String remark,String yjr,String jsr,Date rkrq,Long zltype,
			String modtabid,String flwinsid,String zldaid,String yh) {
		this.pid = pid;
		this.indexid = indexid;
		this.fileno = fileno;
		this.materialname = materialname;
		this.responpeople = responpeople;
		this.stockdate = stockdate;
		this.quantity = quantity;
		this.book = book;
		this.portion = portion;
		this.filelsh = filelsh;
		this.billstate = billstate;
		this.orgid = orgid;
		this.weavecompany = weavecompany;
		this.infgrade = infgrade;
		this.filename = filename;
		this.remark = remark;
		this.yjr=yjr;
		this.jsr=jsr;
		this.zltype=zltype;
		this.rkrq=rkrq;
		this.modtabid = modtabid;
		this.flwinsid=flwinsid;
		this.zldaid=zldaid;
		this.yh = yh;
	}

	// Property accessors

	
	public String getInfoid() {
		return this.infoid;
	}

	public void setInfoid(String infoid) {
		this.infoid = infoid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getIndexid() {
		return this.indexid;
	}

	public void setIndexid(String indexid) {
		this.indexid = indexid;
	}

	public String getFileno() {
		return this.fileno;
	}

	public void setFileno(String fileno) {
		this.fileno = fileno;
	}

	public String getMaterialname() {
		return this.materialname;
	}

	public void setMaterialname(String materialname) {
		this.materialname = materialname;
	}

	public String getResponpeople() {
		return this.responpeople;
	}

	public void setResponpeople(String responpeople) {
		this.responpeople = responpeople;
	}

	public Date getStockdate() {
		return this.stockdate;
	}

	public void setStockdate(Date stockdate) {
		this.stockdate = stockdate;
	}

	public Long getQuantity() {
		return this.quantity;
	}

	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}

	public Long getBook() {
		return this.book;
	}

	public void setBook(Long book) {
		this.book = book;
	}

	public Long getPortion() {
		return this.portion;
	}

	public void setPortion(Long portion) {
		this.portion = portion;
	}

	public String getFilelsh() {
		return this.filelsh;
	}

	public void setFilelsh(String filelsh) {
		this.filelsh = filelsh;
	}

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public String getOrgid() {
		return this.orgid;
	}

	public void setOrgid(String orgid) {
		this.orgid = orgid;
	}

	public String getWeavecompany() {
		return this.weavecompany;
	}

	public void setWeavecompany(String weavecompany) {
		this.weavecompany = weavecompany;
	}

	public Long getInfgrade() {
		return this.infgrade;
	}

	public void setInfgrade(Long infgrade) {
		this.infgrade = infgrade;
	}

	public String getFilename() {
		return this.filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getZltype() {
		return zltype;
	}

	public void setZltype(Long zltype) {
		this.zltype = zltype;
	}

	public Date getRkrq() {
		return rkrq;
	}

	public void setRkrq(Date rkrq) {
		this.rkrq = rkrq;
	}

	public String getModtabid() {
		return modtabid;
	}

	public void setModtabid(String modtabid) {
		this.modtabid = modtabid;
	}

	public String getFlwinsid() {
		return flwinsid;
	}

	public void setFlwinsid(String flwinsid) {
		this.flwinsid = flwinsid;
	}

	public String getYh() {
		return yh;
	}

	public void setYh(String yh) {
		this.yh = yh;
	}

	public String getYjTableAndId() {
		return yjTableAndId;
	}

	public void setYjTableAndId(String yjTableAndId) {
		this.yjTableAndId = yjTableAndId;
	}

	public String getYc() {
		return yc;
	}

	public void setYc(String yc) {
		this.yc = yc;
	}
}