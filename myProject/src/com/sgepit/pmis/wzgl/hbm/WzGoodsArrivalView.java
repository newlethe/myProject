package com.sgepit.pmis.wzgl.hbm;

/**
 * EquGoodsArrival entity. @author MyEclipse Persistence Tools
 */

public class WzGoodsArrivalView implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String flowid;
	private String joinUnit;
	private String joinPlace;

	private String creatdate;
	private String dhDate;
	private String dhNo;
	private String dhDesc;

	private String conno;
	private String conname;

	// private String boxNo;
	// private String boxName;
	// private Long realNum;
	// private Double weight;

	private String batch;

	// Constructors

	/** default constructor */
	public WzGoodsArrivalView() {
	}

	/** full constructor */
	public WzGoodsArrivalView(String pid, String conid, String flowid,
			String joinUnit, String joinPlace, String creatdate, String dhDate,
			String dhNo, String dhDesc, String conno, String conname,
			// String boxNo, String boxName, Long realNum, Double weight,
			String batch) {
		this.pid = pid;
		this.conid = conid;
		this.flowid = flowid;
		this.joinUnit = joinUnit;
		this.joinPlace = joinPlace;
		this.creatdate = creatdate;
		this.dhDate = dhDate;
		this.dhNo = dhNo;
		this.dhDesc = dhDesc;
		this.conno = conno;
		this.conname = conname;
		// this.boxNo = boxNo;
		// this.boxName = boxName;
		// this.realNum = realNum;
		// this.weight = weight;
		this.batch = batch;
	}

	// Property accessors
	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getFlowid() {
		return flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getJoinUnit() {
		return joinUnit;
	}

	public void setJoinUnit(String joinUnit) {
		this.joinUnit = joinUnit;
	}

	public String getJoinPlace() {
		return joinPlace;
	}

	public void setJoinPlace(String joinPlace) {
		this.joinPlace = joinPlace;
	}

	public String getCreatdate() {
		return creatdate;
	}

	public void setCreatdate(String creatdate) {
		this.creatdate = creatdate;
	}

	public String getDhDate() {
		return dhDate;
	}

	public void setDhDate(String dhDate) {
		this.dhDate = dhDate;
	}

	public String getDhNo() {
		return dhNo;
	}

	public void setDhNo(String dhNo) {
		this.dhNo = dhNo;
	}

	public String getDhDesc() {
		return dhDesc;
	}

	public void setDhDesc(String dhDesc) {
		this.dhDesc = dhDesc;
	}

	public String getConno() {
		return conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	// public String getBoxNo() {
	// return boxNo;
	// }
	//
	// public void setBoxNo(String boxNo) {
	// this.boxNo = boxNo;
	// }
	//
	// public String getBoxName() {
	// return boxName;
	// }
	//
	// public void setBoxName(String boxName) {
	// this.boxName = boxName;
	// }
	//
	// public Long getRealNum() {
	// return realNum;
	// }
	//
	// public void setRealNum(Long realNum) {
	// this.realNum = realNum;
	// }
	//
	//
	// public Double getWeight() {
	// return weight;
	// }
	//
	// public void setWeight(Double weight) {
	// this.weight = weight;
	// }

	public String getBatch() {
		return batch;
	}
	
	public void setBatch(String batch) {
		this.batch = batch;
	}
}