package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

public class EquGoodsBodys implements java.io.Serializable {
	/**
	 * 
	 */
	private String uids;
	private String equNo;
	private String equName;
	private String equParts;
	private String pid;
	private String conid;
	private String treeUids;
	private Date createDate;
	private String remark;
	private String ggxh;
	private String estimateNo;
	
	//总金额
	private Double totalMoney;
	//主体设备被选择之后不允许修改删除
	private String delOrUpdate;

	public EquGoodsBodys() {
	}

	public EquGoodsBodys(String uids, String pid, String equNo, String equName,
			String equParts, String treeUids, String conid, String remark,
			Date createDate,String ggxh,String estimateNo,Double totalMoney,
			String delOrUpdate) {
		this.uids = uids;
		this.pid = pid;
		this.equNo = equNo;
		this.equName = equName;
		this.equParts = equParts;
		this.conid = conid;
		this.treeUids = treeUids;
		this.remark = remark;
		this.createDate = createDate;
		this.ggxh = ggxh;
		this.estimateNo = estimateNo;
		this.totalMoney = totalMoney;
		this.delOrUpdate = delOrUpdate;
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

	public String getEquParts() {
		return equParts;
	}

	public void setEquParts(String equParts) {
		this.equParts = equParts;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getTreeUids() {
		return treeUids;
	}

	public void setTreeUids(String treeUids) {
		this.treeUids = treeUids;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getEstimateNo() {
		return estimateNo;
	}

	public void setEstimateNo(String estimateNo) {
		this.estimateNo = estimateNo;
	}

	public Double getTotalMoney() {
		return totalMoney;
	}

	public void setTotalMoney(Double totalMoney) {
		this.totalMoney = totalMoney;
	}

	public String getDelOrUpdate() {
		return delOrUpdate;
	}

	public void setDelOrUpdate(String delOrUpdate) {
		this.delOrUpdate = delOrUpdate;
	}

}
