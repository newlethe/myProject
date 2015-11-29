package com.sgepit.frame.guideline.hbm;

import java.util.Date;


/**
 * SgccGuidelineInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccGuidelineInfo implements java.io.Serializable {

	// Fields

	private String zbSeqno;
	private String unitId;
	private String parentid;
	private String name;
	private String jldw;
	private String gkbm;
	private String sxLb;
	private String sxHz;
	private String sxTable;
	private String sxDl;
	private String sxSh;
	private String sblx;
	private String zbssdw;
	private String gszbj;
	private String hqfs;
	private String fjfs;
	private String ifhj;
	private String ifjy;
	private String ifydfx;
	private String ifzhfx;
	private String zbjsgs;
	private String zbyx;
	private String memo;
	private String state;
	private String ifpercent;
	private String ifmulti;
	private Long zbjd;
	private String collectType;
	private String realname;
	private String fullname;
	private String reportType;
	private String ifpub;
	private String path;
	private String inputtype;
	private String gkgw;
	private String ifPj;
	private Double zbQz;
	private String zbZzlx;
	private String zbTrcc;
	private String ifZhgraph;
	private Integer showOrder;
	
	// Constructors
	
	//额外添加的属性
	private Date xdsj;
	

	/** default constructor */
	public SgccGuidelineInfo() {
	}

	/** minimal constructor */
	public SgccGuidelineInfo(String zbSeqno, String name) {
		this.zbSeqno = zbSeqno;
		this.name = name;
	}

	/** full constructor */
	public SgccGuidelineInfo(String zbSeqno, String zbssdw, String parentid,
			String name, String jldw, String gkbm, String sxLb,
			String sxHz, String sxTable, String sxDl, String sxSh, String sblx,
			String gszbj, String hqfs, String fjfs, String ifhj, String ifjy,
			String ifydfx, String ifzhfx, String zbjsgs, String zbyx,
			String memo, String state, String ifpercent, String ifmulti,
			Long zbjd, String collectType, String realname, String fullname,
			String reportType, String ifpub, String path, String unitId,
			String inputtype, String gkgw, String ifPj, Double zbQz,
			String zbZzlx, String zbTrcc, String ifZhgraph) {
		this.zbSeqno = zbSeqno;
		this.zbssdw = zbssdw;
		this.parentid = parentid;
		this.name = name;
		this.jldw = jldw;
		this.gkbm = gkbm;
		this.sxLb = sxLb;
		this.sxHz = sxHz;
		this.sxTable = sxTable;
		this.sxDl = sxDl;
		this.sxSh = sxSh;
		this.sblx = sblx;
		this.gszbj = gszbj;
		this.hqfs = hqfs;
		this.fjfs = fjfs;
		this.ifhj = ifhj;
		this.ifjy = ifjy;
		this.ifydfx = ifydfx;
		this.ifzhfx = ifzhfx;
		this.zbjsgs = zbjsgs;
		this.zbyx = zbyx;
		this.memo = memo;
		this.state = state;
		this.ifpercent = ifpercent;
		this.ifmulti = ifmulti;
		this.zbjd = zbjd;
		this.collectType = collectType;
		this.realname = realname;
		this.fullname = fullname;
		this.reportType = reportType;
		this.ifpub = ifpub;
		this.path = path;
		this.unitId = unitId;
		this.inputtype = inputtype;
		this.gkgw = gkgw;
		this.ifPj = ifPj;
		this.zbQz = zbQz;
		this.zbZzlx = zbZzlx;
		this.zbTrcc = zbTrcc;
		this.ifZhgraph = ifZhgraph;
	
	}

	// Property accessors

	public String getZbSeqno() {
		return this.zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
	}


	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getJldw() {
		return this.jldw;
	}

	public void setJldw(String jldw) {
		this.jldw = jldw;
	}

	public String getGkbm() {
		return this.gkbm;
	}

	public void setGkbm(String gkbm) {
		this.gkbm = gkbm;
	}

	public String getSxLb() {
		return this.sxLb;
	}

	public void setSxLb(String sxLb) {
		this.sxLb = sxLb;
	}

	public String getSxHz() {
		return this.sxHz;
	}

	public void setSxHz(String sxHz) {
		this.sxHz = sxHz;
	}

	public String getSxTable() {
		return this.sxTable;
	}

	public void setSxTable(String sxTable) {
		this.sxTable = sxTable;
	}

	public String getSxDl() {
		return this.sxDl;
	}

	public void setSxDl(String sxDl) {
		this.sxDl = sxDl;
	}

	public String getSxSh() {
		return this.sxSh;
	}

	public void setSxSh(String sxSh) {
		this.sxSh = sxSh;
	}

	public String getSblx() {
		return this.sblx;
	}

	public void setSblx(String sblx) {
		this.sblx = sblx;
	}

	public String getGszbj() {
		return this.gszbj;
	}

	public void setGszbj(String gszbj) {
		this.gszbj = gszbj;
	}

	public String getHqfs() {
		return this.hqfs;
	}

	public void setHqfs(String hqfs) {
		this.hqfs = hqfs;
	}

	/**
	 * @return the zbssdw
	 */
	public String getZbssdw() {
		return zbssdw;
	}

	/**
	 * @param zbssdw the zbssdw to set
	 */
	public void setZbssdw(String zbssdw) {
		this.zbssdw = zbssdw;
	}

	/**
	 * @return the fjfs
	 */
	public String getFjfs() {
		return fjfs;
	}

	/**
	 * @param fjfs the fjfs to set
	 */
	public void setFjfs(String fjfs) {
		this.fjfs = fjfs;
	}

	public String getIfhj() {
		return this.ifhj;
	}

	public void setIfhj(String ifhj) {
		this.ifhj = ifhj;
	}

	public String getIfjy() {
		return this.ifjy;
	}

	public void setIfjy(String ifjy) {
		this.ifjy = ifjy;
	}

	public String getIfydfx() {
		return this.ifydfx;
	}

	public void setIfydfx(String ifydfx) {
		this.ifydfx = ifydfx;
	}

	public String getIfzhfx() {
		return this.ifzhfx;
	}

	public void setIfzhfx(String ifzhfx) {
		this.ifzhfx = ifzhfx;
	}

	public String getZbjsgs() {
		return this.zbjsgs;
	}

	public void setZbjsgs(String zbjsgs) {
		this.zbjsgs = zbjsgs;
	}

	public String getZbyx() {
		return this.zbyx;
	}

	public void setZbyx(String zbyx) {
		this.zbyx = zbyx;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getIfpercent() {
		return this.ifpercent;
	}

	public void setIfpercent(String ifpercent) {
		this.ifpercent = ifpercent;
	}

	public String getIfmulti() {
		return this.ifmulti;
	}

	public void setIfmulti(String ifmulti) {
		this.ifmulti = ifmulti;
	}

	public Long getZbjd() {
		return this.zbjd;
	}

	public void setZbjd(Long zbjd) {
		this.zbjd = zbjd;
	}

	public String getCollectType() {
		return this.collectType;
	}

	public void setCollectType(String collectType) {
		this.collectType = collectType;
	}

	public String getRealname() {
		return this.realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getFullname() {
		return this.fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getReportType() {
		return this.reportType;
	}

	public void setReportType(String reportType) {
		this.reportType = reportType;
	}

	public String getIfpub() {
		return this.ifpub;
	}

	public void setIfpub(String ifpub) {
		this.ifpub = ifpub;
	}

	public String getPath() {
		return this.path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	/**
	 * @return the unitId
	 */
	public String getUnitId() {
		return unitId;
	}

	/**
	 * @param unitId the unitId to set
	 */
	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getInputtype() {
		return this.inputtype;
	}

	public void setInputtype(String inputtype) {
		this.inputtype = inputtype;
	}

	public String getGkgw() {
		return this.gkgw;
	}

	public void setGkgw(String gkgw) {
		this.gkgw = gkgw;
	}

	public String getIfPj() {
		return this.ifPj;
	}

	public void setIfPj(String ifPj) {
		this.ifPj = ifPj;
	}

	public Double getZbQz() {
		return this.zbQz;
	}

	public void setZbQz(Double zbQz) {
		this.zbQz = zbQz;
	}

	public String getZbZzlx() {
		return this.zbZzlx;
	}

	public void setZbZzlx(String zbZzlx) {
		this.zbZzlx = zbZzlx;
	}

	public String getZbTrcc() {
		return this.zbTrcc;
	}

	public void setZbTrcc(String zbTrcc) {
		this.zbTrcc = zbTrcc;
	}

	public String getIfZhgraph() {
		return this.ifZhgraph;
	}

	public void setIfZhgraph(String ifZhgraph) {
		this.ifZhgraph = ifZhgraph;
	}

	/**
	 * @return the showOrder
	 */
	public Integer getShowOrder() {
		return showOrder;
	}

	/**
	 * @param showOrder the showOrder to set
	 */
	public void setShowOrder(Integer showOrder) {
		this.showOrder = showOrder;
	}

	public Date getXdsj() {
		return xdsj;
	}

	public void setXdsj(Date xdsj) {
		this.xdsj = xdsj;
	}

	

}