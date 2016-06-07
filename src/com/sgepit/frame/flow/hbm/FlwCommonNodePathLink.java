package com.sgepit.frame.flow.hbm;

/**
 * FlwCommonNodePathLink entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FlwCommonNodePathLink implements java.io.Serializable {

	// Fields

	private String cpathlinkid;
	private String flowid;
	private String linkpath;
	private String nodeid;
	private String linkdec;

	// Constructors

	/** default constructor */
	public FlwCommonNodePathLink() {
	}

	/** full constructor */
	public FlwCommonNodePathLink(String flowid, String linkpath,
			String nodeid,String linkdec) {
		this.flowid = flowid;
		this.linkpath = linkpath;
		this.nodeid = nodeid;
	}

	// Property accessors

	public String getCpathlinkid() {
		return this.cpathlinkid;
	}

	public void setCpathlinkid(String cpathlinkid) {
		this.cpathlinkid = cpathlinkid;
	}

	public String getFlowid() {
		return this.flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getLinkpath() {
		return this.linkpath;
	}

	public void setLinkpath(String linkpath) {
		this.linkpath = linkpath;
	}

	public String getNodeid() {
		return this.nodeid;
	}

	public void setNodeid(String nodeid) {
		this.nodeid = nodeid;
	}

	public String getLinkdec() {
		return linkdec;
	}

	public void setLinkdec(String linkdec) {
		this.linkdec = linkdec;
	}

}