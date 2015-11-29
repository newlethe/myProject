package com.sgepit.pmis.equipment.hbm;
/**
 * 设备开箱通知打印子表
 * @author shuz
 *
 */
public class EquGoodsOpenNoticeSubVGj implements java.io.Serializable{
	private String uids;
	private String noticeId;
	private String boxName;
	private String jzno;
	private String ggxh;
	private String graphNo;
	private Double openNum;
	private String unit;
	private String equDesc;
	private String boxNo;
	
	public EquGoodsOpenNoticeSubVGj() {
	}

	public EquGoodsOpenNoticeSubVGj(String uids, String noticeId,
			String boxName, String jzno, String ggxh, String graphNo,
			Double openNum, String unit) {
		super();
		this.uids = uids;
		this.noticeId = noticeId;
		this.boxName = boxName;
		this.jzno = jzno;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.openNum = openNum;
		this.unit = unit;
	}


	public EquGoodsOpenNoticeSubVGj(String uids, String noticeId,
			String boxName, String jzno, String ggxh, String graphNo,
			Double openNum, String unit, String equDesc, String boxNo) {
		super();
		this.uids = uids;
		this.noticeId = noticeId;
		this.boxName = boxName;
		this.jzno = jzno;
		this.ggxh = ggxh;
		this.graphNo = graphNo;
		this.openNum = openNum;
		this.unit = unit;
		this.equDesc = equDesc;
		this.boxNo = boxNo;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getNoticeId() {
		return noticeId;
	}

	public void setNoticeId(String noticeId) {
		this.noticeId = noticeId;
	}

	public String getBoxName() {
		return boxName;
	}

	public void setBoxName(String boxName) {
		this.boxName = boxName;
	}

	public String getJzno() {
		return jzno;
	}

	public void setJzno(String jzno) {
		this.jzno = jzno;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getGraphNo() {
		return graphNo;
	}

	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}

	public Double getOpenNum() {
		return openNum;
	}

	public void setOpenNum(Double openNum) {
		this.openNum = openNum;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getEquDesc() {
		return equDesc;
	}

	public void setEquDesc(String equDesc) {
		this.equDesc = equDesc;
	}

	public String getBoxNo() {
		return boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}
}
