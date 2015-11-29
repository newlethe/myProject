package com.sgepit.pcmis.zlgk.hbm;
/**
 * @author yangl 2013-6-20
 * 质量验评权限控制相关联数据表
 *
 */
public class PcZlgkRightSortDept implements java.io.Serializable {

	// Fields

	private String uids;
	private String fileSortId;
	private String deptId;
	private String rightLvl;
	private String pid;

	// Constructors

	/** default constructor */
	public PcZlgkRightSortDept() {
	}

	/** minimal constructor */
	public PcZlgkRightSortDept(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public PcZlgkRightSortDept(String uids, String fileSortId, String deptId,
			String rightLvl,String pid) {
		this.uids = uids;
		this.fileSortId = fileSortId;
		this.deptId = deptId;
		this.rightLvl = rightLvl;
		this.pid = pid;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getFileSortId() {
		return this.fileSortId;
	}

	public void setFileSortId(String fileSortId) {
		this.fileSortId = fileSortId;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getRightLvl() {
		return this.rightLvl;
	}

	public void setRightLvl(String rightLvl) {
		this.rightLvl = rightLvl;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}
