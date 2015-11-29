package com.sgepit.frame.flow.hbm;

/**
 * FlwCommonNode entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class FlwCommonNode implements java.io.Serializable {

	// Fields

	private String cnodeid;
	private String nodeid;
	private String flowid;
	private String name;
	private String handler;
	private String role;
	private String bookmark;
	private String bifurcate;
	private String merge;
	private String istopromoter;
	// Constructors

	/** default constructor */
	public FlwCommonNode() {
	}

	/** minimal constructor */
	public FlwCommonNode(String bifurcate, String merge) {
		this.bifurcate = bifurcate;
		this.merge = merge;
	}

	/** full constructor */
	public FlwCommonNode(String nodeid, String flowid, String name,
			String handler, String role, String bookmark, String bifurcate,
			String merge,String istopromoter) {
		this.nodeid = nodeid;
		this.flowid = flowid;
		this.name = name;
		this.handler = handler;
		this.role = role;
		this.bookmark = bookmark;
		this.bifurcate = bifurcate;
		this.merge = merge;
		this.istopromoter = istopromoter;
	}

	// Property accessors

	public String getCnodeid() {
		return this.cnodeid;
	}

	public void setCnodeid(String cnodeid) {
		this.cnodeid = cnodeid;
	}

	public String getNodeid() {
		return this.nodeid;
	}

	public void setNodeid(String nodeid) {
		this.nodeid = nodeid;
	}

	public String getFlowid() {
		return this.flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getHandler() {
		return this.handler;
	}

	public void setHandler(String handler) {
		this.handler = handler;
	}

	public String getRole() {
		return this.role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getBookmark() {
		return this.bookmark;
	}

	public void setBookmark(String bookmark) {
		this.bookmark = bookmark;
	}

	public String getBifurcate() {
		return this.bifurcate;
	}

	public void setBifurcate(String bifurcate) {
		this.bifurcate = bifurcate;
	}

	public String getMerge() {
		return this.merge;
	}

	public void setMerge(String merge) {
		this.merge = merge;
	}

	public String getIstopromoter() {
		return istopromoter;
	}

	public void setIstopromoter(String istopromoter) {
		this.istopromoter = istopromoter;
	}

}