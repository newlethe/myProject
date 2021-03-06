package com.sgepit.pmis.rlzj.hbm;

/**
 * HrSalaryTemplateViewId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrSalaryTemplateView implements java.io.Serializable {

	// Fields

	private String uids;
	private String templateName;
	private String sjType;
	private String salaryType;
	private String formula;
	private String state;
	private String itemId;
	private String xgridTitle;
	private String pid;
	private String templateDept;

	// Constructors

	/** default constructor */
	public HrSalaryTemplateView() {
	}

	/** minimal constructor */
	public HrSalaryTemplateView(String uids, String templateName,
			String sjType, String salaryType, String state) {
		this.uids = uids;
		this.templateName = templateName;
		this.sjType = sjType;
		this.salaryType = salaryType;
		this.state = state;
	}

	/** full constructor */
	public HrSalaryTemplateView(String uids, String templateName,
			String sjType, String salaryType, String formula, String state,
			String itemId, String xgridTitle) {
		this.uids = uids;
		this.templateName = templateName;
		this.sjType = sjType;
		this.salaryType = salaryType;
		this.formula = formula;
		this.state = state;
		this.itemId = itemId;
		this.xgridTitle = xgridTitle;
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

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getItemId() {
		return this.itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
	}

	public String getXgridTitle() {
		return xgridTitle;
	}

	public void setXgridTitle(String xgridTitle) {
		this.xgridTitle = xgridTitle;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getTemplateDept() {
		return templateDept;
	}

	public void setTemplateDept(String templateDept) {
		this.templateDept = templateDept;
	}

}