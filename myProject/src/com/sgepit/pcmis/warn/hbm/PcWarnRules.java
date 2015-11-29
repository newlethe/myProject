package com.sgepit.pcmis.warn.hbm;

/**
 * PcWarnRules entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcWarnRules implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String warnrulename;
	private String sourcedatatable;
	private String sourcedataitem;
	private String comdatatable;
	private String comdataitem;
	private String calculatetype;
	private Double rangemin;
	private Double rangemax;
	private String warnlevel;
	private String warnhelp;
	private String memo;
	private String moduleid;
	private String sourcerelateitem;
	private String sourcehidecon;
	private String scalculatemode;
	private String comrelateitem;
	private String comhidecon;
	private String comcalculatemode;
	private String mid;
	
	
	public PcWarnRules() {
		super();
		// TODO Auto-generated constructor stub
	}
	public PcWarnRules(String uids, String pid, String warnrulename,
			String sourcedatatable, String sourcedataitem, String comdatatable,
			String comdataitem, String calculatetype, Double rangemin,
			Double rangemax, String warnlevel, String warnhelp, String memo,
			String moduleid, String sourcerelateitem, String sourcehidecon,
			String scalculatemode, String comrelateitem, String comhidecon,
			String comcalculatemode, String mid) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.warnrulename = warnrulename;
		this.sourcedatatable = sourcedatatable;
		this.sourcedataitem = sourcedataitem;
		this.comdatatable = comdatatable;
		this.comdataitem = comdataitem;
		this.calculatetype = calculatetype;
		this.rangemin = rangemin;
		this.rangemax = rangemax;
		this.warnlevel = warnlevel;
		this.warnhelp = warnhelp;
		this.memo = memo;
		this.moduleid = moduleid;
		this.sourcerelateitem = sourcerelateitem;
		this.sourcehidecon = sourcehidecon;
		this.scalculatemode = scalculatemode;
		this.comrelateitem = comrelateitem;
		this.comhidecon = comhidecon;
		this.comcalculatemode = comcalculatemode;
		this.mid = mid;
	}

	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getWarnrulename() {
		return warnrulename;
	}
	public void setWarnrulename(String warnrulename) {
		this.warnrulename = warnrulename;
	}
	public String getSourcedatatable() {
		return sourcedatatable;
	}
	public void setSourcedatatable(String sourcedatatable) {
		this.sourcedatatable = sourcedatatable;
	}
	public String getSourcedataitem() {
		return sourcedataitem;
	}
	public void setSourcedataitem(String sourcedataitem) {
		this.sourcedataitem = sourcedataitem;
	}
	public String getComdatatable() {
		return comdatatable;
	}
	public void setComdatatable(String comdatatable) {
		this.comdatatable = comdatatable;
	}
	public String getComdataitem() {
		return comdataitem;
	}
	public void setComdataitem(String comdataitem) {
		this.comdataitem = comdataitem;
	}
	public String getCalculatetype() {
		return calculatetype;
	}
	public void setCalculatetype(String calculatetype) {
		this.calculatetype = calculatetype;
	}
	public Double getRangemin() {
		return rangemin;
	}
	public void setRangemin(Double rangemin) {
		this.rangemin = rangemin;
	}
	public Double getRangemax() {
		return rangemax;
	}
	public void setRangemax(Double rangemax) {
		this.rangemax = rangemax;
	}
	public String getWarnlevel() {
		return warnlevel;
	}
	public void setWarnlevel(String warnlevel) {
		this.warnlevel = warnlevel;
	}
	public String getWarnhelp() {
		return warnhelp;
	}
	public void setWarnhelp(String warnhelp) {
		this.warnhelp = warnhelp;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getModuleid() {
		return moduleid;
	}
	public void setModuleid(String moduleid) {
		this.moduleid = moduleid;
	}
	public String getSourcerelateitem() {
		return sourcerelateitem;
	}
	public void setSourcerelateitem(String sourcerelateitem) {
		this.sourcerelateitem = sourcerelateitem;
	}
	public String getSourcehidecon() {
		return sourcehidecon;
	}
	public void setSourcehidecon(String sourcehidecon) {
		this.sourcehidecon = sourcehidecon;
	}
	public String getScalculatemode() {
		return scalculatemode;
	}
	public void setScalculatemode(String scalculatemode) {
		this.scalculatemode = scalculatemode;
	}
	public String getComrelateitem() {
		return comrelateitem;
	}
	public void setComrelateitem(String comrelateitem) {
		this.comrelateitem = comrelateitem;
	}
	public String getComhidecon() {
		return comhidecon;
	}
	public void setComhidecon(String comhidecon) {
		this.comhidecon = comhidecon;
	}
	public String getComcalculatemode() {
		return comcalculatemode;
	}
	public void setComcalculatemode(String comcalculatemode) {
		this.comcalculatemode = comcalculatemode;
	}
	public String getMid() {
		return mid;
	}
	public void setMid(String mid) {
		this.mid = mid;
	}
}