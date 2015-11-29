package com.sgepit.frame.sysman.hbm;

/**
 * SysPortletConfig entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SysPortletConfig implements java.io.Serializable {

	// Fields

	private String configId;
	private String userId;
	private String portletId;
	private String portletName;
	private String rowIdx;
	private String colIdx;
	private String ph;
	private String customParams;
	private String show;
	private String portletCode;

	// Constructors

	/** default constructor */
	public SysPortletConfig() {
	}

	/** minimal constructor */
	public SysPortletConfig(String userId, String portletId) {
		this.userId = userId;
		this.portletId = portletId;
	}

	/** full constructor */
	public SysPortletConfig(String userId, String portletId, String row,
			String col, String height, String customParams,
			String show) {
		this.userId = userId;
		this.portletId = portletId;
		this.rowIdx = row;
		this.colIdx = col;
		this.ph = height;
		this.customParams = customParams;
		this.show = show;
	}

	// Property accessors

	public String getConfigId() {
		return this.configId;
	}

	public void setConfigId(String configId) {
		this.configId = configId;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getPortletId() {
		return this.portletId;
	}

	public void setPortletId(String portletId) {
		this.portletId = portletId;
	}

	public String getCustomParams() {
		return this.customParams;
	}

	public void setCustomParams(String customParams) {
		this.customParams = customParams;
	}

	public String getShow() {
		return this.show;
	}

	public void setShow(String show) {
		this.show = show;
	}

	public String getPortletName() {
		return portletName;
	}

	public void setPortletName(String portletName) {
		this.portletName = portletName;
	}

	public String getRowIdx() {
		return rowIdx;
	}

	public void setRowIdx(String rowIdx) {
		this.rowIdx = rowIdx;
	}

	public String getColIdx() {
		return colIdx;
	}

	public void setColIdx(String colIdx) {
		this.colIdx = colIdx;
	}

	public String getPortletCode() {
		return portletCode;
	}

	public void setPortletCode(String portletCode) {
		this.portletCode = portletCode;
	}
	
	public String getPh() {
		return ph;
	}

	public void setPh(String ph) {
		this.ph = ph;
	}

}