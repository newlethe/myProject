package com.sgepit.pmis.budgetNk.hbm;

/**
 * 合同分摊内控实体
 * @author Yin
 *
 */
public class BudgetMoneyAppNkView {
	private String appid;	//分摊主键
	private String pid;		//项目工程编号
	private String conid;	//内部流水号
	private Double realMoney;
	private Integer prosign;
	private Boolean isLeaf;
	private String parent;
	private String bdgid;
	private String remark;
	//视图增加列
	private String bdgName;	//概算名称
	private String bdgNo;
	private Double bdgMoney;
	private Double sumRealMoney; //分摊总金额
	
	public String getAppid() {
		return appid;
	}
	public void setAppid(String appid) {
		this.appid = appid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public Double getRealMoney() {
		return realMoney;
	}
	public void setRealMoney(Double realMoney) {
		this.realMoney = realMoney;
	}
	public Integer getProsign() {
		return prosign;
	}
	public void setProsign(Integer prosign) {
		this.prosign = prosign;
	}
	public Boolean getIsLeaf() {
		return isLeaf;
	}
	public void setIsLeaf(Boolean isLeaf) {
		this.isLeaf = isLeaf;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public String getBdgid() {
		return bdgid;
	}
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	public String getBdgName() {
		return bdgName;
	}
	public void setBdgName(String bdgName) {
		this.bdgName = bdgName;
	}
	public Double getSumRealMoney() {
		return sumRealMoney;
	}
	public void setSumRealMoney(Double sumRealMoney) {
		this.sumRealMoney = sumRealMoney;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getBdgNo() {
		return bdgNo;
	}
	public void setBdgNo(String bdgNo) {
		this.bdgNo = bdgNo;
	}
	public Double getBdgMoney() {
		return bdgMoney;
	}
	public void setBdgMoney(Double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}
	

}
