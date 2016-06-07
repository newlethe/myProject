package com.sgepit.pmis.coninvested.hbm;

public class CorpCompletionSub implements java.io.Serializable{

	private String subcorpinvesteid;
	private String corpinvesteid;
	private String bdgname;
	private Double bdgmoney;
	private Double totalmoney;
	private Double totalpercent;
	private Double currentmoney;
	private String bdgid;
	/**
	 * @return the bdgid
	 */
	public String getBdgid() {
		return bdgid;
	}
	/**
	 * @param bdgid the bdgid to set
	 */
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	/**
	 * @return the subcorpinvesteid
	 */
	public String getSubcorpinvesteid() {
		return subcorpinvesteid;
	}
	/**
	 * @param subcorpinvesteid the subcorpinvesteid to set
	 */
	public void setSubcorpinvesteid(String subcorpinvesteid) {
		this.subcorpinvesteid = subcorpinvesteid;
	}
	/**
	 * @return the corpinvesteid
	 */
	public String getCorpinvesteid() {
		return corpinvesteid;
	}
	/**
	 * @param corpinvesteid the corpinvesteid to set
	 */
	public void setCorpinvesteid(String corpinvesteid) {
		this.corpinvesteid = corpinvesteid;
	}
	/**
	 * @return the bdgname
	 */
	public String getBdgname() {
		return bdgname;
	}
	/**
	 * @param bdgname the bdgname to set
	 */
	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}
	/**
	 * @return the bdgmoney
	 */
	public Double getBdgmoney() {
		return bdgmoney;
	}
	/**
	 * @param bdgmoney the bdgmoney to set
	 */
	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}
	/**
	 * @return the totalmoney
	 */
	public Double getTotalmoney() {
		return totalmoney;
	}
	/**
	 * @param totalmoney the totalmoney to set
	 */
	public void setTotalmoney(Double totalmoney) {
		this.totalmoney = totalmoney;
	}
	
	/**
	 * @return the totalpercent
	 */
	public Double getTotalpercent() {
		return totalpercent;
	}
	/**
	 * @param totalpercent the totalpercent to set
	 */
	public void setTotalpercent(Double totalpercent) {
		this.totalpercent = totalpercent;
	}
	/**
	 * @return the currentmoney
	 */
	public Double getCurrentmoney() {
		return currentmoney;
	}
	/**
	 * @param currentmoney the currentmoney to set
	 */
	public void setCurrentmoney(Double currentmoney) {
		this.currentmoney = currentmoney;
	}

}
