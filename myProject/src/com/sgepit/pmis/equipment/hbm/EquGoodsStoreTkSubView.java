package com.sgepit.pmis.equipment.hbm;

/**
 * EquGoodsStoreTkSubViewId entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsStoreTkSubView implements java.io.Serializable {

	// Fields

	private String uids;
	private String tkId;
	private String graphNo;
	private String boxNo;
	private String equPartName;
	private String ggxh;
	private String unit;
	private Long tkNum;
	private String remark;
	private String jzNo;
	private String jzName;

	// Constructors

	/** default constructor */
	public EquGoodsStoreTkSubView() {
	}

	/** minimal constructor */
	public EquGoodsStoreTkSubView(String uids, String tkId) {
		this.uids = uids;
		this.tkId = tkId;
	}

	/** full constructor */
	public EquGoodsStoreTkSubView(String uids, String tkId, String graphNo,
			String boxNo, String equPartName, String ggxh, String unit,
			Long tkNum, String remark, String jzNo, String jzName) {
		this.uids = uids;
		this.tkId = tkId;
		this.graphNo = graphNo;
		this.boxNo = boxNo;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.unit = unit;
		this.tkNum = tkNum;
		this.remark = remark;
		this.jzNo = jzNo;
		this.jzName = jzName;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTkId() {
		return this.tkId;
	}

	public void setTkId(String tkId) {
		this.tkId = tkId;
	}

	public String getGraphNo() {
		return this.graphNo;
	}

	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}

	public String getBoxNo() {
		return this.boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getEquPartName() {
		return this.equPartName;
	}

	public void setEquPartName(String equPartName) {
		this.equPartName = equPartName;
	}

	public String getGgxh() {
		return this.ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Long getTkNum() {
		return this.tkNum;
	}

	public void setTkNum(Long tkNum) {
		this.tkNum = tkNum;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getJzNo() {
		return this.jzNo;
	}

	public void setJzNo(String jzNo) {
		this.jzNo = jzNo;
	}

	public String getJzName() {
		return this.jzName;
	}

	public void setJzName(String jzName) {
		this.jzName = jzName;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof EquGoodsStoreTkSubView))
			return false;
		EquGoodsStoreTkSubView castOther = (EquGoodsStoreTkSubView) other;

		return ((this.getUids() == castOther.getUids()) || (this.getUids() != null
				&& castOther.getUids() != null && this.getUids().equals(
				castOther.getUids())))
				&& ((this.getTkId() == castOther.getTkId()) || (this.getTkId() != null
						&& castOther.getTkId() != null && this.getTkId()
						.equals(castOther.getTkId())))
				&& ((this.getGraphNo() == castOther.getGraphNo()) || (this
						.getGraphNo() != null && castOther.getGraphNo() != null && this
						.getGraphNo().equals(castOther.getGraphNo())))
				&& ((this.getBoxNo() == castOther.getBoxNo()) || (this
						.getBoxNo() != null && castOther.getBoxNo() != null && this
						.getBoxNo().equals(castOther.getBoxNo())))
				&& ((this.getEquPartName() == castOther.getEquPartName()) || (this
						.getEquPartName() != null
						&& castOther.getEquPartName() != null && this
						.getEquPartName().equals(castOther.getEquPartName())))
				&& ((this.getGgxh() == castOther.getGgxh()) || (this.getGgxh() != null
						&& castOther.getGgxh() != null && this.getGgxh()
						.equals(castOther.getGgxh())))
				&& ((this.getUnit() == castOther.getUnit()) || (this.getUnit() != null
						&& castOther.getUnit() != null && this.getUnit()
						.equals(castOther.getUnit())))
				&& ((this.getTkNum() == castOther.getTkNum()) || (this
						.getTkNum() != null && castOther.getTkNum() != null && this
						.getTkNum().equals(castOther.getTkNum())))
				&& ((this.getRemark() == castOther.getRemark()) || (this
						.getRemark() != null && castOther.getRemark() != null && this
						.getRemark().equals(castOther.getRemark())))
				&& ((this.getJzNo() == castOther.getJzNo()) || (this.getJzNo() != null
						&& castOther.getJzNo() != null && this.getJzNo()
						.equals(castOther.getJzNo())))
				&& ((this.getJzName() == castOther.getJzName()) || (this
						.getJzName() != null && castOther.getJzName() != null && this
						.getJzName().equals(castOther.getJzName())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getUids() == null ? 0 : this.getUids().hashCode());
		result = 37 * result
				+ (getTkId() == null ? 0 : this.getTkId().hashCode());
		result = 37 * result
				+ (getGraphNo() == null ? 0 : this.getGraphNo().hashCode());
		result = 37 * result
				+ (getBoxNo() == null ? 0 : this.getBoxNo().hashCode());
		result = 37
				* result
				+ (getEquPartName() == null ? 0 : this.getEquPartName()
						.hashCode());
		result = 37 * result
				+ (getGgxh() == null ? 0 : this.getGgxh().hashCode());
		result = 37 * result
				+ (getUnit() == null ? 0 : this.getUnit().hashCode());
		result = 37 * result
				+ (getTkNum() == null ? 0 : this.getTkNum().hashCode());
		result = 37 * result
				+ (getRemark() == null ? 0 : this.getRemark().hashCode());
		result = 37 * result
				+ (getJzNo() == null ? 0 : this.getJzNo().hashCode());
		result = 37 * result
				+ (getJzName() == null ? 0 : this.getJzName().hashCode());
		return result;
	}

}