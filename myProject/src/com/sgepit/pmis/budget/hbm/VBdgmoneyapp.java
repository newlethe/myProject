package com.sgepit.pmis.budget.hbm;

/**
 * VBdgmoneyappId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VBdgmoneyapp implements java.io.Serializable {

	// Fields

	private String appid;
	private String pid;
	private String conid;
	private Double realmoney;
	private Long prosign;
	private String remark;
	private Long isleaf;
	private String parent;
	private String bdgid;
	private Double sumrealmoney;
	//extend 
	private Double bdgmoney;
	private String bdgno;
	private String bdgname;
	private Double percent;
	// Constructors

	public VBdgmoneyapp(String appid, String pid, String conid,
			Double realmoney, Long prosign, String remark, Long isleaf,
			String parent, String bdgid, Double sumrealmoney, Double bdgmoney,
			String bdgno, String bdgname, Double percent) {
		super();
		this.appid = appid;
		this.pid = pid;
		this.conid = conid;
		this.realmoney = realmoney;
		this.prosign = prosign;
		this.remark = remark;
		this.isleaf = isleaf;
		this.parent = parent;
		this.bdgid = bdgid;
		this.sumrealmoney = sumrealmoney;
		this.bdgmoney = bdgmoney;
		this.bdgno = bdgno;
		this.bdgname = bdgname;
		this.percent = percent;
	}

	public Double getBdgmoney() {
		return bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public Double getPercent() {
		return percent;
	}

	public void setPercent(Double percent) {
		this.percent = percent;
	}

	/** default constructor */
	public VBdgmoneyapp() {
	}

	/** minimal constructor */
	public VBdgmoneyapp(String appid, String pid, Long isleaf, String parent,
			String bdgid) {
		this.appid = appid;
		this.pid = pid;
		this.isleaf = isleaf;
		this.parent = parent;
		this.bdgid = bdgid;
	}

	/** full constructor */

	// Property accessors

	public String getAppid() {
		return this.appid;
	}

	public void setAppid(String appid) {
		this.appid = appid;
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

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}


	public Double getSumrealmoney() {
		return sumrealmoney;
	}

	public void setSumrealmoney(Double sumrealmoney) {
		this.sumrealmoney = sumrealmoney;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof VBdgmoneyapp))
			return false;
		VBdgmoneyapp castOther = (VBdgmoneyapp) other;

		return ((this.getAppid() == castOther.getAppid()) || (this.getAppid() != null
				&& castOther.getAppid() != null && this.getAppid().equals(
				castOther.getAppid())))
				&& ((this.getPid() == castOther.getPid()) || (this.getPid() != null
						&& castOther.getPid() != null && this.getPid().equals(
						castOther.getPid())))
				&& ((this.getConid() == castOther.getConid()) || (this
						.getConid() != null
						&& castOther.getConid() != null && this.getConid()
						.equals(castOther.getConid())))
				&& ((this.getRealmoney() == castOther.getRealmoney()) || (this
						.getRealmoney() != null
						&& castOther.getRealmoney() != null && this
						.getRealmoney().equals(castOther.getRealmoney())))
				&& ((this.getProsign() == castOther.getProsign()) || (this
						.getProsign() != null
						&& castOther.getProsign() != null && this.getProsign()
						.equals(castOther.getProsign())))
				&& ((this.getRemark() == castOther.getRemark()) || (this
						.getRemark() != null
						&& castOther.getRemark() != null && this.getRemark()
						.equals(castOther.getRemark())))
				&& ((this.getIsleaf() == castOther.getIsleaf()) || (this
						.getIsleaf() != null
						&& castOther.getIsleaf() != null && this.getIsleaf()
						.equals(castOther.getIsleaf())))
				&& ((this.getParent() == castOther.getParent()) || (this
						.getParent() != null
						&& castOther.getParent() != null && this.getParent()
						.equals(castOther.getParent())))
				&& ((this.getBdgid() == castOther.getBdgid()) || (this
						.getBdgid() != null
						&& castOther.getBdgid() != null && this.getBdgid()
						.equals(castOther.getBdgid())))
				&& ((this.getSumrealmoney() == castOther.getSumrealmoney()) || (this
						.getSumrealmoney() != null
						&& castOther.getSumrealmoney() != null && this
						.getSumrealmoney().equals(castOther.getSumrealmoney())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getAppid() == null ? 0 : this.getAppid().hashCode());
		result = 37 * result
				+ (getPid() == null ? 0 : this.getPid().hashCode());
		result = 37 * result
				+ (getConid() == null ? 0 : this.getConid().hashCode());
		result = 37 * result
				+ (getRealmoney() == null ? 0 : this.getRealmoney().hashCode());
		result = 37 * result
				+ (getProsign() == null ? 0 : this.getProsign().hashCode());
		result = 37 * result
				+ (getRemark() == null ? 0 : this.getRemark().hashCode());
		result = 37 * result
				+ (getIsleaf() == null ? 0 : this.getIsleaf().hashCode());
		result = 37 * result
				+ (getParent() == null ? 0 : this.getParent().hashCode());
		result = 37 * result
				+ (getBdgid() == null ? 0 : this.getBdgid().hashCode());
		result = 37
				* result
				+ (getSumrealmoney() == null ? 0 : this.getSumrealmoney()
						.hashCode());
		return result;
	}

}