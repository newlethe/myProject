package com.sgepit.frame.dataexchange.hbm;

import java.util.Date;

/**
 * PcDataExchange entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcDataExchange implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String tableName;
	private String keyValue;
	private String blobCol;
	private String txGroup;
	private Long xh;
	private String successFlag;
	private Date successDate;
	private String spareC1;
	private String spareC2;
	private String spareC3;
	private String spareC4;
	private String spareC5;
	private Date spareD1;
	private Date spareD2;
	private Date spareD3;
	private Double spareN1;
	private Double spareN2;
	private Double spareN3;
	
	private String sqlData;
	private String clobCol;
	private String bizInfo;

	// Constructors

	public String getSqlData() {
		return sqlData;
	}

	public void setSqlData(String sqlData) {
		this.sqlData = sqlData;
	}

	public String getClobCol() {
		return clobCol;
	}

	public void setClobCol(String clobCol) {
		this.clobCol = clobCol;
	}

	public String getBizInfo() {
		return bizInfo;
	}

	public void setBizInfo(String bizInfo) {
		this.bizInfo = bizInfo;
	}

	/** default constructor */
	public PcDataExchange() {
	}

	/** minimal constructor */
	public PcDataExchange(String pid, String tableName, String keyValue,
			String successFlag) {
		this.pid = pid;
		this.tableName = tableName;
		this.keyValue = keyValue;
		this.successFlag = successFlag;
	}

	/** full constructor */
	public PcDataExchange(String pid, String tableName, String keyValue,
			String blobCol, String txGroup, Long xh, String successFlag,
			Date successDate, String spareC1, String spareC2, String spareC3,
			String spareC4, String spareC5, Date spareD1, Date spareD2,
			Date spareD3, Double spareN1, Double spareN2, Double spareN3) {
		this.pid = pid;
		this.tableName = tableName;
		this.keyValue = keyValue;
		this.blobCol = blobCol;
		this.txGroup = txGroup;
		this.xh = xh;
		this.successFlag = successFlag;
		this.successDate = successDate;
		this.spareC1 = spareC1;
		this.spareC2 = spareC2;
		this.spareC3 = spareC3;
		this.spareC4 = spareC4;
		this.spareC5 = spareC5;
		this.spareD1 = spareD1;
		this.spareD2 = spareD2;
		this.spareD3 = spareD3;
		this.spareN1 = spareN1;
		this.spareN2 = spareN2;
		this.spareN3 = spareN3;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getTableName() {
		return this.tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getKeyValue() {
		return this.keyValue;
	}

	public void setKeyValue(String keyValue) {
		this.keyValue = keyValue;
	}

	public String getBlobCol() {
		return this.blobCol;
	}

	public void setBlobCol(String blobCol) {
		this.blobCol = blobCol;
	}

	public String getTxGroup() {
		return this.txGroup;
	}

	public void setTxGroup(String txGroup) {
		this.txGroup = txGroup;
	}

	public Long getXh() {
		return this.xh;
	}

	public void setXh(Long xh) {
		this.xh = xh;
	}

	public String getSuccessFlag() {
		return this.successFlag;
	}

	public void setSuccessFlag(String successFlag) {
		this.successFlag = successFlag;
	}

	public Date getSuccessDate() {
		return this.successDate;
	}

	public void setSuccessDate(Date successDate) {
		this.successDate = successDate;
	}

	public String getSpareC1() {
		return this.spareC1;
	}

	public void setSpareC1(String spareC1) {
		this.spareC1 = spareC1;
	}

	public String getSpareC2() {
		return this.spareC2;
	}

	public void setSpareC2(String spareC2) {
		this.spareC2 = spareC2;
	}

	public String getSpareC3() {
		return this.spareC3;
	}

	public void setSpareC3(String spareC3) {
		this.spareC3 = spareC3;
	}

	public String getSpareC4() {
		return this.spareC4;
	}

	public void setSpareC4(String spareC4) {
		this.spareC4 = spareC4;
	}

	public String getSpareC5() {
		return this.spareC5;
	}

	public void setSpareC5(String spareC5) {
		this.spareC5 = spareC5;
	}

	public Date getSpareD1() {
		return this.spareD1;
	}

	public void setSpareD1(Date spareD1) {
		this.spareD1 = spareD1;
	}

	public Date getSpareD2() {
		return this.spareD2;
	}

	public void setSpareD2(Date spareD2) {
		this.spareD2 = spareD2;
	}

	public Date getSpareD3() {
		return this.spareD3;
	}

	public void setSpareD3(Date spareD3) {
		this.spareD3 = spareD3;
	}

	public Double getSpareN1() {
		return this.spareN1;
	}

	public void setSpareN1(Double spareN1) {
		this.spareN1 = spareN1;
	}

	public Double getSpareN2() {
		return this.spareN2;
	}

	public void setSpareN2(Double spareN2) {
		this.spareN2 = spareN2;
	}

	public Double getSpareN3() {
		return this.spareN3;
	}

	public void setSpareN3(Double spareN3) {
		this.spareN3 = spareN3;
	}

	
}