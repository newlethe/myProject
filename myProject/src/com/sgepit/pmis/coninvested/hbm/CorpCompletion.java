package com.sgepit.pmis.coninvested.hbm;

import java.util.Date;

public class CorpCompletion implements java.io.Serializable{
	private String corpinvesteid;
	private Date month;//月份
	private Double investemoney;
	private String investremark;//投资完成备注
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
	 * @return the month
	 */
	public Date getMonth() {
		return month;
	}
	/**
	 * @param month the month to set
	 */
	public void setMonth(Date month) {
		this.month = month;
	}
	/**
	 * @return the investemoney
	 */
	public Double getInvestemoney() {
		return investemoney;
	}
	/**
	 * @param investemoney the investemoney to set
	 */
	public void setInvestemoney(Double investemoney) {
		this.investemoney = investemoney;
	}
	/**
	 * @return the investremark
	 */
	public String getInvestremark() {
		return investremark;
	}
	/**
	 * @param investremark the investremark to set
	 */
	public void setInvestremark(String investremark) {
		this.investremark = investremark;
	}

}
