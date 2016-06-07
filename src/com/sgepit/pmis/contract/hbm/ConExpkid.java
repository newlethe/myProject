package com.sgepit.pmis.contract.hbm;

/**
 * ConExpkid entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConExpkid implements java.io.Serializable {

	// Fields

	private String kidid;
	private String pid;
	private String expression;
	private String expsign;
	private String expid;

	// Constructors

	/** default constructor */
	public ConExpkid() {
	}

	/** minimal constructor */
	public ConExpkid(String kidid, String pid, String expid) {
		this.kidid = kidid;
		this.pid = pid;
		this.expid = expid;
	}

	/** full constructor */
	public ConExpkid(String kidid, String pid, String expression,
			String expsign, String expid) {
		this.kidid = kidid;
		this.pid = pid;
		this.expression = expression;
		this.expsign = expsign;
		this.expid = expid;
	}

	// Property accessors

	public String getKidid() {
		return this.kidid;
	}

	public void setKidid(String kidid) {
		this.kidid = kidid;
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

	public String getExpsign() {
		return this.expsign;
	}

	public void setExpsign(String expsign) {
		this.expsign = expsign;
	}

	public String getExpid() {
		return this.expid;
	}

	public void setExpid(String expid) {
		this.expid = expid;
	}

}