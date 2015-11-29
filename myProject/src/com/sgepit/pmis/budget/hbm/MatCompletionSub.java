package com.sgepit.pmis.budget.hbm;

/**
 * MatCompletionSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatCompletionSub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String acmid;
	private String matoutid;
	private String matid;
	private Double money;
	private String bdgid;
	private String conid;
	private String partyb;

	// Constructors

	/** default constructor */
	public MatCompletionSub() {
	}

	/** full constructor */
	public MatCompletionSub(String acmid, String matoutid, String matid,
			Double money, String bdgid, String conid, String partyb) {
		this.acmid = acmid;
		this.matoutid = matoutid;
		this.matid = matid;
		this.money = money;
		this.bdgid = bdgid;
		this.conid = conid;
		this.partyb = partyb;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getAcmid() {
		return this.acmid;
	}

	public void setAcmid(String acmid) {
		this.acmid = acmid;
	}

	public String getMatoutid() {
		return this.matoutid;
	}

	public void setMatoutid(String matoutid) {
		this.matoutid = matoutid;
	}

	public String getMatid() {
		return this.matid;
	}

	public void setMatid(String matid) {
		this.matid = matid;
	}

	public Double getMoney() {
		return this.money;
	}

	public void setMoney(Double money) {
		this.money = money;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getPartyb() {
		return this.partyb;
	}

	public void setPartyb(String partyb) {
		this.partyb = partyb;
	}

}