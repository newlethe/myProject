package com.sgepit.pmis.planMgm.hbm;

import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.planMgm.dao.PlanMonthDAO;

/**
 * PlanYear entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PlanYear implements java.io.Serializable {

	// Fields

	private String uids;
	private String masterId;
	private String sjType;
	private String businessType;
	private String quantitiesId;
	private String bdgId;
	private String contractId;
	private String unitId;
	private String dataType;
	private Double m01;
	private Double m02;
	private Double m03;
	private Double m04;
	private Double m05;
	private Double m06;
	private Double m07;
	private Double m08;
	private Double m09;
	private Double m10;
	private Double m11;
	private Double m12;
	private Double yearQuantities;
	private Double yearAmount;
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
	public PlanYear() {
	}

	/** minimal constructor */
	public PlanYear(String uids, String masterId, String sjType,
			String businessType, String contractId, String unitId) {
		this.uids = uids;
		this.masterId = masterId;
		this.sjType = sjType;
		this.businessType = businessType;
		this.contractId = contractId;
		this.unitId = unitId;
	}

	/** full constructor */
	public PlanYear(String uids, String masterId, String sjType,
			String businessType, String quantitiesId, String bdgId,
			String contractId, String unitId, String dataType, Double m01,
			Double m02, Double m03, Double m04, Double m05, Double m06,
			Double m07, Double m08, Double m09, Double m10, Double m11,
			Double m12, Double yearQuantities, Double yearAmount,
			Double quantitiesAddup, Double perQuantitiesAddup,
			Double amountAddup, Double perAmountAddup, String remark) {
		this.uids = uids;
		this.masterId = masterId;
		this.sjType = sjType;
		this.businessType = businessType;
		this.quantitiesId = quantitiesId;
		this.bdgId = bdgId;
		this.contractId = contractId;
		this.unitId = unitId;
		this.dataType = dataType;
		this.m01 = m01;
		this.m02 = m02;
		this.m03 = m03;
		this.m04 = m04;
		this.m05 = m05;
		this.m06 = m06;
		this.m07 = m07;
		this.m08 = m08;
		this.m09 = m09;
		this.m10 = m10;
		this.m11 = m11;
		this.m12 = m12;
		this.yearQuantities = yearQuantities;
		this.yearAmount = yearAmount;
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

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getBusinessType() {
		return this.businessType;
	}

	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}

	public String getQuantitiesId() {
		return this.quantitiesId;
	}

	public void setQuantitiesId(String quantitiesId) {
		this.quantitiesId = quantitiesId;
		if (quantitiesId!=null) {
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

	public Double getM01() {
		return this.m01;
	}

	public void setM01(Double m01) {
		this.m01 = m01;
	}

	public Double getM02() {
		return this.m02;
	}

	public void setM02(Double m02) {
		this.m02 = m02;
	}

	public Double getM03() {
		return this.m03;
	}

	public void setM03(Double m03) {
		this.m03 = m03;
	}

	public Double getM04() {
		return this.m04;
	}

	public void setM04(Double m04) {
		this.m04 = m04;
	}

	public Double getM05() {
		return this.m05;
	}

	public void setM05(Double m05) {
		this.m05 = m05;
	}

	public Double getM06() {
		return this.m06;
	}

	public void setM06(Double m06) {
		this.m06 = m06;
	}

	public Double getM07() {
		return this.m07;
	}

	public void setM07(Double m07) {
		this.m07 = m07;
	}

	public Double getM08() {
		return this.m08;
	}

	public void setM08(Double m08) {
		this.m08 = m08;
	}

	public Double getM09() {
		return this.m09;
	}

	public void setM09(Double m09) {
		this.m09 = m09;
	}

	public Double getM10() {
		return this.m10;
	}

	public void setM10(Double m10) {
		this.m10 = m10;
	}

	public Double getM11() {
		return this.m11;
	}

	public void setM11(Double m11) {
		this.m11 = m11;
	}

	public Double getM12() {
		return this.m12;
	}

	public void setM12(Double m12) {
		this.m12 = m12;
	}

	public Double getYearQuantities() {
		return this.yearQuantities;
	}

	public void setYearQuantities(Double yearQuantities) {
		this.yearQuantities = yearQuantities;
	}

	public Double getYearAmount() {
		return this.yearAmount;
	}

	public void setYearAmount(Double yearAmount) {
		this.yearAmount = yearAmount;
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