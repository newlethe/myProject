package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

public class WzGoodsBodys implements java.io.Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
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
	private String judgmentFlag;
	
	//总金额
	private Double totalMoney;
	//入库选择了主体材料修改权限
	private String delOrUpdate;

	public WzGoodsBodys() {
	}

	public WzGoodsBodys(String uids, String pid, String equNo, String equName,
			String equParts, String treeUids, String conid, String remark,
			Date createDate,String ggxh,String estimateNo,String judgmentFlag,
			Double totalMoney,String delOrUpdate) {
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
		this.judgmentFlag = judgmentFlag;
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

	public String getJudgmentFlag() {
		return judgmentFlag;
	}

	public void setJudgmentFlag(String judgmentFlag) {
		this.judgmentFlag = judgmentFlag;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
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
