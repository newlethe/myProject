package com.sgepit.pmis.material.hbm;

/**
 * MatStoreOutsub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatStoreOutsub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String outId;
	private String appId;
	private String inId;
	private String matId;
	private String goodsId;
	private String subNo;
	private String catNo;
	private String catName;
	private String spec;
	private String unit;
	private Double price;
	private Double appNum;
	private Double realNum;
	private Double money;
	private String bdgid;
	private String bdgno;
	private String bdgname;
	private String useMan;
	private Long outType;
	private String assetNo;
	private String auditId;
	private String pid;

	private String tdUids;
	
	private String fixedAssetTreeid;
	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public MatStoreOutsub() {
	}

	/** full constructor */
	public MatStoreOutsub(String outId, String appId, String inId,
			String matId, String goodsId, String subNo, String catNo,
			String catName, String spec, String unit, Double price,
			Double appNum, Double realNum, Double money, String bdgid,
			String bdgno, String bdgname, String useMan, Long outType,
			String assetNo, String auditId, String tdUids,String fixedAssetTreeid) {
		this.outId = outId;
		this.appId = appId;
		this.inId = inId;
		this.matId = matId;
		this.goodsId = goodsId;
		this.subNo = subNo;
		this.catNo = catNo;
		this.catName = catName;
		this.spec = spec;
		this.unit = unit;
		this.price = price;
		this.appNum = appNum;
		this.realNum = realNum;
		this.money = money;
		this.bdgid = bdgid;
		this.bdgno = bdgno;
		this.bdgname = bdgname;
		this.useMan = useMan;
		this.outType = outType;
		this.assetNo = assetNo;
		this.auditId = auditId;
		this.tdUids = tdUids;
		this.fixedAssetTreeid = fixedAssetTreeid;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getOutId() {
		return this.outId;
	}

	public void setOutId(String outId) {
		this.outId = outId;
	}

	public String getAppId() {
		return this.appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getInId() {
		return this.inId;
	}

	public void setInId(String inId) {
		this.inId = inId;
	}

	public String getMatId() {
		return this.matId;
	}

	public void setMatId(String matId) {
		this.matId = matId;
	}

	public String getGoodsId() {
		return this.goodsId;
	}

	public void setGoodsId(String goodsId) {
		this.goodsId = goodsId;
	}

	public String getSubNo() {
		return this.subNo;
	}

	public void setSubNo(String subNo) {
		this.subNo = subNo;
	}

	public String getCatNo() {
		return this.catNo;
	}

	public void setCatNo(String catNo) {
		this.catNo = catNo;
	}

	public String getCatName() {
		return this.catName;
	}

	public void setCatName(String catName) {
		this.catName = catName;
	}

	public String getSpec() {
		return this.spec;
	}

	public void setSpec(String spec) {
		this.spec = spec;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getPrice() {
		return this.price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getAppNum() {
		return this.appNum;
	}

	public void setAppNum(Double appNum) {
		this.appNum = appNum;
	}

	public Double getRealNum() {
		return this.realNum;
	}

	public void setRealNum(Double realNum) {
		this.realNum = realNum;
	}

	public Double getMoney() {
		return this.money;
	}

	public void setMoney(Double money) {
		this.money = money;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgno() {
		return this.bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return this.bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public String getUseMan() {
		return this.useMan;
	}

	public void setUseMan(String useMan) {
		this.useMan = useMan;
	}

	public Long getOutType() {
		return this.outType;
	}

	public void setOutType(Long outType) {
		this.outType = outType;
	}

	public String getAssetNo() {
		return this.assetNo;
	}

	public void setAssetNo(String assetNo) {
		this.assetNo = assetNo;
	}

	public String getAuditId() {
		return this.auditId;
	}

	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}

	public String getTdUids() {
		return tdUids;
	}

	public void setTdUids(String tdUids) {
		this.tdUids = tdUids;
	}

	public String getFixedAssetTreeid() {
		return fixedAssetTreeid;
	}

	public void setFixedAssetTreeid(String fixedAssetTreeid) {
		this.fixedAssetTreeid = fixedAssetTreeid;
	}

}