package com.sgepit.pmis.wzgl.hbm;

import java.util.Date;

/**
 * WzStockTab entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzStockTab implements java.io.Serializable {

	// Fields

	private String tabname;
	private Date sttime;
	private Date edtime;

	// Constructors

	/** default constructor */
	public WzStockTab() {
	}

	/** full constructor */
	public WzStockTab(Date sttime, Date edtime) {
		this.sttime = sttime;
		this.edtime = edtime;
	}

	// Property accessors

	public String getTabname() {
		return this.tabname;
	}

	public void setTabname(String tabname) {
		this.tabname = tabname;
	}

	public Date getSttime() {
		return this.sttime;
	}

	public void setSttime(Date sttime) {
		this.sttime = sttime;
	}

	public Date getEdtime() {
		return this.edtime;
	}

	public void setEdtime(Date edtime) {
		this.edtime = edtime;
	}

}