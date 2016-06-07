package com.sgepit.frame.xgridTemplet.hbm;

/**
 * SgprjPropertyCode entity. @author MyEclipse Persistence Tools
 */

public class SgprjPropertyCode implements java.io.Serializable {

	// Fields

	private String codeSn;
	private String codeId;
	private String codeType;
	private String codeTable;
	private String codeCol;
	private String codeColtype;
	private String codeNote;
	private String sjTran;
	private String orderId;
	private String note;
	private String modelType;

	// Constructors

	/** default constructor */
	public SgprjPropertyCode() {
	}

	/** minimal constructor */
	public SgprjPropertyCode(String codeSn) {
		this.codeSn = codeSn;
	}

	/** full constructor */
	public SgprjPropertyCode(String codeSn, String codeId, String codeType,
			String codeTable, String codeCol, String codeColtype,
			String codeNote, String sjTran, String orderId, String note,
			String modelType) {
		this.codeSn = codeSn;
		this.codeId = codeId;
		this.codeType = codeType;
		this.codeTable = codeTable;
		this.codeCol = codeCol;
		this.codeColtype = codeColtype;
		this.codeNote = codeNote;
		this.sjTran = sjTran;
		this.orderId = orderId;
		this.note = note;
		this.modelType = modelType;
	}

	// Property accessors

	public String getCodeSn() {
		return this.codeSn;
	}

	public void setCodeSn(String codeSn) {
		this.codeSn = codeSn;
	}

	public String getCodeId() {
		return this.codeId;
	}

	public void setCodeId(String codeId) {
		this.codeId = codeId;
	}

	public String getCodeType() {
		return this.codeType;
	}

	public void setCodeType(String codeType) {
		this.codeType = codeType;
	}

	public String getCodeTable() {
		return this.codeTable;
	}

	public void setCodeTable(String codeTable) {
		this.codeTable = codeTable;
	}

	public String getCodeCol() {
		return this.codeCol;
	}

	public void setCodeCol(String codeCol) {
		this.codeCol = codeCol;
	}

	public String getCodeColtype() {
		return this.codeColtype;
	}

	public void setCodeColtype(String codeColtype) {
		this.codeColtype = codeColtype;
	}

	public String getCodeNote() {
		return this.codeNote;
	}

	public void setCodeNote(String codeNote) {
		this.codeNote = codeNote;
	}

	public String getSjTran() {
		return this.sjTran;
	}

	public void setSjTran(String sjTran) {
		this.sjTran = sjTran;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getNote() {
		return this.note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getModelType() {
		return this.modelType;
	}

	public void setModelType(String modelType) {
		this.modelType = modelType;
	}

}