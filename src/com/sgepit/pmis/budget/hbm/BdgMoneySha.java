package com.sgepit.pmis.budget.hbm;

/**
 * BdgMoneySha entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgMoneySha implements java.io.Serializable {

	// Fields

	private String bgdid;
	private String pid;
	private String conid;
	private String bgdno;
	private Double shamoney;
	private Double realmoney;
	private Long prosign;
	private String remark;

	// Constructors

	/** default constructor */
	public BdgMoneySha() {
	}

	/** full constructor */
	public BdgMoneySha(String pid, String conid, String bgdno, Double shamoney,
			Double realmoney, Long prosign, String remark) {
		this.pid = pid;
		this.conid = conid;
		this.bgdno = bgdno;
		this.shamoney = shamoney;
		this.realmoney = realmoney;
		this.prosign = prosign;
		this.remark = remark;
	}

	// Property accessors

	public String getBgdid() {
		return this.bgdid;
	}

	public void setBgdid(String bgdid) {
		this.bgdid = bgdid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBgdno() {
		return this.bgdno;
	}

	public void setBgdno(String bgdno) {
		this.bgdno = bgdno;
	}

	public Double getShamoney() {
		return this.shamoney;
	}

	public void setShamoney(Double shamoney) {
		this.shamoney = shamoney;
	}

	public Double getRealmoney() {
		return this.realmoney;
	}

	public void setRealmoney(Double realmoney) {
		this.realmoney = realmoney;
	}

	public Long getProsign() {
		return this.prosign;
	}

	public void setProsign(Long prosign) {
		this.prosign = prosign;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}