package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsTz entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsTz implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String type;
	private Date shrq;
	private String chbm;
	private String chmc;
	private String ggxh;
	private String dw;
	private Double finiStockNum;
	private Double finiStockPrice;
	private Double finiStockMoney;
	private Double inNum;
	private Double inPrice;
	private Double inAmount;
	private Double outNum;
	private Double outPrice;
	private Double outAmount;
	private String llyt;
	private String cwkm;
	private Double stockNum;
	private Double stockPrice;
	private Double stockMoney;
	private Date riqi;
	private String danhao;
	private String cangkuType;
	private String cangku;
	private String kczz;
	private String conno;
	private String ghdw;
	private String zdr;
	private String shr;
	
	private String kks;
	private String azbw;
	private String conmoneyno;
	private String conttreetype;
	private Long finished;	//是否完结

	private String inSubUids;//入库明细主键
	private String equType;//设备类型，暂估或正式

	/**扩展字段*/
	//第一条first,最后一条last,都不是none,都是both
	private String flag;

	// Constructors

	/** default constructor */
	public EquGoodsTz() {
	}

	/** full constructor */
	public EquGoodsTz(String uids, String pid, String type, Date shrq,
			String chbm, String chmc, String ggxh, String dw,
			Double finiStockNum, Double finiStockPrice, Double finiStockMoney,
			Double inNum, Double inPrice, Double inAmount, Double outNum,
			Double outPrice, Double outAmount, String llyt, String cwkm,
			Double stockNum, Double stockPrice, Double stockMoney, Date riqi,
			String danhao, String cangkuType, String cangku, String kczz,
			String conno, String ghdw, String zdr, String shr, String kks,
			String azbw, String conmoneyno, String conttreetype, Long finished,
			String inSubUids, String equType, String flag) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.type = type;
		this.shrq = shrq;
		this.chbm = chbm;
		this.chmc = chmc;
		this.ggxh = ggxh;
		this.dw = dw;
		this.finiStockNum = finiStockNum;
		this.finiStockPrice = finiStockPrice;
		this.finiStockMoney = finiStockMoney;
		this.inNum = inNum;
		this.inPrice = inPrice;
		this.inAmount = inAmount;
		this.outNum = outNum;
		this.outPrice = outPrice;
		this.outAmount = outAmount;
		this.llyt = llyt;
		this.cwkm = cwkm;
		this.stockNum = stockNum;
		this.stockPrice = stockPrice;
		this.stockMoney = stockMoney;
		this.riqi = riqi;
		this.danhao = danhao;
		this.cangkuType = cangkuType;
		this.cangku = cangku;
		this.kczz = kczz;
		this.conno = conno;
		this.ghdw = ghdw;
		this.zdr = zdr;
		this.shr = shr;
		this.kks = kks;
		this.azbw = azbw;
		this.conmoneyno = conmoneyno;
		this.conttreetype = conttreetype;
		this.finished = finished;
		this.inSubUids = inSubUids;
		this.equType = equType;
		this.flag = flag;
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

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Date getShrq() {
		return this.shrq;
	}

	public void setShrq(Date shrq) {
		this.shrq = shrq;
	}

	public String getChbm() {
		return this.chbm;
	}

	public void setChbm(String chbm) {
		this.chbm = chbm;
	}

	public String getChmc() {
		return this.chmc;
	}

	public void setChmc(String chmc) {
		this.chmc = chmc;
	}

	public String getGgxh() {
		return this.ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Double getFiniStockNum() {
		return this.finiStockNum;
	}

	public void setFiniStockNum(Double finiStockNum) {
		this.finiStockNum = finiStockNum;
	}

	public Double getFiniStockPrice() {
		return this.finiStockPrice;
	}

	public void setFiniStockPrice(Double finiStockPrice) {
		this.finiStockPrice = finiStockPrice;
	}

	public Double getFiniStockMoney() {
		return this.finiStockMoney;
	}

	public void setFiniStockMoney(Double finiStockMoney) {
		this.finiStockMoney = finiStockMoney;
	}

	public Double getInNum() {
		return this.inNum;
	}

	public void setInNum(Double inNum) {
		this.inNum = inNum;
	}

	public Double getInPrice() {
		return this.inPrice;
	}

	public void setInPrice(Double inPrice) {
		this.inPrice = inPrice;
	}

	public Double getInAmount() {
		return this.inAmount;
	}

	public void setInAmount(Double inAmount) {
		this.inAmount = inAmount;
	}

	public Double getOutNum() {
		return this.outNum;
	}

	public void setOutNum(Double outNum) {
		this.outNum = outNum;
	}

	public Double getOutPrice() {
		return this.outPrice;
	}

	public void setOutPrice(Double outPrice) {
		this.outPrice = outPrice;
	}

	public Double getOutAmount() {
		return this.outAmount;
	}

	public void setOutAmount(Double outAmount) {
		this.outAmount = outAmount;
	}

	public String getLlyt() {
		return this.llyt;
	}

	public void setLlyt(String llyt) {
		this.llyt = llyt;
	}

	public String getCwkm() {
		return this.cwkm;
	}

	public void setCwkm(String cwkm) {
		this.cwkm = cwkm;
	}

	public Double getStockNum() {
		return this.stockNum;
	}

	public void setStockNum(Double stockNum) {
		this.stockNum = stockNum;
	}

	public Double getStockPrice() {
		return this.stockPrice;
	}

	public void setStockPrice(Double stockPrice) {
		this.stockPrice = stockPrice;
	}

	public Double getStockMoney() {
		return this.stockMoney;
	}

	public void setStockMoney(Double stockMoney) {
		this.stockMoney = stockMoney;
	}

	public Date getRiqi() {
		return riqi;
	}

	public void setRiqi(Date riqi) {
		this.riqi = riqi;
	}

	public String getDanhao() {
		return danhao;
	}

	public void setDanhao(String danhao) {
		this.danhao = danhao;
	}

	public String getCangku() {
		return cangku;
	}

	public void setCangku(String cangku) {
		this.cangku = cangku;
	}

	public String getKczz() {
		return kczz;
	}

	public void setKczz(String kczz) {
		this.kczz = kczz;
	}

	public String getConno() {
		return conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getGhdw() {
		return ghdw;
	}

	public void setGhdw(String ghdw) {
		this.ghdw = ghdw;
	}

	public String getZdr() {
		return zdr;
	}

	public void setZdr(String zdr) {
		this.zdr = zdr;
	}

	public String getShr() {
		return shr;
	}

	public void setShr(String shr) {
		this.shr = shr;
	}

	public String getCangkuType() {
		return cangkuType;
	}

	public void setCangkuType(String cangkuType) {
		this.cangkuType = cangkuType;
	}

	public String getKks() {
		return kks;
	}

	public void setKks(String kks) {
		this.kks = kks;
	}

	public String getAzbw() {
		return azbw;
	}

	public void setAzbw(String azbw) {
		this.azbw = azbw;
	}

	public String getConmoneyno() {
		return conmoneyno;
	}

	public void setConmoneyno(String conmoneyno) {
		this.conmoneyno = conmoneyno;
	}

	public String getConttreetype() {
		return conttreetype;
	}

	public void setConttreetype(String conttreetype) {
		this.conttreetype = conttreetype;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public Long getFinished() {
		return finished;
	}

	public void setFinished(Long finished) {
		this.finished = finished;
	}

	public String getInSubUids() {
		return inSubUids;
	}

	public void setInSubUids(String inSubUids) {
		this.inSubUids = inSubUids;
	}

	public String getEquType() {
		return equType;
	}

	public void setEquType(String equType) {
		this.equType = equType;
	}

}