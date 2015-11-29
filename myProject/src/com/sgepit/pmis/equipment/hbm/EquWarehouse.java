package com.sgepit.pmis.equipment.hbm;

public class EquWarehouse {

	private String pid;
	private String uids;
	private String equid;
	private String equno;
	private String detailed;
	private String memo;
	private Long isleaf;
	private String parent;

	private String waretype;
	private String waretypecode;
	private String wareno;
	private String warenocode;
	
	public EquWarehouse() {
	}

	public EquWarehouse(String pid, String uids, String equid, String equno,
			String detailed, String memo, Long isleaf, String parent,String waretype,
			String waretypecode,String wareno,String warenocode) {
		this.pid = pid;
		this.uids = uids;
		this.equid = equid;
		this.equno = equno;
		this.detailed = detailed;
		this.memo = memo;
		this.isleaf = isleaf;
		this.parent = parent;
		this.waretype = waretype;
		this.waretypecode = waretypecode;
		this.wareno = wareno;
		this.warenocode = warenocode;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getEquid() {
		return equid;
	}

	public void setEquid(String equid) {
		this.equid = equid;
	}

	public String getEquno() {
		return equno;
	}

	public void setEquno(String equno) {
		this.equno = equno;
	}

	public String getDetailed() {
		return detailed;
	}

	public void setDetailed(String detailed) {
		this.detailed = detailed;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getWaretype() {
		return waretype;
	}

	public void setWaretype(String waretype) {
		this.waretype = waretype;
	}

	public String getWaretypecode() {
		return waretypecode;
	}

	public void setWaretypecode(String waretypecode) {
		this.waretypecode = waretypecode;
	}

	public String getWareno() {
		return wareno;
	}

	public void setWareno(String wareno) {
		this.wareno = wareno;
	}

	public String getWarenocode() {
		return warenocode;
	}

	public void setWarenocode(String warenocode) {
		this.warenocode = warenocode;
	}

}
