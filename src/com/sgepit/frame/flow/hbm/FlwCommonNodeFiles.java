package com.sgepit.frame.flow.hbm;

/**
 * FlwCommonNodeFiles entity. @author MyEclipse Persistence Tools
 */

public class FlwCommonNodeFiles implements java.io.Serializable {

	// Fields

	private String uids;
	private String cnodeid;
	private String nodeid;
	private String flowid;
	private String fileid;
	private String readtype;

	// Constructors

	/** default constructor */
	public FlwCommonNodeFiles() {
	}

	/** minimal constructor */
	public FlwCommonNodeFiles(String cnodeid, String nodeid, String flowid,
			String fileid) {
		this.cnodeid = cnodeid;
		this.nodeid = nodeid;
		this.flowid = flowid;
		this.fileid = fileid;
	}

	/** full constructor */
	public FlwCommonNodeFiles(String cnodeid, String nodeid, String flowid,
			String fileid, String readtype) {
		this.cnodeid = cnodeid;
		this.nodeid = nodeid;
		this.flowid = flowid;
		this.fileid = fileid;
		this.readtype = readtype;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

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
	
	public String getFileid() {
		return fileid;
	}

	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

	public String getReadtype() {
		return this.readtype;
	}

	public void setReadtype(String readtype) {
		this.readtype = readtype;
	}

}