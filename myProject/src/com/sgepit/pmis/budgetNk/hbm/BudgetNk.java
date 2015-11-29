package com.sgepit.pmis.budgetNk.hbm;

/**
 * 内控概算实体
 * @author Yin
 *
 */
public class BudgetNk {
	
	//主键
	private String bdgid;
	//项目工程编号
	private String pid;
	//概算编号
	private String bdgNo;
	//概算名称
	private String bdgName;
	//是否工程量
	private Boolean hasBdgAmount;
	//概算金额
	private Double bdgMoney;
	//材料金额
	private Double matMoney;
	//建筑金额
	private Double buildMoney;
	//设备安装金额
	private Double equMoney;
	//是否为叶子节点
	private Boolean isLeaf;
	//父节点ID
	private String parent;
	//分摊总金额
	private Double totalMoney;
	//对应的概算项目（工程项目定义）
	private String correspondBdg;
	//是否竣工
	private Boolean isFinish;
	//是否稽核
	private Boolean isAudit;
	//稽核编号
	private String auditNo;
	//稽核主键
	private String auditId;
	//固定资产编号
	private String assetNo;
	//包含子节点的总金额
	private Double bdgMoneySum;
	public String getBdgid() {
		return bdgid;
	}
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getBdgNo() {
		return bdgNo;
	}
	public void setBdgNo(String bdgNo) {
		this.bdgNo = bdgNo;
	}
	public String getBdgName() {
		return bdgName;
	}
	public void setBdgName(String bdgName) {
		this.bdgName = bdgName;
	}
	public Boolean getHasBdgAmount() {
		return hasBdgAmount;
	}
	public void setHasBdgAmount(Boolean hasBdgAmount) {
		this.hasBdgAmount = hasBdgAmount;
	}
	public Double getBdgMoney() {
		return bdgMoney;
	}
	public void setBdgMoney(Double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}
	public Double getMatMoney() {
		return matMoney;
	}
	public void setMatMoney(Double matMoney) {
		this.matMoney = matMoney;
	}
	public Double getBuildMoney() {
		return buildMoney;
	}
	public void setBuildMoney(Double buildMoney) {
		this.buildMoney = buildMoney;
	}
	public Double getEquMoney() {
		return equMoney;
	}
	public void setEquMoney(Double equMoney) {
		this.equMoney = equMoney;
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
	public Double getTotalMoney() {
		return totalMoney;
	}
	public void setTotalMoney(Double totalMoney) {
		this.totalMoney = totalMoney;
	}
	public String getCorrespondBdg() {
		return correspondBdg;
	}
	public void setCorrespondBdg(String correspondBdg) {
		this.correspondBdg = correspondBdg;
	}
	public Boolean getIsFinish() {
		return isFinish;
	}
	public void setIsFinish(Boolean isFinish) {
		this.isFinish = isFinish;
	}
	public Boolean getIsAudit() {
		return isAudit;
	}
	public void setIsAudit(Boolean isAudit) {
		this.isAudit = isAudit;
	}
	public String getAuditNo() {
		return auditNo;
	}
	public void setAuditNo(String auditNo) {
		this.auditNo = auditNo;
	}
	public String getAuditId() {
		return auditId;
	}
	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}
	public String getAssetNo() {
		return assetNo;
	}
	public void setAssetNo(String assetNo) {
		this.assetNo = assetNo;
	}
	public Double getBdgMoneySum() {
		return bdgMoneySum;
	}
	public void setBdgMoneySum(Double bdgMoneySum) {
		this.bdgMoneySum = bdgMoneySum;
	}
	
}