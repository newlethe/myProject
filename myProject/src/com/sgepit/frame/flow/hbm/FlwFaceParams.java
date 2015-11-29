package com.sgepit.frame.flow.hbm;

/**
 * FlwFaceParams entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FlwFaceParams implements java.io.Serializable {

	// Fields

	private String paramid;
	private String faceid;
	private String pname;
	private String ptype;
	private String pcname;
	private String validatefn;
	private String ontrigger;
	private String defvalfn;
	private String biz;
	private String failmsg;
	private String isexist;
	

	// Constructors

	/** default constructor */
	public FlwFaceParams() {
	}

	/** minimal constructor */
	public FlwFaceParams(String faceid, String pname, String ptype,
			String pcname) {
		this.faceid = faceid;
		this.pname = pname;
		this.ptype = ptype;
		this.pcname = pcname;
	}

	/** full constructor */
	public FlwFaceParams(String faceid, String pname, String ptype,
			String pcname, String validatefn, String ontrigger, String defvalfn) {
		this.faceid = faceid;
		this.pname = pname;
		this.ptype = ptype;
		this.pcname = pcname;
		this.validatefn = validatefn;
		this.ontrigger = ontrigger;
		this.defvalfn = defvalfn;
	}

	// Property accessors

	public String getParamid() {
		return this.paramid;
	}

	public void setParamid(String paramid) {
		this.paramid = paramid;
	}

	public String getFaceid() {
		return this.faceid;
	}

	public void setFaceid(String faceid) {
		this.faceid = faceid;
	}

	public String getPname() {
		return this.pname;
	}

	public void setPname(String pname) {
		this.pname = pname;
	}

	public String getPtype() {
		return this.ptype;
	}

	public void setPtype(String ptype) {
		this.ptype = ptype;
	}

	public String getPcname() {
		return this.pcname;
	}

	public void setPcname(String pcname) {
		this.pcname = pcname;
	}

	public String getValidatefn() {
		return this.validatefn;
	}

	public void setValidatefn(String validatefn) {
		this.validatefn = validatefn;
	}

	public String getOntrigger() {
		return this.ontrigger;
	}

	public void setOntrigger(String ontrigger) {
		this.ontrigger = ontrigger;
	}

	public String getDefvalfn() {
		return this.defvalfn;
	}

	public void setDefvalfn(String defvalfn) {
		this.defvalfn = defvalfn;
	}

	public String getBiz() {
		return biz;
	}

	public void setBiz(String biz) {
		this.biz = biz;
	}

	public String getFailmsg() {
		return failmsg;
	}

	public void setFailmsg(String failmsg) {
		this.failmsg = failmsg;
	}

	public String getIsexist() {
		return isexist;
	}

	public void setIsexist(String isexist) {
		this.isexist = isexist;
	}

}