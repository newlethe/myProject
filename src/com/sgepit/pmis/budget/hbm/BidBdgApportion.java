package com.sgepit.pmis.budget.hbm;

/**
 * @author tengri 说明：招标概算分摊实体
 */
public class BidBdgApportion {

	/**
	 * 主键id
	 */
	private String uids;
	/**
	 * 项目id
	 */
	private String pid;
	
	/**
	 * 招标申请主键
	 */
	private String zbUids;

	/**
	 * 招标内容id
	 */
	private String contentId;

	/**
	 * 概算主键id
	 */
	private String bdgId;

	/**
	 * 概算名称
	 */
	private String bdgName;

	/**
	 * 概算编号
	 */
	private String bdgNo;

	/**
	 * 概算金额
	 */
	private double bdgMoney;

	/**
	 * 父节点id
	 */
	private String parentId;

	/**
	 * 是否是子节点
	 */
	private Long isleaf;
	
	/**
	 * 本次计划概算金额
	 */
	private double  planBgMoney;
	
	/**
	 * 招标对应的概算金额
	 */
	private double zbgsMoney;
	
	public String getZbUids() {
		return zbUids;
	}

	public void setZbUids(String zbUids) {
		this.zbUids = zbUids;
	}

	public double getPlanBgMoney() {
		return planBgMoney;
	}

	public void setPlanBgMoney(double planBgMoney) {
		this.planBgMoney = planBgMoney;
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

	public String getContentId() {
		return contentId;
	}

	public void setContentId(String contentId) {
		this.contentId = contentId;
	}

	public String getBdgId() {
		return bdgId;
	}

	public void setBdgId(String bdgId) {
		this.bdgId = bdgId;
	}

	public String getBdgName() {
		return bdgName;
	}

	public void setBdgName(String bdgName) {
		this.bdgName = bdgName;
	}

	public String getBdgNo() {
		return bdgNo;
	}

	public void setBdgNo(String bdgNo) {
		this.bdgNo = bdgNo;
	}

	public double getBdgMoney() {
		return bdgMoney;
	}

	public void setBdgMoney(double bdgMoney) {
		this.bdgMoney = bdgMoney;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	
	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public double getZbgsMoney() {
		return zbgsMoney;
	}

	public void setZbgsMoney(double zbgsMoney) {
		this.zbgsMoney = zbgsMoney;
	}

	public BidBdgApportion() {
		super();
	}

}
