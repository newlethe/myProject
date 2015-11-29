package com.sgepit.pmis.document.hbm;

/**
 * SafetySortIniti entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafetySortIniti implements java.io.Serializable {

	// Fields
    private String uuid;
	private String treedata;
	private String itemname;
	private String contentneed;
	private String gradecriterion;
	private Double score;
	private Double finalscore;
	private Long isleaf;//是否子节点
	private String parent;
	private String safeexamin;
	/**
	 * @return the safeexamin
	 */
	public String getSafeexamin() {
		return safeexamin;
	}
	/**
	 * @param safeexamin the safeexamin to set
	 */
	public void setSafeexamin(String safeexamin) {
		this.safeexamin = safeexamin;
	}
	/**
	 * @return the treedata
	 */
	public String getTreedata() {
		return treedata;
	}
	/**
	 * @param treedata the treedata to set
	 */
	public void setTreedata(String treedata) {
		this.treedata = treedata;
	}
	/**
	 * @return the itemname
	 */
	public String getItemname() {
		return itemname;
	}
	/**
	 * @param itemname the itemname to set
	 */
	public void setItemname(String itemname) {
		this.itemname = itemname;
	}
	/**
	 * @return the contentneed
	 */
	public String getContentneed() {
		return contentneed;
	}
	/**
	 * @param contentneed the contentneed to set
	 */
	public void setContentneed(String contentneed) {
		this.contentneed = contentneed;
	}
	/**
	 * @return the gradecriterion
	 */
	public String getGradecriterion() {
		return gradecriterion;
	}
	/**
	 * @param gradecriterion the gradecriterion to set
	 */
	public void setGradecriterion(String gradecriterion) {
		this.gradecriterion = gradecriterion;
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
	 * @return the finalscore
	 */
	public Double getFinalscore() {
		return finalscore;
	}
	/**
	 * @param finalscore the finalscore to set
	 */
	public void setFinalscore(Double finalscore) {
		this.finalscore = finalscore;
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
	/**
	 * @return the uuid
	 */
	public String getUuid() {
		return uuid;
	}
	/**
	 * @param uuid the uuid to set
	 */
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	

}