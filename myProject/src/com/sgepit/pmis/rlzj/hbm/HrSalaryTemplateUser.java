package com.sgepit.pmis.rlzj.hbm;

/**
 * HrSalaryTemplateUser entity. @author MyEclipse Persistence Tools
 */

public class HrSalaryTemplateUser implements java.io.Serializable {

	// Fields
	
	private HrManInfo manInfo;

	private String uids;
	private String templateId;
	private String userid;

	// Constructors

	/** default constructor */
	public HrSalaryTemplateUser() {
	}

	/** full constructor */
	public HrSalaryTemplateUser(String templateId, String userid) {
		this.templateId = templateId;
		this.userid = userid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTemplateId() {
		return this.templateId;
	}

	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public HrManInfo getManInfo() {
		return manInfo;
	}

	public void setManInfo(HrManInfo manInfo) {
		this.manInfo = manInfo;
	}

}