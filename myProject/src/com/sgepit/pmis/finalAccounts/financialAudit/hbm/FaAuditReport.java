package com.sgepit.pmis.finalAccounts.financialAudit.hbm;

public class FaAuditReport implements java.io.Serializable {

	// Fields

	public String uids;
	public String pid;
	public String assetsNo;
	public String auditId;
	public String remark;
	
	public String mainFlag;
	

	private String auditNo;
	
	private String sourceNo;
	
	// extend
	public String assetsName;	//资产分类名称
	
	/**
	 * @return the assetsName
	 */
	public String getAssetsName() {
		return assetsName;
	}
	/**
	 * @param assetsName the assetsName to set
	 */
	public void setAssetsName(String assetsName) {
		this.assetsName = assetsName;
	}
	public String getAuditNo() {
		return auditNo;
	}
	public void setAuditNo(String auditNo) {
		this.auditNo = auditNo;
	}
	public String getSourceNo() {
		return sourceNo;
	}
	public void setSourceNo(String sourceNo) {
		this.sourceNo = sourceNo;
	}
	public String getMainFlag() {
		return mainFlag;
	}
	public void setMainFlag(String mainFlag) {
		this.mainFlag = mainFlag;
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
	public String getAssetsNo() {
		return assetsNo;
	}
	public void setAssetsNo(String assetsNo) {
		this.assetsNo = assetsNo;
	}
	public String getAuditId() {
		return auditId;
	}
	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
}