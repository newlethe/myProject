package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;
import java.util.List;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.service.SystemMgmFacade;

/**
 * KqDaysDeptZb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class KqDaysDeptZb implements java.io.Serializable {

	// Fields

	private String lsh;
	private String sjType;
	private String unitId;
	private String deptId;
	private String title;
	private String userId;
	/*
	 *	填报人的姓名 
	 */
	private String userName;
	private Date createDate;
	private Date latestDate;
	private String status;
	private String billStatus;
	private String memo;

	private String spStatus;
	private String deptUserSp;
	/*
	 *	部门领导审批人的姓名 
	 */
	private String deptUserSpName;
	
	private String compUserSp;
	/*
	 *	 公司领导审批人的姓名
	 */
	private String compUserSpName;
	// Constructors

	public String getSpStatus() {
		return spStatus;
	}

	public void setSpStatus(String spStatus) {
		this.spStatus = spStatus;
	}

	public String getDeptUserSp() {
		return deptUserSp;
	}

	public void setDeptUserSp(String deptUserSp) {
		this.deptUserSp = deptUserSp;
		this.deptUserSpName = getUserRealnameByProperty("useraccount", deptUserSp);
	}

	public String getCompUserSp() {
		return compUserSp;
	}

	public void setCompUserSp(String compUserSp) {
		this.compUserSp = compUserSp;
		this.compUserSpName = getUserRealnameByProperty("useraccount", compUserSp); 
	}

	/** default constructor */
	public KqDaysDeptZb() {
	}

	/** minimal constructor */
	public KqDaysDeptZb(String lsh, String sjType, String unitId, String deptId) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.deptId = deptId;
	}

	/** full constructor */
	public KqDaysDeptZb(String lsh, String sjType, String unitId,
			String deptId, String title, String userId, String status,
			String billStatus, String memo,
			String spStatus, String deptUserSp, String compUserSp) {
		this.lsh = lsh;
		this.sjType = sjType;
		this.unitId = unitId;
		this.deptId = deptId;
		this.title = title;
		this.userId = userId;
		this.status = status;
		this.billStatus = billStatus;
		this.memo = memo;
		this.spStatus = spStatus;
		this.deptUserSp = deptUserSp;
		this.compUserSp = compUserSp;
	}

	// Property accessors

	public String getLsh() {
		return this.lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
	}

	public String getSjType() {
		return this.sjType;
	}

	public void setSjType(String sjType) {
		this.sjType = sjType;
	}

	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
		this.userName = getUserRealnameByProperty("userid", userId);
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getLatestDate() {
		return latestDate;
	}

	public void setLatestDate(Date latestDate) {
		this.latestDate = latestDate;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getBillStatus() {
		return this.billStatus;
	}

	public void setBillStatus(String billStatus) {
		this.billStatus = billStatus;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}
	
	private String getUserRealnameByProperty(String propertyName, String propertyValue){
		//设置code对应的name
		String realname = "";
		if (propertyName!=null && propertyName.length()>0 && propertyValue!=null && propertyValue.length()>0) {
			BaseDAO baseDAO = (BaseDAO) Constant.wact.getBean("baseDAO");
			List list = baseDAO.findByProperty(RockUser.class.getName(), propertyName, propertyValue);
			if (list!=null && list.size()>0) {
				realname = ((RockUser)list.get(0)).getRealname();
			}
		}
		
		return realname;
	}

	public String getUserName() {
		return userName;
	}

	public String getDeptUserSpName() {
		return deptUserSpName;
	}

	public String getCompUserSpName() {
		return compUserSpName;
	}
}