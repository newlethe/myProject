package com.sgepit.pmis.gantt.hbm;

import java.util.Date;

/**
 * EdoProject entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EdoProject implements java.io.Serializable {

	// Fields

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String uid;
	private String name;
	private Date startdate;
	private Date finishdate;
	private Date creationdate;
	private Date lastsaved;
	private String calendaruid;
	private Long weekstartday;
	private String defaultstarttime;
	private String defaultfinishtime;
	private Long minutesperday;
	private Long minutesperweek;
	private Long dayspermonth;
	private String Pid;

	// Constructors

	/** default constructor */
	public EdoProject() {
	}

	/** minimal constructor */
	public EdoProject(String uid) {
		this.uid = uid;
	}

	/** full constructor */
	public EdoProject(String uid, String name, Date startdate, Date finishdate,
			Date creationdate, Date lastsaved, String calendaruid,
			Long weekstartday, String defaultstarttime,
			String defaultfinishtime, Long minutesperday, Long minutesperweek,
			Long dayspermonth,String Pid) {
		this.uid = uid;
		this.name = name;
		this.startdate = startdate;
		this.finishdate = finishdate;
		this.creationdate = creationdate;
		this.lastsaved = lastsaved;
		this.calendaruid = calendaruid;
		this.weekstartday = weekstartday;
		this.defaultstarttime = defaultstarttime;
		this.defaultfinishtime = defaultfinishtime;
		this.minutesperday = minutesperday;
		this.minutesperweek = minutesperweek;
		this.dayspermonth = dayspermonth;
		this.Pid = Pid;
	}

	// Property accessors

	public String getUid() {
		return this.uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}
	public String getPid() {
		return this.Pid;
	}

	public void setPid(String Pid) {
		this.Pid = Pid;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getStartdate() {
		return this.startdate;
	}

	public void setStartdate(Date startdate) {
		this.startdate = startdate;
	}

	public Date getFinishdate() {
		return this.finishdate;
	}

	public void setFinishdate(Date finishdate) {
		this.finishdate = finishdate;
	}

	public Date getCreationdate() {
		return this.creationdate;
	}

	public void setCreationdate(Date creationdate) {
		this.creationdate = creationdate;
	}

	public Date getLastsaved() {
		return this.lastsaved;
	}

	public void setLastsaved(Date lastsaved) {
		this.lastsaved = lastsaved;
	}

	public String getCalendaruid() {
		return this.calendaruid;
	}

	public void setCalendaruid(String calendaruid) {
		this.calendaruid = calendaruid;
	}

	public Long getWeekstartday() {
		return this.weekstartday;
	}

	public void setWeekstartday(Long weekstartday) {
		this.weekstartday = weekstartday;
	}

	public String getDefaultstarttime() {
		return this.defaultstarttime;
	}

	public void setDefaultstarttime(String defaultstarttime) {
		this.defaultstarttime = defaultstarttime;
	}

	public String getDefaultfinishtime() {
		return this.defaultfinishtime;
	}

	public void setDefaultfinishtime(String defaultfinishtime) {
		this.defaultfinishtime = defaultfinishtime;
	}

	public Long getMinutesperday() {
		return this.minutesperday;
	}

	public void setMinutesperday(Long minutesperday) {
		this.minutesperday = minutesperday;
	}

	public Long getMinutesperweek() {
		return this.minutesperweek;
	}

	public void setMinutesperweek(Long minutesperweek) {
		this.minutesperweek = minutesperweek;
	}

	public Long getDayspermonth() {
		return this.dayspermonth;
	}

	public void setDayspermonth(Long dayspermonth) {
		this.dayspermonth = dayspermonth;
	}

}