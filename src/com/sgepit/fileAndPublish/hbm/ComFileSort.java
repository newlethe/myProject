package com.sgepit.fileAndPublish.hbm;

/**
 * ComFileSort entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ComFileSort implements java.io.Serializable {

	// Fields

	private String uids;
	private String sortBh;
	private String sortName;
	private String parentId;
	private Long pxh;
	private String pxhFull;
	
	private String pid;
	
	private Boolean isSync;

	// Constructors

	public Boolean getIsSync() {
		return isSync;
	}

	public void setIsSync(Boolean isSync) {
		this.isSync = isSync;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public ComFileSort() {
	}

	/** minimal constructor */
	public ComFileSort(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public ComFileSort(String uids, String sortBh, String sortName,
			String parentId, Long pxh, String pxhFull) {
		this.uids = uids;
		this.sortBh = sortBh;
		this.sortName = sortName;
		this.parentId = parentId;
		this.pxh = pxh;
		this.pxhFull = pxhFull;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getSortBh() {
		return this.sortBh;
	}

	public void setSortBh(String sortBh) {
		this.sortBh = sortBh;
	}

	public String getSortName() {
		return this.sortName;
	}

	public void setSortName(String sortName) {
		this.sortName = sortName;
	}

	public String getParentId() {
		return this.parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public Long getPxh() {
		return this.pxh;
	}

	public void setPxh(Long pxh) {
		this.pxh = pxh;
	}

	public String getPxhFull() {
		return this.pxhFull;
	}

	public void setPxhFull(String pxhFull) {
		this.pxhFull = pxhFull;
	}

}