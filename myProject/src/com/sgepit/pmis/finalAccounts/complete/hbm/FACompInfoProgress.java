package com.sgepit.pmis.finalAccounts.complete.hbm;

import java.util.Date;
/**
 * 工程基本信息-工程进度表
 * @author pengy
 * @createtime 2013-06-27
 */
public class FACompInfoProgress {
	
	private String pid;
	private String uids;
	private String progName;
	private Date planDate;
	private Date assesDate;
	private Date actualDate;
	private Date createDate;
	private Long progNo;
	
	public FACompInfoProgress() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FACompInfoProgress(String pid, String uids, String progName,
			Date planDate, Date assesDate, Date actualDate, Date createDate,
			Long progNo) {
		super();
		this.pid = pid;
		this.uids = uids;
		this.progName = progName;
		this.planDate = planDate;
		this.assesDate = assesDate;
		this.actualDate = actualDate;
		this.createDate = createDate;
		this.progNo = progNo;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getProgName() {
		return progName;
	}

	public void setProgName(String progName) {
		this.progName = progName;
	}

	public Date getPlanDate() {
		return planDate;
	}

	public void setPlanDate(Date planDate) {
		this.planDate = planDate;
	}

	public Date getAssesDate() {
		return assesDate;
	}

	public void setAssesDate(Date assesDate) {
		this.assesDate = assesDate;
	}

	public Date getActualDate() {
		return actualDate;
	}

	public void setActualDate(Date actualDate) {
		this.actualDate = actualDate;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Long getProgNo() {
		return progNo;
	}

	public void setProgNo(Long progNo) {
		this.progNo = progNo;
	}

}
