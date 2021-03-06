package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备入库单打印
 */
import java.util.Date;

public class EquGoodsStoreinVGj  implements java.io.Serializable{
	private String uids;
	private String conno;
	private String conname;
	private String warehouseNo;
	private Date warehouseDate;
    private String partyb;
    private String noticeNo;
    
	public EquGoodsStoreinVGj() {
		super();
	}

	public EquGoodsStoreinVGj(String uids, String conno, String conname,
			String warehouseNo, Date warehouseDate, String partyb) {
		super();
		this.uids = uids;
		this.conno = conno;
		this.conname = conname;
		this.warehouseNo = warehouseNo;
		this.warehouseDate = warehouseDate;
		this.partyb = partyb;
	}

	public EquGoodsStoreinVGj(String uids, String conno, String conname,
			String warehouseNo, Date warehouseDate, String partyb,
			String noticeNo) {
		super();
		this.uids = uids;
		this.conno = conno;
		this.conname = conname;
		this.warehouseNo = warehouseNo;
		this.warehouseDate = warehouseDate;
		this.partyb = partyb;
		this.noticeNo = noticeNo;
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

	public String getConname() {
		return conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
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

	public String getNoticeNo() {
		return noticeNo;
	}

	public void setNoticeNo(String noticeNo) {
		this.noticeNo = noticeNo;
	}
}
