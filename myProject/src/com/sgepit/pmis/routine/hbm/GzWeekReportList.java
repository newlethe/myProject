package com.sgepit.pmis.routine.hbm;

/**
 * GzWeekReportList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class GzWeekReportList implements java.io.Serializable {

	// Fields

	private String uuid;
	private String reportuuid;
	private String reportcontent;
	private String contenttype;
	private String memo;
	private String memo1;
	private String remove;

	// Constructors

	/** default constructor */
	public GzWeekReportList() {
	}

	/** full constructor */
	public GzWeekReportList(String reportuuid, String reportcontent,
			String contenttype, String memo, String memo1, String remove) {
		this.reportuuid = reportuuid;
		this.reportcontent = reportcontent;
		this.contenttype = contenttype;
		this.memo = memo;
		this.memo1 = memo1;
		this.remove = remove;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getReportuuid() {
		return this.reportuuid;
	}

	public void setReportuuid(String reportuuid) {
		this.reportuuid = reportuuid;
	}

	public String getReportcontent() {
		return this.reportcontent;
	}

	public void setReportcontent(String reportcontent) {
		this.reportcontent = reportcontent;
	}

	public String getContenttype() {
		return this.contenttype;
	}

	public void setContenttype(String contenttype) {
		this.contenttype = contenttype;
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

	public String getRemove() {
		return this.remove;
	}

	public void setRemove(String remove) {
		this.remove = remove;
	}

}