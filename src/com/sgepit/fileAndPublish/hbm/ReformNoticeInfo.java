package com.sgepit.fileAndPublish.hbm;

import java.util.Date;

/**
 * 整改通知单信息表
 * @author pengy
 * @createtime 2013-08-12
 */

public class ReformNoticeInfo implements java.io.Serializable {

	// Fields

	private String reformUids;
	private String pid;
	private String comfileUids;//关联comfileinfo表的主键
	private String reportState;
	private Long isreform;
	private Date reformTime;
	private String reformOpinion;

	// Constructors

	/** default constructor */
	public ReformNoticeInfo() {
	}

	/** minimal constructor */
	public ReformNoticeInfo(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public ReformNoticeInfo(String reformUids, String pid, String comfileUids,
			String reportState, Long isreform, Date reformTime,
			String reformOpinion) {
		super();
		this.reformUids = reformUids;
		this.pid = pid;
		this.comfileUids = comfileUids;
		this.reportState = reportState;
		this.isreform = isreform;
		this.reformTime = reformTime;
		this.reformOpinion = reformOpinion;
	}

	// Property accessors

	public String getReformUids() {
		return reformUids;
	}

	public void setReformUids(String reformUids) {
		this.reformUids = reformUids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getComfileUids() {
		return comfileUids;
	}

	public void setComfileUids(String comfileUids) {
		this.comfileUids = comfileUids;
	}

	public String getReportState() {
		return reportState;
	}

	public void setReportState(String reportState) {
		this.reportState = reportState;
	}

	public Long getIsreform() {
		return isreform;
	}

	public void setIsreform(Long isreform) {
		this.isreform = isreform;
	}

	public Date getReformTime() {
		return reformTime;
	}

	public void setReformTime(Date reformTime) {
		this.reformTime = reformTime;
	}

	public String getReformOpinion() {
		return reformOpinion;
	}

	public void setReformOpinion(String reformOpinion) {
		this.reformOpinion = reformOpinion;
	}

}