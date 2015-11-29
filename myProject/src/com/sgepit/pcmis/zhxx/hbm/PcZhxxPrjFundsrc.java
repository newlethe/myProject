package com.sgepit.pcmis.zhxx.hbm;

/**
 * PcZhxxPrjFundsrc entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcZhxxPrjFundsrc implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String srcType;
	private String amount;
	private String memo;

	// Constructors

	/** default constructor */
	public PcZhxxPrjFundsrc() {
	}

	/** minimal constructor */
	public PcZhxxPrjFundsrc(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcZhxxPrjFundsrc(String pid, String srcType, String amount,
			String memo) {
		this.pid = pid;
		this.srcType = srcType;
		this.amount = amount;
		this.memo = memo;
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

	public String getSrcType() {
		return this.srcType;
	}

	public void setSrcType(String srcType) {
		this.srcType = srcType;
	}

	public String getAmount() {
		return this.amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}