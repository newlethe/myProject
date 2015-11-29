package com.sgepit.pmis.finalAccounts.complete.hbm;

/**
 * FacompFixedWzoutView entity. @author MyEclipse Persistence Tools
 */

public class FacompFixedWzoutView implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String outId;
	private String outuids;
	private String equPartName;
	private String boxNo;
	private String using;
	private String recipientsUnit;
	private String unit;
	private Double price;
	private Double outNum;
	private String auditState;
	private String conid;
	private String fixeduids;
	private Double usenum;
	private Double usemoney;
	private String bdgidtype;

	// Constructors

	/** default constructor */
	public FacompFixedWzoutView() {
	}

	/** full constructor */
	public FacompFixedWzoutView(String pid, String outId, String equPartName,
			String boxNo, String using, String recipientsUnit, String unit,
			Double price, Double outNum, String auditState, String conid,
			String fixeduids, Double usenum, Double usemoney, String outuids,
			String bdgidtype) {
		super();
		this.pid = pid;
		this.outId = outId;
		this.equPartName = equPartName;
		this.boxNo = boxNo;
		this.using = using;
		this.recipientsUnit = recipientsUnit;
		this.unit = unit;
		this.price = price;
		this.outNum = outNum;
		this.auditState = auditState;
		this.conid = conid;
		this.fixeduids = fixeduids;
		this.usenum = usenum;
		this.usemoney = usemoney;
		this.outuids = outuids;
		this.bdgidtype = bdgidtype;
	}

	
	// Property accessors
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

	public String getOutId() {
		return outId;
	}

	public void setOutId(String outId) {
		this.outId = outId;
	}

	public String getEquPartName() {
		return equPartName;
	}

	public void setEquPartName(String equPartName) {
		this.equPartName = equPartName;
	}

	public String getBoxNo() {
		return boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getUsing() {
		return using;
	}

	public void setUsing(String using) {
		this.using = using;
	}

	public String getRecipientsUnit() {
		return recipientsUnit;
	}

	public void setRecipientsUnit(String recipientsUnit) {
		this.recipientsUnit = recipientsUnit;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getOutNum() {
		return outNum;
	}

	public void setOutNum(Double outNum) {
		this.outNum = outNum;
	}

	public String getAuditState() {
		return auditState;
	}

	public void setAuditState(String auditState) {
		this.auditState = auditState;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getFixeduids() {
		return fixeduids;
	}

	public void setFixeduids(String fixeduids) {
		this.fixeduids = fixeduids;
	}

	public Double getUsenum() {
		return usenum;
	}

	public void setUsenum(Double usenum) {
		this.usenum = usenum;
	}

	public Double getUsemoney() {
		return usemoney;
	}

	public void setUsemoney(Double usemoney) {
		this.usemoney = usemoney;
	}

	public String getOutuids() {
		return outuids;
	}

	public void setOutuids(String outuids) {
		this.outuids = outuids;
	}

	public String getBdgidtype() {
		return bdgidtype;
	}

	public void setBdgidtype(String bdgidtype) {
		this.bdgidtype = bdgidtype;
	}

}