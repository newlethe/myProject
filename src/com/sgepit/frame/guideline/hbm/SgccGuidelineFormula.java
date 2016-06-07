package com.sgepit.frame.guideline.hbm;


/**
 * SgccGuidelineInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccGuidelineFormula implements java.io.Serializable {

	// Fields
	private String id;
	private String zbSeqno;
	private String formulaType;
	private Integer decimalDigits;
	private String increaseDesc;
	private String increaseSuffix;
	private String depressDesc;
	private String depressSuffix;
	private String equalDesc;
	private String jldw;
	private String accountType;
	
	// Constructors

	/** default constructor */
	public SgccGuidelineFormula() {
	}

	/** minimal constructor */
	public SgccGuidelineFormula(String id) {
		this.id = id;
	}

	/** full constructor */
	public SgccGuidelineFormula(String id,String zbSeqno,String formulaType,Integer decimalDigits,
			String increaseDesc,String increaseSuffix,String depressDesc,String depressSuffix,
			String equalDesc,String jldw,String accountType) {
		this.id=id;
		this.zbSeqno=zbSeqno;
		this.formulaType=formulaType;
		this.decimalDigits=decimalDigits;
		this.increaseDesc=increaseDesc;
		this.increaseSuffix = increaseSuffix;
		this.depressDesc=depressDesc;
		this.depressSuffix = depressSuffix;
		this.equalDesc=equalDesc;
		this.jldw=jldw;
		this.accountType=accountType;
	
	}

	// Property accessors

	public String getZbSeqno() {
		return this.zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}


	/**
	 * @return the formulaType
	 */
	public String getFormulaType() {
		return formulaType;
	}

	/**
	 * @param formulaType the formulaType to set
	 */
	public void setFormulaType(String formulaType) {
		this.formulaType = formulaType;
	}

	/**
	 * @return the decimalDigits
	 */
	public Integer getDecimalDigits() {
		return decimalDigits;
	}

	/**
	 * @param decimalDigits the decimalDigits to set
	 */
	public void setDecimalDigits(Integer decimalDigits) {
		this.decimalDigits = decimalDigits;
	}

	/**
	 * @return the increaseDesc
	 */
	public String getIncreaseDesc() {
		return increaseDesc;
	}

	/**
	 * @param increaseDesc the increaseDesc to set
	 */
	public void setIncreaseDesc(String increaseDesc) {
		this.increaseDesc = increaseDesc;
	}

	/**
	 * @return the depressDesc
	 */
	public String getDepressDesc() {
		return depressDesc;
	}

	/**
	 * @param depressDesc the depressDesc to set
	 */
	public void setDepressDesc(String depressDesc) {
		this.depressDesc = depressDesc;
	}

	/**
	 * @return the equalDesc
	 */
	public String getEqualDesc() {
		return equalDesc;
	}

	/**
	 * @param equalDesc the equalDesc to set
	 */
	public void setEqualDesc(String equalDesc) {
		this.equalDesc = equalDesc;
	}

	/**
	 * @return the jldw
	 */
	public String getJldw() {
		return jldw;
	}

	/**
	 * @param jldw the jldw to set
	 */
	public void setJldw(String jldw) {
		this.jldw = jldw;
	}

	/**
	 * @return the accountType
	 */
	public String getAccountType() {
		return accountType;
	}

	/**
	 * @param accountType the accountType to set
	 */
	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	/**
	 * @return the increaseSuffix
	 */
	public String getIncreaseSuffix() {
		return increaseSuffix;
	}

	/**
	 * @param increaseSuffix the increaseSuffix to set
	 */
	public void setIncreaseSuffix(String increaseSuffix) {
		this.increaseSuffix = increaseSuffix;
	}

	/**
	 * @return the depressSuffix
	 */
	public String getDepressSuffix() {
		return depressSuffix;
	}

	/**
	 * @param depressSuffix the depressSuffix to set
	 */
	public void setDepressSuffix(String depressSuffix) {
		this.depressSuffix = depressSuffix;
	}


}