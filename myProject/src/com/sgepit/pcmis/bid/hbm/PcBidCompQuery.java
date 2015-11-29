package com.sgepit.pcmis.bid.hbm;

import java.util.Date;

//招投标汇总查询
public class PcBidCompQuery  implements java.io.Serializable {
	private String zbuids;//招标项目uids
	private String uids;//招标内容uids
    private String bidtype;//招标类型 
    private String bidcontent;//招标内容
    private Date bidstarttime;//开标时间
    private String tbuids;//投标单位及报价
    private String tbunit;//中标单位
    private Double bidprice;//招标价格
    private Double conprice;//合同价格
    private String bidfj;//招标文件
    private String bidassess;//评标报告
    private String bidway;//评标方法
    
    private Double conmoney;
    private Double conpay;
    private String conid;
    private String conno;
    private String conname;
    private Double bdgMoney;//概算金额
    public PcBidCompQuery(){
    	
    }
	public String getBidtype() {
		return bidtype;
	}
	public void setBidtype(String bidtype) {
		this.bidtype = bidtype;
	}
	public String getBidcontent() {
		return bidcontent;
	}
	public void setBidcontent(String bidcontent) {
		this.bidcontent = bidcontent;
	}
	public Date getBidstarttime() {
		return bidstarttime;
	}
	public void setBidstarttime(Date bidstarttime) {
		this.bidstarttime = bidstarttime;
	}
	public String getTbuids() {
		return tbuids;
	}
	public void setTbuids(String tbuids) {
		this.tbuids = tbuids;
	}
	public String getTbunit() {
		return tbunit;
	}
	public void setTbunit(String tbunit) {
		this.tbunit = tbunit;
	}
	public Double getBidprice() {
		return bidprice;
	}
	public void setBidprice(Double bidprice) {
		this.bidprice = bidprice;
	}
	public Double getConprice() {
		return conprice;
	}
	public void setConprice(Double conprice) {
		this.conprice = conprice;
	}
	public String getBidfj() {
		return bidfj;
	}
	public void setBidfj(String bidfj) {
		this.bidfj = bidfj;
	}
	public String getBidassess() {
		return bidassess;
	}
	public void setBidassess(String bidassess) {
		this.bidassess = bidassess;
	}
	public String getBidway() {
		return bidway;
	}
	public void setBidway(String bidway) {
		this.bidway = bidway;
	}
	public PcBidCompQuery(String bidtype, String bidcontent, Date bidstarttime,
			String tbuids, String tbunit, Double bidprice, Double conprice,
			String bidfj, String bidassess, String bidway,
			String conid,String conno,String conname,Double conmoney,Double conpay) {
		super();
		this.bidtype = bidtype;
		this.bidcontent = bidcontent;
		this.bidstarttime = bidstarttime;
		this.tbuids = tbuids;
		this.tbunit = tbunit;
		this.bidprice = bidprice;
		this.conprice = conprice;
		this.bidfj = bidfj;
		this.bidassess = bidassess;
		this.bidway = bidway;
		
		this.conid = conid;
		this.conno = conno;
		this.conname = conname;
		this.conmoney = conmoney;
		this.conpay = conpay;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getZbuids() {
		return zbuids;
	}
	public void setZbuids(String zbuids) {
		this.zbuids = zbuids;
	}
	public Double getConmoney() {
		return conmoney;
	}
	public void setConmoney(Double conmoney) {
		this.conmoney = conmoney;
	}
	public Double getConpay() {
		return conpay;
	}
	public void setConpay(Double conpay) {
		this.conpay = conpay;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public String getConno() {
		return conno;
	}
	public void setConno(String conno) {
		this.conno = conno;
	}
	public String getConname() {
		return conname;
	}
	public void setConname(String conname) {
		this.conname = conname;
	}
	public Double getBdgMoney() {
		return bdgMoney;
	}
	public void setBdgMoney(Double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}
	   
}
