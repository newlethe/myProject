package com.sgepit.frame.guideline.hbm;


/**
 * SgccGuidelineInfo .
 * 
 */

public class SgccGuidelineInfoVO {

	// Fields

	private String zbSeqno;
	private String unitId;
	private String parentid;
	private String name;
	private String jldw;
	private String sxLb;
	private String fjfs;
	private String ifydfx;
	private String zbyx;
	private String state;
	private String ifpercent;
	private String collectType;
	private String realname;
	private String ifpub;
	private String zbTrcc;
	private int showOrder;
	
	// Constructors

	/** default constructor */
	public SgccGuidelineInfoVO() {
	}

	/** minimal constructor */
	public SgccGuidelineInfoVO(String zbSeqno, String name) {
		this.zbSeqno = zbSeqno;
		this.name = name;
	}

	/** full constructor */
	public SgccGuidelineInfoVO(String zbSeqno, String parentid,
			String name, String jldw, String fjfs, 
			String ifydfx, String state, String ifpercent, String collectType, String realname, 
			String ifpub, String unitId,String zbTrcc) {
		this.zbSeqno = zbSeqno;
		this.parentid = parentid;
		this.name = name;
		this.jldw = jldw;
		this.sxLb = sxLb;
		this.fjfs = fjfs;
		this.ifydfx = ifydfx;
		this.zbyx = zbyx;
		this.state = state;
		this.ifpercent = ifpercent;
		this.collectType = collectType;
		this.realname = realname;
		this.ifpub = ifpub;
		this.unitId = unitId;
		this.zbTrcc = zbTrcc;
	
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

	public String getSxLb() {
		return this.sxLb;
	}

	public void setSxLb(String sxLb) {
		this.sxLb = sxLb;
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

	public String getIfydfx() {
		return this.ifydfx;
	}

	public void setIfydfx(String ifydfx) {
		this.ifydfx = ifydfx;
	}


	public String getZbyx() {
		return this.zbyx;
	}

	public void setZbyx(String zbyx) {
		this.zbyx = zbyx;
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


	public String getIfpub() {
		return this.ifpub;
	}

	public void setIfpub(String ifpub) {
		this.ifpub = ifpub;
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


	public String getZbTrcc() {
		return this.zbTrcc;
	}

	public void setZbTrcc(String zbTrcc) {
		this.zbTrcc = zbTrcc;
	}

	/**
	 * @return the showOrder
	 */
	public int getShowOrder() {
		return showOrder;
	}

	/**
	 * @param showOrder the showOrder to set
	 */
	public void setShowOrder(int showOrder) {
		this.showOrder = showOrder;
	}

	

}