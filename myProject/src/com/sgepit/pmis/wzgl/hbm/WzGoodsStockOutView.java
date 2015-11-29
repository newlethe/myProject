package com.sgepit.pmis.wzgl.hbm;
import java.util.Date;

public class WzGoodsStockOutView implements java.io.Serializable {
	
	private String uids;
	private String conno;
	private String conmoneyno;
	private String outNo;
	private Date outDate;
	private String unitname;
	private String bdgname;
	private String equname;
	private String waretype;
	private String wareno;
	private String type;
	private String kksNo;
	private String userPart;
	private String installation;//安装主体设备（建筑物）
	private String financial;
	//供货商
	private String conPartybNo;
	//合同名称
	private String conname;

	private String pid;
	private String recipientsUnit;//出库单位
	private String subjectAllname;//财务科目全称
	private String fileid;
	
    public WzGoodsStockOutView() {
		super();
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getConno() {
		return conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConmoneyno() {
		return conmoneyno;
	}

	public void setConmoneyno(String conmoneyno) {
		this.conmoneyno = conmoneyno;
	}

	public String getOutNo() {
		return outNo;
	}

	public void setOutNo(String outNo) {
		this.outNo = outNo;
	}

	public Date getOutDate() {
		return outDate;
	}

	public void setOutDate(Date outDate) {
		this.outDate = outDate;
	}

	public String getUnitname() {
		return unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public String getEquname() {
		return equname;
	}

	public void setEquname(String equname) {
		this.equname = equname;
	}

	public String getWaretype() {
		return waretype;
	}

	public void setWaretype(String waretype) {
		this.waretype = waretype;
	}

	public String getWareno() {
		return wareno;
	}

	public void setWareno(String wareno) {
		this.wareno = wareno;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getKksNo() {
		return kksNo;
	}

	public void setKksNo(String kksNo) {
		this.kksNo = kksNo;
	}

	public String getUserPart() {
		return userPart;
	}

	public void setUserPart(String userPart) {
		this.userPart = userPart;
	}

	public String getInstallation() {
		return installation;
	}

	public void setInstallation(String installation) {
		this.installation = installation;
	}

	public String getFinancial() {
		return financial;
	}

	public void setFinancial(String financial) {
		this.financial = financial;
	}

	public String getConPartybNo() {
		return conPartybNo;
	}

	public void setConPartybNo(String conPartybNo) {
		this.conPartybNo = conPartybNo;
	}

	public String getConname() {
		return conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getRecipientsUnit() {
		return recipientsUnit;
	}

	public void setRecipientsUnit(String recipientsUnit) {
		this.recipientsUnit = recipientsUnit;
	}

	public String getSubjectAllname() {
		return subjectAllname;
	}

	public void setSubjectAllname(String subjectAllname) {
		this.subjectAllname = subjectAllname;
	}

	public String getFileid() {
		return fileid;
	}

	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

}
