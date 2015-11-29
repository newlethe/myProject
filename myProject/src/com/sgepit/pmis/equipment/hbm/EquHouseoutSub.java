package com.sgepit.pmis.equipment.hbm;

/**
 * EquHouseoutSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquHouseoutSub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String equid;
	private String outid;
	private String spec;
	private String unit;
	private Double applyNum;
	private Double realNum;
	private Double price;
	private Double sumPrice;
	private String inSubid;
	private String pid;
	
	private String sbno;
	private String sbmc;
	private Double cksl;
	private String wztype;
	private String jzh;
	private String gcbh;
	private String dw;
	private Double dj;
	private Double zj;
	private String sccj;
	private String warehouseno;
	private String libraryno;
	private String bz;
	private String conid;
	

	// Constructors

	/** default constructor */
	public EquHouseoutSub() {
	}

	/** minimal constructor */
	public EquHouseoutSub(String uuid, String equid, String outid) {
		this.uuid = uuid;
		this.equid = equid;
		this.outid = outid;
	}

	/** full constructor */
	public EquHouseoutSub(String uuid, String equid, String outid, String spec,
			String unit, Double applyNum, Double realNum, Double price,
			Double sumPrice, String inSubid, String pid, String sbno,
			String sbmc, Double cksl, String wztype, String jzh, String gcbh,
			String dw, Double dj, Double zj, String sccj, String warehouseno,
			String libraryno, String bz) {
		this.uuid = uuid;
		this.equid = equid;
		this.outid = outid;
		this.spec = spec;
		this.unit = unit;
		this.applyNum = applyNum;
		this.realNum = realNum;
		this.price = price;
		this.sumPrice = sumPrice;
		this.inSubid = inSubid;
		this.pid = pid;
		this.sbno = sbno;
		this.sbmc = sbmc;
		this.cksl = cksl;
		this.wztype = wztype;
		this.jzh = jzh;
		this.gcbh = gcbh;
		this.dw = dw;
		this.dj = dj;
		this.zj = zj;
		this.sccj = sccj;
		this.warehouseno = warehouseno;
		this.libraryno = libraryno;
		this.bz = bz;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getEquid() {
		return this.equid;
	}

	public void setEquid(String equid) {
		this.equid = equid;
	}

	public String getOutid() {
		return this.outid;
	}

	public void setOutid(String outid) {
		this.outid = outid;
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

	public Double getApplyNum() {
		return this.applyNum;
	}

	public void setApplyNum(Double applyNum) {
		this.applyNum = applyNum;
	}

	public Double getRealNum() {
		return this.realNum;
	}

	public void setRealNum(Double realNum) {
		this.realNum = realNum;
	}

	public Double getPrice() {
		return this.price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getSumPrice() {
		return this.sumPrice;
	}

	public void setSumPrice(Double sumPrice) {
		this.sumPrice = sumPrice;
	}

	public String getInSubid() {
		return this.inSubid;
	}

	public void setInSubid(String inSubid) {
		this.inSubid = inSubid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getSbno() {
		return this.sbno;
	}

	public void setSbno(String sbno) {
		this.sbno = sbno;
	}

	public String getSbmc() {
		return this.sbmc;
	}

	public void setSbmc(String sbmc) {
		this.sbmc = sbmc;
	}

	public Double getCksl() {
		return this.cksl;
	}

	public void setCksl(Double cksl) {
		this.cksl = cksl;
	}

	public String getWztype() {
		return this.wztype;
	}

	public void setWztype(String wztype) {
		this.wztype = wztype;
	}

	public String getJzh() {
		return this.jzh;
	}

	public void setJzh(String jzh) {
		this.jzh = jzh;
	}

	public String getGcbh() {
		return this.gcbh;
	}

	public void setGcbh(String gcbh) {
		this.gcbh = gcbh;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
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

	public String getSccj() {
		return this.sccj;
	}

	public void setSccj(String sccj) {
		this.sccj = sccj;
	}

	public String getWarehouseno() {
		return this.warehouseno;
	}

	public void setWarehouseno(String warehouseno) {
		this.warehouseno = warehouseno;
	}

	public String getLibraryno() {
		return this.libraryno;
	}

	public void setLibraryno(String libraryno) {
		this.libraryno = libraryno;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

}