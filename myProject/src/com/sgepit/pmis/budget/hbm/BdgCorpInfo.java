package com.sgepit.pmis.budget.hbm;

public class BdgCorpInfo implements java.io.Serializable{
	
	private String corpid;
    private String pid;
    private String basicid;
    private String bdgid;
    private Double appmoney;
    private String corpremark;
    private Long isleaf;
    private String parent;
    
    private Double bdgmoney;
	private String bdgno;
	private String bdgname;
	/**
	 * @return the corpid
	 */
	public String getCorpid() {
		return corpid;
	}
	/**
	 * @param corpid the corpid to set
	 */
	public void setCorpid(String corpid) {
		this.corpid = corpid;
	}
	/**
	 * @return the pid
	 */
	public String getPid() {
		return pid;
	}
	/**
	 * @param pid the pid to set
	 */
	public void setPid(String pid) {
		this.pid = pid;
	}
	/**
	 * @return the basicid
	 */
	public String getBasicid() {
		return basicid;
	}
	/**
	 * @param basicid the basicid to set
	 */
	public void setBasicid(String basicid) {
		this.basicid = basicid;
	}

	/**
	 * @return the appmoney
	 */
	public Double getAppmoney() {
		return appmoney;
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
	 * @return the bdgno
	 */
	public String getBdgno() {
		return bdgno;
	}
	/**
	 * @param bdgno the bdgno to set
	 */
	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
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
	 * @param appmoney the appmoney to set
	 */
	public void setAppmoney(Double appmoney) {
		this.appmoney = appmoney;
	}

}
