package com.sgepit.pmis.contract.hbm;

/**
 * ConAccinfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConAccinfo implements java.io.Serializable {

	// Fields

	private String accid;
	private String pid;
	private String expression;
	private Double expvalue;
	private String conid;
	private String seq;
	private String payid;

	// Constructors

	/** default constructor */
	public ConAccinfo() {
	}

	/** minimal constructor */
	public ConAccinfo(String accid, String pid, String conid, String payid) {
		this.accid = accid;
		this.pid = pid;
		this.conid = conid;
		this.payid = payid;
	}

	/** full constructor */
	public ConAccinfo(String accid, String pid, String expression,
			Double expvalue, String conid, String seq, String payid) {
		this.accid = accid;
		this.pid = pid;
		this.expression = expression;
		this.expvalue = expvalue;
		this.conid = conid;
		this.seq = seq;
		this.payid = payid;
	}

	// Property accessors

	public String getAccid() {
		return this.accid;
	}

	public void setAccid(String accid) {
		this.accid = accid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getExpression() {
		return this.expression;
	}

	public void setExpression(String expression) {
		this.expression = expression;
	}

	public Double getExpvalue() {
		return this.expvalue;
	}

	public void setExpvalue(Double expvalue) {
		this.expvalue = expvalue;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getSeq() {
		return this.seq;
	}

	public void setSeq(String seq) {
		this.seq = seq;
	}

	public String getPayid() {
		return payid;
	}

	public void setPayid(String payid) {
		this.payid = payid;
	}

}