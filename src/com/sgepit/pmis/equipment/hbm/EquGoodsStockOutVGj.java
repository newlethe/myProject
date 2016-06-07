package com.sgepit.pmis.equipment.hbm;
/**
 * 国金设备出库打印
 */
import java.util.Date;

public class EquGoodsStockOutVGj implements java.io.Serializable{
	private String uids;
	private String conno;
	private String conname;
	private String outNo;
	private Date outDate;
	private String unitName;
	private String bdgName;
	private String proUse;
	
	public EquGoodsStockOutVGj() {
		super();
	}
	
	public EquGoodsStockOutVGj(String uids, String conno, String conname,
			String outNo, Date outDate, String unitName, String bdgName,
			String proUse) {
		super();
		this.uids = uids;
		this.conno = conno;
		this.conname = conname;
		this.outNo = outNo;
		this.outDate = outDate;
		this.unitName = unitName;
		this.bdgName = bdgName;
		this.proUse = proUse;
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

	public String getOutNo() {
		return outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public Date getOutDate() {
		return outDate;
	}

	public void setOutDate(Date outDate) {
		this.outDate = outDate;
	}

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public String getBdgName() {
		return bdgName;
	}

	public void setBdgName(String bdgName) {
		this.bdgName = bdgName;
	}

	public String getProUse() {
		return proUse;
	}

	public void setProUse(String proUse) {
		this.proUse = proUse;
	}
}
