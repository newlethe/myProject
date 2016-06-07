package com.sgepit.pmis.budget.hbm;

/**
 * BdgMonthMoneyPlanSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgMonthMoneyPlanSub implements java.io.Serializable {

	// Fields

	private String uids;
	private String puids;
	private String memo;
	private String memo1;
	private String memo2;
	private String memo3;

	// Constructors

	/** default constructor */
	public BdgMonthMoneyPlanSub() {
	}

	/** minimal constructor */
	public BdgMonthMoneyPlanSub(String uids) {
		this.uids = uids;
	}

	/** full constructor */
	public BdgMonthMoneyPlanSub(String uids, String puids, String memo,
			String memo1, String memo2, String memo3) {
		this.uids = uids;
		this.puids = puids;
		this.memo = memo;
		this.memo1 = memo1;
		this.memo2 = memo2;
		this.memo3 = memo3;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPuids() {
		return this.puids;
	}

	public void setPuids(String puids) {
		this.puids = puids;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getMemo1() {
		return this.memo1;
	}

	public void setMemo1(String memo1) {
		this.memo1 = memo1;
	}

	public String getMemo2() {
		return this.memo2;
	}

	public void setMemo2(String memo2) {
		this.memo2 = memo2;
	}

	public String getMemo3() {
		return this.memo3;
	}

	public void setMemo3(String memo3) {
		this.memo3 = memo3;
	}

}