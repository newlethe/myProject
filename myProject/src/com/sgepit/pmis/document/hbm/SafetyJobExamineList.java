package com.sgepit.pmis.document.hbm;

/**
 * SafetyJobExamineList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafetyJobExamineList implements java.io.Serializable {

	// Fields

	private String uuid;
	private String safejobexid;
	private String gradeform;
	private Double totalize;
	private Long grade;
	private String appraiser;

	// Constructors

	/** default constructor */
	public SafetyJobExamineList() {
	}

	/** full constructor */
	public SafetyJobExamineList(String safejobexid, String gradeform,
			Double totalize, Long grade, String appraiser) {
		this.safejobexid = safejobexid;
		this.gradeform = gradeform;
		this.totalize = totalize;
		this.grade = grade;
		this.appraiser = appraiser;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getSafejobexid() {
		return this.safejobexid;
	}

	public void setSafejobexid(String safejobexid) {
		this.safejobexid = safejobexid;
	}


	/**
	 * @return the gradeform
	 */
	public String getGradeform() {
		return gradeform;
	}

	/**
	 * @param gradeform the gradeform to set
	 */
	public void setGradeform(String gradeform) {
		this.gradeform = gradeform;
	}

	public Double getTotalize() {
		return this.totalize;
	}

	public void setTotalize(Double totalize) {
		this.totalize = totalize;
	}

	public Long getGrade() {
		return this.grade;
	}

	public void setGrade(Long grade) {
		this.grade = grade;
	}

	public String getAppraiser() {
		return this.appraiser;
	}

	public void setAppraiser(String appraiser) {
		this.appraiser = appraiser;
	}

}