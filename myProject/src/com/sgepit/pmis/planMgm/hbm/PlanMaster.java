package com.sgepit.pmis.planMgm.hbm;

import java.util.Date;

import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.planMgm.dao.PlanMasterDAO;

/**
 * PlanMaster entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PlanMaster implements java.io.Serializable {

	// Fields

	private String uids;
	private String sjType;
	private String unitId;
	private String businessType;
	private String billState;
	private String state;
	private String operator;
	private Date operateTime;
	private String remark;
	private String conid;
	private String flowbh;
	private String fileLsh;
	private String fileName;
	private String pid;
	
	private String conno;//合同编号
	private String conname;//合同名称
	private String unitName;//单位名称
	
	private String operateTimeStr;//创建时间字符串
	

	// Constructors

	/** default constructor */
	public PlanMaster() {
	}

	/** minimal constructor */
	public PlanMaster(String uids, String sjType, String unitId,
			String businessType) {
		this.uids = uids;
		this.sjType = sjType;
		this.unitId = unitId;
		this.businessType = businessType;
	}

	public PlanMaster(String uids, String sjType, String unitId,
			String businessType, String billState, String state,
			String operator, Date operateTime, String remark, String conid,
			String flowbh, String fileLsh, String fileName, String pid) {
		super();
		this.uids = uids;
		this.sjType = sjType;
		this.unitId = unitId;
		this.businessType = businessType;
		this.billState = billState;
		this.state = state;
		this.operator = operator;
		this.operateTime = operateTime;
		this.remark = remark;
		this.conid = conid;
		this.flowbh = flowbh;
		this.fileLsh = fileLsh;
		this.fileName = fileName;
		this.pid = pid;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getSjType() {
		return sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getUnitId() {
		return unitId;
	}

	public void setUnitId(String unitId) {
		PlanMasterDAO dao = PlanMasterDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);		
		SgccIniUnit unit = (SgccIniUnit) dao.findBeanByProperty("com.sgepit.frame.sysman.hbm.SgccIniUnit", "unitid", unitId);
		this.unitId = unitId;
		this.unitName = unit.getUnitname();
	}

	public String getBusinessType() {
		return businessType;
	}

	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}

	public String getBillState() {
		return billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public Date getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Date operateTime) {
		this.operateTime = operateTime;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		PlanMasterDAO dao = PlanMasterDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);		
		ConOve conove = (ConOve) dao.findBeanByProperty("com.sgepit.pmis.contract.hbm.ConOve", "conid", conid);
		if (conove!=null) {
			this.conno = conove.getConno();
			this.conname = conove.getConname();
		}
		this.conid = conid;
	}

	public String getFlowbh() {
		return flowbh;
	}

	public void setFlowbh(String flowbh) {
		this.flowbh = flowbh;
	}

	public String getFileLsh() {
		return fileLsh;
	}

	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
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

	public String getUnitName() {
		return unitName;
	}

	public String getOperateTimeStr() {
		return operateTimeStr;
	}

	public void setOperateTimeStr(String operateTimeStr) {
		this.operateTimeStr = operateTimeStr;
	}

	

}