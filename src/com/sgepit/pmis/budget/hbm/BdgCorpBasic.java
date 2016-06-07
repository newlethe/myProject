package com.sgepit.pmis.budget.hbm;

public class BdgCorpBasic implements java.io.Serializable{
	
	 private String corpbasicid;
	 private String month;
	 private Double  money;
	 private String corpremark;
	/**
	 * @return the corpbasicid
	 */
	public String getCorpbasicid() {
		return corpbasicid;
	}
	/**
	 * @param corpbasicid the corpbasicid to set
	 */
	public void setCorpbasicid(String corpbasicid) {
		this.corpbasicid = corpbasicid;
	}
	/**
	 * @return the month
	 */
	public String getMonth() {
		return month;
	}
	/**
	 * @param month the month to set
	 */
	public void setMonth(String month) {
		this.month = month;
	}

	/**
	 * @return the money
	 */
	public Double getMoney() {
		return money;
	}
	/**
	 * @param money the money to set
	 */
	public void setMoney(Double money) {
		this.money = money;
	}
	/**
	 * @return the corpremark
	 */
	public String getCorpremark() {
		return corpremark;
	}
	/**
	 * @param corpremark the corpremark to set
	 */
	public void setCorpremark(String corpremark) {
		this.corpremark = corpremark;
	}
}
