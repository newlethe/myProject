package com.sgepit.pmis.planMgm.hbm;

import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.planMgm.dao.PlanMonthDAO;

/**
 * PlanMonth entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PlanMonth implements java.io.Serializable {

	// Fields

	private String uids;
	private String masterId;
	private String businessType;
	private String sjType;
	private String quantitiesId;
	private String bdgId;
	private String contractId;
	private String unitId;
	private String dataType;
	private Double monthQuantities;
	private Double monthAmount;
	private Double quantitiesAddup;
	private Double perQuantitiesAddup;
	private Double amountAddup;
	private Double perAmountAddup;
	private String remark;

	private String quantitiesName;
	private Double quantitiesPrice;
	
	private String pid;
	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	/** default constructor */
	public PlanMonth() {
	}

	/** minimal constructor */
	public PlanMonth(String uids, String masterId, String businessType,
			String sjType, String quantitiesId, String unitId) {
		this.uids = uids;
		this.masterId = masterId;
		this.businessType = businessType;
		this.sjType = sjType;
		this.quantitiesId = quantitiesId;
		this.unitId = unitId;
	}

	/** full constructor */
	public PlanMonth(String uids, String masterId, String businessType,
			String sjType, String quantitiesId, String bdgId,
			String contractId, String unitId, String dataType,
			Double monthQuantities, Double monthAmount, Double quantitiesAddup,
			Double perQuantitiesAddup, Double amountAddup,
			Double perAmountAddup, String remark) {
		this.uids = uids;
		this.masterId = masterId;
		this.businessType = businessType;
		this.sjType = sjType;
		this.quantitiesId = quantitiesId;
		this.bdgId = bdgId;
		this.contractId = contractId;
		this.unitId = unitId;
		this.dataType = dataType;
		this.monthQuantities = monthQuantities;
		this.monthAmount = monthAmount;
		this.quantitiesAddup = quantitiesAddup;
		this.perQuantitiesAddup = perQuantitiesAddup;
		this.amountAddup = amountAddup;
		this.perAmountAddup = perAmountAddup;
		this.remark = remark;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getMasterId() {
		return this.masterId;
	}

	public void setMasterId(String masterId) {
		this.masterId = masterId;
	}

	public String getBusinessType() {
		return this.businessType;
	}

	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getQuantitiesId() {
		return this.quantitiesId;
	}

	public void setQuantitiesId(String quantitiesId) {
		this.quantitiesId = quantitiesId;
		if (quantitiesId!=null && quantitiesId.length()>0) {
			PlanMonthDAO dao = PlanMonthDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);		
			BdgProject bdgP = (BdgProject) dao.findById("com.sgepit.pmis.budget.hbm.BdgProject",quantitiesId);
			this.quantitiesName = bdgP.getProname();
			this.quantitiesPrice = bdgP.getPrice();
		}
	}

	public String getBdgId() {
		return this.bdgId;
	}

	public void setBdgId(String bdgId) {
		this.bdgId = bdgId;
	}

	public String getContractId() {
		return this.contractId;
	}

	public void setContractId(String contractId) {
		this.contractId = contractId;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getDataType() {
		return this.dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public Double getMonthQuantities() {
		return this.monthQuantities;
	}

	public void setMonthQuantities(Double monthQuantities) {
		this.monthQuantities = monthQuantities;
	}

	public Double getMonthAmount() {
		return this.monthAmount;
	}

	public void setMonthAmount(Double monthAmount) {
		this.monthAmount = monthAmount;
	}

	public Double getQuantitiesAddup() {
		return this.quantitiesAddup;
	}

	public void setQuantitiesAddup(Double quantitiesAddup) {
		this.quantitiesAddup = quantitiesAddup;
	}

	public Double getPerQuantitiesAddup() {
		return this.perQuantitiesAddup;
	}

	public void setPerQuantitiesAddup(Double perQuantitiesAddup) {
		this.perQuantitiesAddup = perQuantitiesAddup;
	}

	public Double getAmountAddup() {
		return this.amountAddup;
	}

	public void setAmountAddup(Double amountAddup) {
		this.amountAddup = amountAddup;
	}

	public Double getPerAmountAddup() {
		return this.perAmountAddup;
	}

	public void setPerAmountAddup(Double perAmountAddup) {
		this.perAmountAddup = perAmountAddup;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getQuantitiesName() {
		return quantitiesName;
	}

	public Double getQuantitiesPrice() {
		return quantitiesPrice;
	}

}