package com.sgepit.pmis.finalAccounts.complete.hbm;

import java.util.Date;

/**
 * 凭证信息表
 * @author pengy
 * @createtime 2013-07-25
 */
public class FacompProofInfo {
	
	// Fields

	private String uids;
	private String pid;
	private String proofNo;
	private String proofAbstract;
	private String comptime;
	private String conid;
	private Double totalmoney;
	private String remark;
	private Date createtime;
	private String relateuids;
	private Long detialBh;

	// Constructors

	/** default constructor */
	public FacompProofInfo() {
	}

	/** full constructor */
	public FacompProofInfo(String uids, String pid, String proofNo,
			String proofAbstract, String comptime, String conid,
			Double totalmoney, String remark, Date createtime,
			String relateuids, Long detialBh) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.proofNo = proofNo;
		this.proofAbstract = proofAbstract;
		this.comptime = comptime;
		this.conid = conid;
		this.totalmoney = totalmoney;
		this.remark = remark;
		this.createtime = createtime;
		this.relateuids = relateuids;
		this.detialBh = detialBh;
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

	public String getProofNo() {
		return this.proofNo;
	}

	public void setProofNo(String proofNo) {
		this.proofNo = proofNo;
	}

	public String getProofAbstract() {
		return this.proofAbstract;
	}

	public void setProofAbstract(String proofAbstract) {
		this.proofAbstract = proofAbstract;
	}

	public String getComptime() {
		return this.comptime;
	}

	public void setComptime(String comptime) {
		this.comptime = comptime;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Double getTotalmoney() {
		return this.totalmoney;
	}

	public void setTotalmoney(Double totalmoney) {
		this.totalmoney = totalmoney;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public String getRelateuids() {
		return relateuids;
	}

	public void setRelateuids(String relateuids) {
		this.relateuids = relateuids;
	}

	public Long getDetialBh() {
		return detialBh;
	}

	public void setDetialBh(Long detialBh) {
		this.detialBh = detialBh;
	}

}
