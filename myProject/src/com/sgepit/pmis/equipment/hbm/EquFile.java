package com.sgepit.pmis.equipment.hbm;

/**
 * EquFile entity. @author MyEclipse Persistence Tools
 */

public class EquFile implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String mainid;
	private String treeuids;
	private String fileid;
	private String filename;
	private String remark;
	private String dhOrKx;
	
	// Constructors

	/** default constructor */
	public EquFile() {
	}

	/** minimal constructor */
	public EquFile(String pid, String conid, String mainid) {
		this.pid = pid;
		this.conid = conid;
		this.mainid = mainid;
	}

	/** full constructor */
	/**
	 * @param pid
	 * @param conid
	 * @param mainid
	 * @param fileid
	 * @param filename
	 * @param remark
	 */
	public EquFile(String pid, String conid, String mainid, String fileid,
			String treeuids,String filename, String remark, String dhOrKx) {
		this.pid = pid;
		this.conid = conid;
		this.mainid = mainid;
		this.treeuids = treeuids;
		this.fileid = fileid;
		this.filename = filename;
		this.remark = remark;
		this.dhOrKx = dhOrKx;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
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

	public String getMainid() {
		return this.mainid;
	}

	public void setMainid(String mainid) {
		this.mainid = mainid;
	}

	public String getFileid() {
		return this.fileid;
	}

	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

	public String getFilename() {
		return this.filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getTreeuids() {
		return treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
	}

	public String getDhOrKx() {
		return dhOrKx;
	}

	public void setDhOrKx(String dhOrKx) {
		this.dhOrKx = dhOrKx;
	}

}