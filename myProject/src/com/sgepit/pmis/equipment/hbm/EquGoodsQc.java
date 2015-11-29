package com.sgepit.pmis.equipment.hbm;

public class EquGoodsQc implements java.io.Serializable{
	private String uids;
	private String pid;
	private String treeId;
	private String equNo;
	private String equName;
	private String kksNo;
	private String ggxh;
	private String equMake;
	private String remark;
	public EquGoodsQc() {
	}

	public EquGoodsQc(String uids, String pid, String treeId, String equNo,
			String equName, String kksNo, String ggxh, String equMake,String remark) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.treeId = treeId;
		this.equNo = equNo;
		this.equName = equName;
		this.kksNo = kksNo;
		this.ggxh = ggxh;
		this.equMake = equMake;
		this.remark = remark;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getTreeId() {
		return treeId;
	}

	public void setTreeId(String treeId) {
		this.treeId = treeId;
	}

	public String getEquNo() {
		return equNo;
	}

	public void setEquNo(String equNo) {
		this.equNo = equNo;
	}

	public String getEquName() {
		return equName;
	}

	public void setEquName(String equName) {
		this.equName = equName;
	}

	public String getKksNo() {
		return kksNo;
	}

	public void setKksNo(String kksNo) {
		this.kksNo = kksNo;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getEquMake() {
		return equMake;
	}

	public void setEquMake(String equMake) {
		this.equMake = equMake;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
}
