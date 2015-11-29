package com.sgepit.pcmis.approvl.hbm;

/**
 * PcPwSortTree entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcPwSortTree implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String classifyName;
	private String classfiyNo;
	private String lastOperator;
	private String memo;
	private Long leaf;
	private String unitid;
	private String industryType;
	private String parentid;
	private String pwLevel;
	private String classfiyNoPre;

	// Constructors

	public String getClassfiyNoPre() {
		return classfiyNoPre;
	}

	public void setClassfiyNoPre(String classfiyNoPre) {
		this.classfiyNoPre = classfiyNoPre;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	/** default constructor */
	public PcPwSortTree() {
	}

	/** minimal constructor */
	public PcPwSortTree(String uids, String industryType) {
		this.uids = uids;
		this.industryType = industryType;
	}

	/** full constructor */
	public PcPwSortTree(String uids, String pid, String classifyName,
			String classfiyNo, String lastOperator, String memo, Long leaf,
			String industryType, String parentid, String classfiyNoPre) {
		this.uids = uids;
		this.pid = pid;
		this.classifyName = classifyName;
		this.classfiyNo = classfiyNo;
		this.lastOperator = lastOperator;
		this.memo = memo;
		this.leaf = leaf;
		this.industryType = industryType;
		this.parentid = parentid;
		this.classfiyNoPre = classfiyNoPre;
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

	public String getClassifyName() {
		return this.classifyName;
	}

	public void setClassifyName(String classifyName) {
		this.classifyName = classifyName;
	}

	public String getClassfiyNo() {
		return this.classfiyNo;
	}

	public void setClassfiyNo(String classfiyNo) {
		this.classfiyNo = classfiyNo;
	}

	public String getLastOperator() {
		return this.lastOperator;
	}

	public void setLastOperator(String lastOperator) {
		this.lastOperator = lastOperator;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Long getLeaf() {
		return this.leaf;
	}

	public void setLeaf(Long leaf) {
		this.leaf = leaf;
	}

	public String getIndustryType() {
		return this.industryType;
	}

	public void setIndustryType(String industryType) {
		this.industryType = industryType;
	}

	public String getPwLevel() {
		return pwLevel;
	}

	public void setPwLevel(String pwLevel) {
		this.pwLevel = pwLevel;
	}

	public String getUnitid() {
		return unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

}