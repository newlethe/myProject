package com.sgepit.pmis.rlzj.hbm;

/**
 * HrXcGuidelineInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrXcGuidelineInfo implements java.io.Serializable {

	// Fields

	private String zbSeqno;
	private String id;
	private String name;
	private String parentid;
	private String sxLb;
	private String sxTable;
	private String jldw;
	private Long zbjd;
	private String fullname;
	private String realname;
	private String ifpercent;
	private String zbZzlx;
	private String state;
	private String gkbmlx;
	private Long pxh;
	private String path;
	private String memo;
	private String inputtype;
	private String zbTrcc;
	private String ifzhfx;

	// Constructors

	/** default constructor */
	public HrXcGuidelineInfo() {
	}

	/** minimal constructor */
	public HrXcGuidelineInfo(String zbSeqno, String name, String realname) {
		this.zbSeqno = zbSeqno;
		this.name = name;
		this.realname = realname;
	}

	/** full constructor */
	public HrXcGuidelineInfo(String zbSeqno, String id, String name,
			String parentid, String sxLb, String sxTable, String jldw,
			Long zbjd, String fullname, String realname, String ifpercent,
			String zbZzlx, String state, String gkbmlx, Long pxh, String path,
			String memo, String inputtype, String zbTrcc, String ifzhfx) {
		this.zbSeqno = zbSeqno;
		this.id = id;
		this.name = name;
		this.parentid = parentid;
		this.sxLb = sxLb;
		this.sxTable = sxTable;
		this.jldw = jldw;
		this.zbjd = zbjd;
		this.fullname = fullname;
		this.realname = realname;
		this.ifpercent = ifpercent;
		this.zbZzlx = zbZzlx;
		this.state = state;
		this.gkbmlx = gkbmlx;
		this.pxh = pxh;
		this.path = path;
		this.memo = memo;
		this.inputtype = inputtype;
		this.zbTrcc = zbTrcc;
		this.ifzhfx = ifzhfx;
	}

	// Property accessors

	public String getZbSeqno() {
		return this.zbSeqno;
	}

	public void setZbSeqno(String zbSeqno) {
		this.zbSeqno = zbSeqno;
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getSxLb() {
		return this.sxLb;
	}

	public void setSxLb(String sxLb) {
		this.sxLb = sxLb;
	}

	public String getSxTable() {
		return this.sxTable;
	}

	public void setSxTable(String sxTable) {
		this.sxTable = sxTable;
	}

	public String getJldw() {
		return this.jldw;
	}

	public void setJldw(String jldw) {
		this.jldw = jldw;
	}

	public Long getZbjd() {
		return this.zbjd;
	}

	public void setZbjd(Long zbjd) {
		this.zbjd = zbjd;
	}

	public String getFullname() {
		return this.fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getRealname() {
		return this.realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getIfpercent() {
		return this.ifpercent;
	}

	public void setIfpercent(String ifpercent) {
		this.ifpercent = ifpercent;
	}

	public String getZbZzlx() {
		return this.zbZzlx;
	}

	public void setZbZzlx(String zbZzlx) {
		this.zbZzlx = zbZzlx;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getGkbmlx() {
		return this.gkbmlx;
	}

	public void setGkbmlx(String gkbmlx) {
		this.gkbmlx = gkbmlx;
	}

	public Long getPxh() {
		return this.pxh;
	}

	public void setPxh(Long pxh) {
		this.pxh = pxh;
	}

	public String getPath() {
		return this.path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getInputtype() {
		return this.inputtype;
	}

	public void setInputtype(String inputtype) {
		this.inputtype = inputtype;
	}

	public String getZbTrcc() {
		return this.zbTrcc;
	}

	public void setZbTrcc(String zbTrcc) {
		this.zbTrcc = zbTrcc;
	}

	public String getIfzhfx() {
		return this.ifzhfx;
	}

	public void setIfzhfx(String ifzhfx) {
		this.ifzhfx = ifzhfx;
	}

}