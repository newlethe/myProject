package com.sgepit.pmis.finalAccounts.complete.hbm;
/**
 * 工程基本信息-项目信息表
 * @author pengy
 * @createtime 2013-06-27
 */
public class FACompInfoOve {
	
	private String uids;
	private String pid;
	private String prjName;
	private String prjAddress;
	private String designUnit;
	private String constructUnit;
	private String eqIntensity;
	private String fdIntensity;
	private String qualityDeter;
	private String buildProper;
	private String supervision;
	private String ratifyOrgan;

	public FACompInfoOve() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public FACompInfoOve(String uids, String pid, String prjName,
			String prjAddress, String designUnit, String constructUnit,
			String eqIntensity, String fdIntensity, String qualityDeter,
			String buildProper, String supervision, String ratifyOrgan) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.prjName = prjName;
		this.prjAddress = prjAddress;
		this.designUnit = designUnit;
		this.constructUnit = constructUnit;
		this.eqIntensity = eqIntensity;
		this.fdIntensity = fdIntensity;
		this.qualityDeter = qualityDeter;
		this.buildProper = buildProper;
		this.supervision = supervision;
		this.ratifyOrgan = ratifyOrgan;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}
	
	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getPrjName() {
		return prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}

	public String getPrjAddress() {
		return prjAddress;
	}

	public void setPrjAddress(String prjAddress) {
		this.prjAddress = prjAddress;
	}

	public String getDesignUnit() {
		return designUnit;
	}

	public void setDesignUnit(String designUnit) {
		this.designUnit = designUnit;
	}

	public String getConstructUnit() {
		return constructUnit;
	}

	public void setConstructUnit(String constructUnit) {
		this.constructUnit = constructUnit;
	}

	public String getEqIntensity() {
		return eqIntensity;
	}

	public void setEqIntensity(String eqIntensity) {
		this.eqIntensity = eqIntensity;
	}

	public String getFdIntensity() {
		return fdIntensity;
	}

	public void setFdIntensity(String fdIntensity) {
		this.fdIntensity = fdIntensity;
	}

	public String getQualityDeter() {
		return qualityDeter;
	}

	public void setQualityDeter(String qualityDeter) {
		this.qualityDeter = qualityDeter;
	}

	public String getBuildProper() {
		return buildProper;
	}

	public void setBuildProper(String buildProper) {
		this.buildProper = buildProper;
	}

	public String getSupervision() {
		return supervision;
	}

	public void setSupervision(String supervision) {
		this.supervision = supervision;
	}

	public String getRatifyOrgan() {
		return ratifyOrgan;
	}

	public void setRatifyOrgan(String ratifyOrgan) {
		this.ratifyOrgan = ratifyOrgan;
	}

}
