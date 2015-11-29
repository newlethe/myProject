package com.sgepit.pmis.rlzj.hbm;

/**
 * HrSalaryType entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrSalaryType implements java.io.Serializable {

	// Fields

	private String uids;
	private String code;
	private String name;
	private String sendType;
	private String state;

	// Constructors

	/** default constructor */
	public HrSalaryType() {
	}

	/** full constructor */
	public HrSalaryType(String uids, String code, String name, String sendType,
			String state) {
		this.uids = uids;
		this.code = code;
		this.name = name;
		this.sendType = sendType;
		this.state = state;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSendType() {
		return this.sendType;
	}

	public void setSendType(String sendType) {
		this.sendType = sendType;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

}