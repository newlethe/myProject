package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

public class WzGoodsStoreinView implements java.io.Serializable {

	private String uids;
	private String conno;
	private String conmoneyno;
	private String warehouseNo;
	private Date warehouseDate;
    private String partyb;
    private String invoiceno;
    private String waretype;
    private String wareno;
    private String type;
    
    public WzGoodsStoreinView() {
		super();
	}
    
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getConno() {
		return conno;
	}
	public void setConno(String conno) {
		this.conno = conno;
	}
	public String getConmoneyno() {
		return conmoneyno;
	}
	public void setConmoneyno(String conmoneyno) {
		this.conmoneyno = conmoneyno;
	}
	public String getWarehouseNo() {
		return warehouseNo;
	}
	public void setWarehouseNo(String warehouseNo) {
		this.warehouseNo = warehouseNo;
	}
	public Date getWarehouseDate() {
		return warehouseDate;
	}
	public void setWarehouseDate(Date warehouseDate) {
		this.warehouseDate = warehouseDate;
	}
	public String getPartyb() {
		return partyb;
	}
	public void setPartyb(String partyb) {
		this.partyb = partyb;
	}
	public String getInvoiceno() {
		return invoiceno;
	}
	public void setInvoiceno(String invoiceno) {
		this.invoiceno = invoiceno;
	}
	public String getWaretype() {
		return waretype;
	}
	public void setWaretype(String waretype) {
		this.waretype = waretype;
	}
	public String getWareno() {
		return wareno;
	}
	public void setWareno(String wareno) {
		this.wareno = wareno;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
