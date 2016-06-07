package com.sgepit.pcmis.approvl.hbm;

/**
 * PcPwSortTreeSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcPwSortTreeSub implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String classifyName;
	private String classfiyNo;
	private String lastOperator;
	private String memo;
	private Long leaf;
	private String industryType;
	private String parentid;
	private String pwLevel;
	private String unitid;
	private String classfiyNoPre;

	// Constructors

	/** default constructor */
	public PcPwSortTreeSub() {
	}

	/** minimal constructor */
	public PcPwSortTreeSub(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public PcPwSortTreeSub(String uids, String pid, String classifyName,
			String classfiyNo, String lastOperator, String memo, Long leaf,
			String industryType, String parentid, String pwLevel,
			String unitid, String classfiyNoPre) {
		this.uids = uids;
		this.pid = pid;
		this.classifyName = classifyName;
		this.classfiyNo = classfiyNo;
		this.lastOperator = lastOperator;
		this.memo = memo;
		this.leaf = leaf;
		this.industryType = industryType;
		this.parentid = parentid;
		this.pwLevel = pwLevel;
		this.unitid = unitid;
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

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getPwLevel() {
		return this.pwLevel;
	}

	public void setPwLevel(String pwLevel) {
		this.pwLevel = pwLevel;
	}

	public String getUnitid() {
		return this.unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

	public String getClassfiyNoPre() {
		return classfiyNoPre;
	}

	public void setClassfiyNoPre(String classfiyNoPre) {
		this.classfiyNoPre = classfiyNoPre;
	}
}