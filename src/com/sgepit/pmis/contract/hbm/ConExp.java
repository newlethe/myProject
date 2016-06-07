package com.sgepit.pmis.contract.hbm;

/**
 * ConExp entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConExp implements java.io.Serializable {

	// Fields

	private String expid;
	private String pid;
	private String conmodel;

	// Constructors

	/** default constructor */
	public ConExp() {
	}

	/** minimal constructor */
	public ConExp(String expid, String pid) {
		this.expid = expid;
		this.pid = pid;
	}

	/** full constructor */
	public ConExp(String expid, String pid, String conmodel) {
		this.expid = expid;
		this.pid = pid;
		this.conmodel = conmodel;
	}

	// Property accessors

	public String getExpid() {
		return this.expid;
	}

	public void setExpid(String expid) {
		this.expid = expid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConmodel() {
		return this.conmodel;
	}

	public void setConmodel(String conmodel) {
		this.conmodel = conmodel;
	}

}