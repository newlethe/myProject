package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrSalaryMaster entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrSalaryDetail implements java.io.Serializable {

	// Fields
    String uids;
    String sj_type;
    String dept_id;
    String userid;
    String item_id;
    Double value;
    String remark;
    String report_id;
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getSj_type() {
		return sj_type;
	}
	public void setSj_type(String sj_type) {
		this.sj_type = sj_type;
	}
	public String getDept_id() {
		return dept_id;
	}
	public void setDept_id(String dept_id) {
		this.dept_id = dept_id;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getItem_id() {
		return item_id;
	}
	public void setItem_id(String item_id) {
		this.item_id = item_id;
	}
	public Double getValue() {
		return value;
	}
	public void setValue(Double value) {
		this.value = value;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getReport_id() {
		return report_id;
	}
	public void setReport_id(String report_id) {
		this.report_id = report_id;
	}
	public HrSalaryDetail(String uids, String report_id, String sj_type, String dept_id,
			String item_id) {
		super();
		this.uids = uids;
		this.report_id = report_id;
		this.sj_type = sj_type;
		this.dept_id = dept_id;
		this.item_id = item_id;
		
	}
	public HrSalaryDetail() {
		super();
	}
	
}














