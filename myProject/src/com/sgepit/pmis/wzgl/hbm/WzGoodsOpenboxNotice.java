package com.sgepit.pmis.wzgl.hbm;
import java.util.Date;

/**
 * yanglh
 * 2012-12-18
 */

public class WzGoodsOpenboxNotice implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String conid;
	private String treeuids;
	private Integer finished;
	private Integer isCheck;
	private String noticeNo;
	private Date noticeDate;
	private Date openDate;
	private String openPlace;
	private String openUnit;
	private String equDesc;
	private String ownerNo;
	private String professinal;
	private String remark;
	
	private String flowid;
	private String billState;
	private String projectName;
	
	private String dhShi;
	private String dhFen;

	//权限控制新增字段
	private String createMan;//创建人ID
	private String createUnit;//创建单位
	
	// Constructors

	/** default constructor */
	public WzGoodsOpenboxNotice() {
	}

	/** minimal constructor */
	public WzGoodsOpenboxNotice(String pid, String conid, String treeuids) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
	}

	/** full constructor */
	public WzGoodsOpenboxNotice(String pid, String conid, String treeuids,
			Integer finished, Integer isCheck, String noticeNo, Date noticeDate, Date openDate,
			String openPlace, String openUnit, String equDesc, String ownerNo,
			String professinal, String remark,String dhShi,String dhFen) {
		this.pid = pid;
		this.conid = conid;
		this.treeuids = treeuids;
		this.finished = finished;
		this.isCheck = isCheck;
		this.noticeNo = noticeNo;
		this.noticeDate = noticeDate;
		this.openDate = openDate;
		this.openPlace = openPlace;
		this.openUnit = openUnit;
		this.equDesc = equDesc;
		this.ownerNo = ownerNo;
		this.professinal = professinal;
		this.remark = remark;
		this.dhShi=  dhShi;
		this.dhFen = dhFen;
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

	public String getTreeuids() {
		return this.treeuids;
	}

	public void setTreeuids(String treeuids) {
		this.treeuids = treeuids;
	}

	public Integer getFinished() {
		return this.finished;
	}

	public void setFinished(Integer finished) {
		this.finished = finished;
	}

	public String getNoticeNo() {
		return this.noticeNo;
	}

	public void setNoticeNo(String noticeNo) {
		this.noticeNo = noticeNo;
	}

	public Date getNoticeDate() {
		return this.noticeDate;
	}

	public void setNoticeDate(Date noticeDate) {
		this.noticeDate = noticeDate;
	}

	public Date getOpenDate() {
		return this.openDate;
	}

	public void setOpenDate(Date openDate) {
		this.openDate = openDate;
	}

	public String getOpenPlace() {
		return this.openPlace;
	}

	public void setOpenPlace(String openPlace) {
		this.openPlace = openPlace;
	}

	public String getOpenUnit() {
		return this.openUnit;
	}

	public void setOpenUnit(String openUnit) {
		this.openUnit = openUnit;
	}

	public String getEquDesc() {
		return this.equDesc;
	}

	public void setEquDesc(String equDesc) {
		this.equDesc = equDesc;
	}

	public String getOwnerNo() {
		return this.ownerNo;
	}

	public void setOwnerNo(String ownerNo) {
		this.ownerNo = ownerNo;
	}

	public String getProfessinal() {
		return this.professinal;
	}

	public void setProfessinal(String professinal) {
		this.professinal = professinal;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getIsCheck() {
		return isCheck;
	}

	public void setIsCheck(Integer isCheck) {
		this.isCheck = isCheck;
	}

	public String getFlowid() {
		return flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getDhShi() {
		return dhShi;
	}

	public void setDhShi(String dhShi) {
		this.dhShi = dhShi;
	}

	public String getDhFen() {
		return dhFen;
	}

	public void setDhFen(String dhFen) {
		this.dhFen = dhFen;
	}

	public String getCreateMan() {
		return createMan;
	}

	public void setCreateMan(String createMan) {
		this.createMan = createMan;
	}

	public String getCreateUnit() {
		return createUnit;
	}

	public void setCreateUnit(String createUnit) {
		this.createUnit = createUnit;
	}

}