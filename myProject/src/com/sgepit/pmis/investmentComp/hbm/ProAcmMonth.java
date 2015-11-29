package com.sgepit.pmis.investmentComp.hbm;

import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.investmentComp.dao.ProAcmDAO;

/**
 * ProAcmMonth entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ProAcmMonth implements java.io.Serializable {

	// Fields

	private String uids;
	private String monId;
	private String conid;
	private String conno; //非数据库字段，设置conid时进行设置
	private String conname;//非数据库字段，设置conid时进行设置
	private String month;
	private Long billstate;
	private Double decmoney;
	private Double checkmoney;
	private Double ratiftmoney;
	
	private String pid;
	private String unitId;
	private String unitName;//非数据库字段，设置unitId时进行设置
	private String operator;
	private String auditState;//稽核状态
	private String reportUnit;//申报单位
	// Constructors

	/** default constructor */
	public ProAcmMonth() {
	}

	/** minimal constructor */
	public ProAcmMonth(String conid) {
		this.conid = conid;
	}

	/** full constructor */
	public ProAcmMonth(String uids, String monId, String conid, String conno,
			String conname, String month, Long billstate, Double decmoney,
			Double checkmoney, Double ratiftmoney, String pid, String unitId,
			String unitName, String operator, String auditState,
			String reportUnit) {
		super();
		this.uids = uids;
		this.monId = monId;
		this.conid = conid;
		this.conno = conno;
		this.conname = conname;
		this.month = month;
		this.billstate = billstate;
		this.decmoney = decmoney;
		this.checkmoney = checkmoney;
		this.ratiftmoney = ratiftmoney;
		this.pid = pid;
		this.unitId = unitId;
		this.unitName = unitName;
		this.operator = operator;
		this.auditState = auditState;
		this.reportUnit = reportUnit;
	}

	// Property accessors

	public String getMonId() {
		return this.monId;
	}

	public void setMonId(String monId) {
		this.monId = monId;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
		ProAcmDAO dao = ProAcmDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);
		ConOve conove = (ConOve) dao.findBeanByProperty("com.sgepit.pmis.contract.hbm.ConOve", "conid", conid);
		if (conove!=null) {
			this.conno = conove.getConno();
			this.conname = conove.getConname();
		}
	}

	public String getMonth() {
		return this.month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public Double getDecmoney() {
		return this.decmoney;
	}

	public void setDecmoney(Double decmoney) {
		this.decmoney = decmoney;
	}

	public Double getCheckmoney() {
		return this.checkmoney;
	}

	public void setCheckmoney(Double checkmoney) {
		this.checkmoney = checkmoney;
	}

	public Double getRatiftmoney() {
		return this.ratiftmoney;
	}

	public void setRatiftmoney(Double ratiftmoney) {
		this.ratiftmoney = ratiftmoney;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConno() {
		return conno;
	}

	public String getConname() {
		return conname;
	}

	public String getUnitId() {
		return unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
		ProAcmDAO dao = ProAcmDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);		
		SgccIniUnit unit = (SgccIniUnit) dao.findBeanByProperty("com.sgepit.frame.sysman.hbm.SgccIniUnit", "unitid", unitId);
		if(unit != null){
			this.unitName = unit.getUnitname();
		}
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getUnitName() {
		return unitName;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getAuditState() {
		return auditState;
	}

	public void setAuditState(String auditState) {
		this.auditState = auditState;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public String getReportUnit() {
		return reportUnit;
	}

	public void setReportUnit(String reportUnit) {
		this.reportUnit = reportUnit;
	}

}