package com.sgepit.pmis.document.hbm;

/**
 * SafSort entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafSort implements java.io.Serializable {

	// Fields

	private String safid;
	private String pname;
	private String content;
	private String grade;
	private Double score;
	private String label;
	private String parent;
	private Long isleaf;//是否子节点
	/**
	 * @return the safid
	 */
	public String getSafid() {
		return safid;
	}
	/**
	 * @param safid the safid to set
	 */
	public void setSafid(String safid) {
		this.safid = safid;
	}
	/**
	 * @return the pname
	 */
	public String getPname() {
		return pname;
	}
	/**
	 * @param pname the pname to set
	 */
	public void setPname(String pname) {
		this.pname = pname;
	}
	/**
	 * @return the content
	 */
	public String getContent() {
		return content;
	}
	/**
	 * @param content the content to set
	 */
	public void setContent(String content) {
		this.content = content;
	}
	/**
	 * @return the grade
	 */
	public String getGrade() {
		return grade;
	}
	/**
	 * @param grade the grade to set
	 */
	public void setGrade(String grade) {
		this.grade = grade;
	}
	/**
	 * @return the score
	 */
	public Double getScore() {
		return score;
	}
	/**
	 * @param score the score to set
	 */
	public void setScore(Double score) {
		this.score = score;
	}
	/**
	 * @return the label
	 */
	public String getLabel() {
		return label;
	}
	/**
	 * @param label the label to set
	 */
	public void setLabel(String label) {
		this.label = label;
	}
	/**
	 * @return the isleaf
	 */
	public Long getIsleaf() {
		return isleaf;
	}
	/**
	 * @param isleaf the isleaf to set
	 */
	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}
	/**
	 * @return the parent
	 */
	public String getParent() {
		return parent;
	}
	/**
	 * @param parent the parent to set
	 */
	public void setParent(String parent) {
		this.parent = parent;
	}
	
   
	

	

}