package com.sgepit.pmis.rlzj.hbm;

/**
 * HrSalaryTemplate entity. @author MyEclipse Persistence Tools
 */

public class HrSalaryTemplate implements java.io.Serializable {

	// Fields

	private String uids;
	private String templateName;
	private String sjType;
	private String salaryType;
	private String formula;
	private String xgridTitle;
	private String state;
	private String remark;
	private String templateDept;
	private String pid;

	// Constructors

	/** default constructor */
	public HrSalaryTemplate() {
	}

	/** minimal constructor */
	public HrSalaryTemplate(String templateName, String sjType,
			String salaryType, String xgridTitle, String state) {
		this.templateName = templateName;
		this.sjType = sjType;
		this.salaryType = salaryType;
		this.xgridTitle = xgridTitle;
		this.state = state;
	}

	/** full constructor */
	public HrSalaryTemplate(String templateName, String sjType,
			String salaryType, String formula, String xgridTitle, String state,
			String remark) {
		this.templateName = templateName;
		this.sjType = sjType;
		this.salaryType = salaryType;
		this.formula = formula;
		this.xgridTitle = xgridTitle;
		this.state = state;
		this.remark = remark;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTemplateName() {
		return this.templateName;
	}

	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getSalaryType() {
		return this.salaryType;
	}

	public void setSalaryType(String salaryType) {
		this.salaryType = salaryType;
	}

	public String getFormula() {
		return this.formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public String getXgridTitle() {
		return this.xgridTitle;
	}

	public void setXgridTitle(String xgridTitle) {
		this.xgridTitle = xgridTitle;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getTemplateDept() {
		return templateDept;
	}

	public void setTemplateDept(String templateDept) {
		this.templateDept = templateDept;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}