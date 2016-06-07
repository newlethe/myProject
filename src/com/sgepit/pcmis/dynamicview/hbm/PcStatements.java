package com.sgepit.pcmis.dynamicview.hbm;

import java.util.Date;

//月报通用类
public class PcStatements {

	// grid展示列
	private String uids;           
	private String pid;
	private String sjType;
	private String createperson;
	private Date createDate;
	private String title;
	private String unitUsername;
	private String countUsername;
	private String createpersonTel;
	private String memo;
	private Long reportStatus;
	private String tableName;  //报表记录对应数据库表名称
	
	// Constructors

	/** default constructor */
	public PcStatements() {
	}

	/** full constructor */
	public PcStatements(String uids, String pid, String sjType, String createperson, Date createDate, String title, 
						String unitUsername, String countUsername, String createpersonTel, String memo,
						Long reportStatus, String tableName)
	{
		this.uids = uids;
		this.pid = pid;
		this.sjType = sjType;
		this.createperson = createperson;
		this.createDate = createDate;
		this.title = title;
		this.unitUsername = unitUsername;
		this.countUsername = countUsername;
		this.createpersonTel = createpersonTel;
		this.memo = memo;
		this.reportStatus = reportStatus;
		this.tableName = tableName;
	}

	public String getCreateperson() {
		return createperson;
	}

	public void setCreateperson(String createperson) {
		this.createperson = createperson;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Long getReportStatus() {
		return reportStatus;
	}

	public void setReportStatus(Long reportStatus) {
		this.reportStatus = reportStatus;
	}

	public String getSjType() {
		return sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getUnitUsername() {
		return unitUsername;
	}

	public void setUnitUsername(String unitUsername) {
		this.unitUsername = unitUsername;
	}

	public String getCountUsername() {
		return countUsername;
	}

	public void setCountUsername(String countUsername) {
		this.countUsername = countUsername;
	}

	public String getCreatepersonTel() {
		return createpersonTel;
	}

	public void setCreatepersonTel(String createpersonTel) {
		this.createpersonTel = createpersonTel;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}
}
