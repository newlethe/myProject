package com.sgepit.pmis.rlzj.hbm;

import java.math.BigDecimal;

/**
 * HrSalaryTemplateItem entity. @author MyEclipse Persistence Tools
 */

public class HrSalaryTemplateItem implements java.io.Serializable {

	// Fields

	private String uids;
	private String templateId;
	private String itemId;
	private String type;
	private BigDecimal orderNum;

	// Constructors

	/** default constructor */
	public HrSalaryTemplateItem() {
	}

	/** full constructor */
	public HrSalaryTemplateItem(String templateId, String itemId) {
		this.templateId = templateId;
		this.itemId = itemId;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTemplateId() {
		return this.templateId;
	}

	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}

	public String getItemId() {
		return this.itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public BigDecimal getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(BigDecimal orderNum) {
		this.orderNum = orderNum;
	}

}