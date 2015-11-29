package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompTransferAssetsR41 entity. @author MyEclipse Persistence Tools
 */

public class FacompTransferAssetsR41 implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String treeid;
	private Long isleaf;
	private String parentid;
	private String remark;
	private String assetname;
	private String assetno;
	private String structure;
	private String position;
	private String unit;
	private Double num;
	private Double buildmoney;
	private Double contmoney;
	private Double transfertotalmoney;
	private String typetreeid;

	// Constructors

	/** default constructor */
	public FacompTransferAssetsR41() {
	}

	/** full constructor */
	public FacompTransferAssetsR41(String pid, String treeid, Long isleaf,
			String parentid, String remark, String assetname, String assetno,
			String structure, String position, String unit, Double num,
			Double buildmoney, Double contmoney, Double transfertotalmoney,String typetreeid) {
		this.pid = pid;
		this.treeid = treeid;
		this.isleaf = isleaf;
		this.parentid = parentid;
		this.remark = remark;
		this.assetname = assetname;
		this.assetno = assetno;
		this.structure = structure;
		this.position = position;
		this.unit = unit;
		this.num = num;
		this.buildmoney = buildmoney;
		this.contmoney = contmoney;
		this.transfertotalmoney = transfertotalmoney;
		this.typetreeid = typetreeid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getTreeid() {
		return this.treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getAssetname() {
		return this.assetname;
	}

	public void setAssetname(String assetname) {
		this.assetname = assetname;
	}

	public String getAssetno() {
		return this.assetno;
	}

	public void setAssetno(String assetno) {
		this.assetno = assetno;
	}

	public String getStructure() {
		return this.structure;
	}

	public void setStructure(String structure) {
		this.structure = structure;
	}

	public String getPosition() {
		return this.position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getNum() {
		return this.num;
	}

	public void setNum(Double num) {
		this.num = num;
	}

	public Double getBuildmoney() {
		return this.buildmoney;
	}

	public void setBuildmoney(Double buildmoney) {
		this.buildmoney = buildmoney;
	}

	public Double getContmoney() {
		return this.contmoney;
	}

	public void setContmoney(Double contmoney) {
		this.contmoney = contmoney;
	}

	public Double getTransfertotalmoney() {
		return this.transfertotalmoney;
	}

	public void setTransfertotalmoney(Double transfertotalmoney) {
		this.transfertotalmoney = transfertotalmoney;
	}

	public String getTypetreeid() {
		return typetreeid;
	}

	public void setTypetreeid(String typetreeid) {
		this.typetreeid = typetreeid;
	}

}