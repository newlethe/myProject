package com.sgepit.frame.sysman.hbm;

/**
 * RockPower entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class RockPower implements java.io.Serializable {

	// Fields

	private String powerpk;
	private String resourcepk;
	private String parentid;
	private String powername;
	private String url;
	private Integer ordercode;
	private String jspName;
	private String modelflag;
	private String flowflag;
	private String unitId;	
	public Integer leaf;
	public String iconcls;
	public Integer lvl;
	public String ifalone;

	// Constructors

	/** default constructor */
	public RockPower() {
	}

	/** full constructor */
	public RockPower(String resourcepk, String parentid, String powername,
			String url, Integer ordercode, String jspName, String modelflag,
			String flowflag, String unitId,Integer leaf,String ifalone) {
		this.resourcepk = resourcepk;
		this.parentid = parentid;
		this.powername = powername;
		this.url = url;
		this.ordercode = ordercode;
		this.jspName = jspName;
		this.modelflag = modelflag;
		this.flowflag = flowflag;
		this.unitId = unitId;
		this.leaf =leaf;
		this.ifalone = ifalone;
	}

	// Property accessors

	public String getPowerpk() {
		return this.powerpk;
	}

	public void setPowerpk(String powerpk) {
		this.powerpk = powerpk;
	}

	public String getResourcepk() {
		return this.resourcepk;
	}

	public void setResourcepk(String resourcepk) {
		this.resourcepk = resourcepk;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getPowername() {
		return this.powername;
	}

	public void setPowername(String powername) {
		this.powername = powername;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Integer getOrdercode() {
		return this.ordercode;
	}

	public void setOrdercode(Integer ordercode) {
		this.ordercode = ordercode;
	}

	public String getJspName() {
		return this.jspName;
	}

	public void setJspName(String jspName) {
		this.jspName = jspName;
	}

	public String getModelflag() {
		return this.modelflag;
	}

	public void setModelflag(String modelflag) {
		this.modelflag = modelflag;
	}

	public String getFlowflag() {
		return this.flowflag;
	}

	public void setFlowflag(String flowflag) {
		this.flowflag = flowflag;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public Integer getLeaf() {
		return leaf;
	}

	public void setLeaf(Integer leaf) {
		this.leaf = leaf;
	}

	public String getIconcls() {
		return iconcls;
	}

	public void setIconcls(String iconcls) {
		this.iconcls = iconcls;
	}

	public Integer getLvl() {
		return lvl;
	}

	public void setLvl(Integer lvl) {
		this.lvl = lvl;
	}

	public String getIfalone() {
		return ifalone;
	}

	public void setIfalone(String ifalone) {
		this.ifalone = ifalone;
	}

}