package com.sgepit.pcmis.warn.hbm;

import java.util.Date;

/**
 * PcWarnInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcWarnInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private Date warntime;
	private String moduleid;
	private String warncontent;
	private String warnlevel;
	private String warnstatus;
	private String warncompletion;
	private String detailinfo;
	private Double resultdata;
	private String warnrulesid;//来自的预警规则Id
    private String businesskey; //关联业务表主键
    private String businessdata;//关联业务表数据
    private String dutypersoninfo;
    private String scLinkValue;     //源数据关联字段取值等于比较数据关联字段取值
	public PcWarnInfo(String uids, String pid, Date warntime, String moduleid,
			String warncontent, String warnlevel, String warnstatus,
			String warncompletion, String detailinfo, Double resultdata,
			String warnrulesid, String businesskey, String businessdata,
			String dutypersoninfo, String scLinkValue) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.warntime = warntime;
		this.moduleid = moduleid;
		this.warncontent = warncontent;
		this.warnlevel = warnlevel;
		this.warnstatus = warnstatus;
		this.warncompletion = warncompletion;
		this.detailinfo = detailinfo;
		this.resultdata = resultdata;
		this.warnrulesid = warnrulesid;
		this.businesskey = businesskey;
		this.businessdata = businessdata;
		this.dutypersoninfo = dutypersoninfo;
		this.scLinkValue = scLinkValue;
	}

	/** default constructor */
	public PcWarnInfo() {
	}

	/** full constructor */

	// Property accessors

	public String getUids() {
		return this.uids;
	}
	public String getDutypersoninfo() {
		return dutypersoninfo;
	}

	public void setDutypersoninfo(String dutypersoninfo) {
		this.dutypersoninfo = dutypersoninfo;
	}

	public String getBusinesskey() {
		return businesskey;
	}

	public void setBusinesskey(String businesskey) {
		this.businesskey = businesskey;
	}

	public String getBusinessdata() {
		return businessdata;
	}

	public void setBusinessdata(String businessdata) {
		this.businessdata = businessdata;
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

	public String getModuleid() {
		return moduleid;
	}

	public void setModuleid(String moduleid) {
		this.moduleid = moduleid;
	}

	public String getWarncontent() {
		return this.warncontent;
	}

	public void setWarncontent(String warncontent) {
		this.warncontent = warncontent;
	}

	public String getWarnlevel() {
		return this.warnlevel;
	}

	public void setWarnlevel(String warnlevel) {
		this.warnlevel = warnlevel;
	}

	public String getWarnstatus() {
		return this.warnstatus;
	}

	public void setWarnstatus(String warnstatus) {
		this.warnstatus = warnstatus;
	}

	public String getWarncompletion() {
		return this.warncompletion;
	}

	public void setWarncompletion(String warncompletion) {
		this.warncompletion = warncompletion;
	}

	public String getDetailinfo() {
		return this.detailinfo;
	}

	public void setDetailinfo(String detailinfo) {
		this.detailinfo = detailinfo;
	}

	public Date getWarntime() {
		return warntime;
	}

	public void setWarntime(Date warntime) {
		this.warntime = warntime;
	}

	public Double getResultdata() {
		return resultdata;
	}

	public void setResultdata(Double resultdata) {
		this.resultdata = resultdata;
	}

	public String getWarnrulesid() {
		return warnrulesid;
	}

	public void setWarnrulesid(String warnrulesid) {
		this.warnrulesid = warnrulesid;
	}

	public String getScLinkValue() {
		return scLinkValue;
	}

	public void setScLinkValue(String scLinkValue) {
		this.scLinkValue = scLinkValue;
	}
}