package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * ViewUser entity. @author MyEclipse Persistence Tools
 */
public class ViewUser implements java.io.Serializable {

	// Fields

	/**
	 * 主键
	 */
	private String uids;
	/**
	 * 账号
	 */
	private String code;
	/**
	 * 姓名
	 */
	private String realname;
	/**
	 * 密码
	 */
	private String password;
	/**
	 * 性别
	 */
	private String sex;
	/**
	 * 年龄
	 */
	private Short age;
	/**
	 * 生日
	 */
	private Date birthday;
	/**
	 * 手机号
	 */
	private String mobile;
	/**
	 * 电子邮箱
	 */
	private String email;
	/**
	 * 单位流水号
	 */
	private String unitUids;
	/**
	 * 部门流水号
	 */
	private String deptUids;
	/**
	 * 岗位
	 */
	private String posUids;
	/**
	 * 最后登录
	 */
	private Date lastlogon;
	/**
	 * 创建时间内
	 */
	private Date createdon;
	/**
	 * 排序号
	 */
	private String orderNum;
	/**
	 * 状态
	 */
	private String state;
	
	/**
	 * 最后一次修改密码时间
	 */
	private Date modifyPassdate;
	/**
	 * 是否锁定 1:锁定 0：未锁定
	 */
	private String lockType;
	/**
	 *账户锁定日期 
	 */
	private Date lockDate;
	
	// Constructors

	/** default constructor */
	public ViewUser() {
	}

	/** minimal constructor */
	public ViewUser(String uids, String code, String password,
			String sex, String state) {
		this.uids = uids;
		this.code = code;
		this.password = password;
		this.sex = sex;
		this.state = state;
	}

	/** full constructor */
	public ViewUser(String uids, String code, String realname, String password,
			String sex, Short age, Date birthday, String mobile, String email,
			String state, String unitUids, Date lastlogon, Date createdon,
			String phone, String fax, String homeaddress, String homepostcode,
			String homephone, String useraccount, String orderNum,
			String deptUids, String posUids, String showtab, String receivesms,
			Date modifyPassdate,String lockType,Date lockDate) {
		super();
		this.uids = uids;
		this.code = code;
		this.realname = realname;
		this.password = password;
		this.sex = sex;
		this.age = age;
		this.birthday = birthday;
		this.mobile = mobile;
		this.email = email;
		this.unitUids = unitUids;
		this.deptUids = deptUids;
		this.posUids = posUids;
		this.lastlogon = lastlogon;
		this.createdon = createdon;
		this.orderNum = orderNum;
		this.state = state;
		
		this.modifyPassdate=modifyPassdate;
		this.lockType=lockType;
		this.lockDate=lockDate;
	}

	// Property accessors
	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getRealname() {
		return this.realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public Short getAge() {
		return this.age;
	}

	public void setAge(Short age) {
		this.age = age;
	}

	public Date getBirthday() {
		return this.birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUnitUids() {
		return this.unitUids;
	}

	public void setUnitUids(String unitUids) {
		this.unitUids = unitUids;
	}

	public String getDeptUids() {
		return this.deptUids;
	}

	public void setDeptUids(String deptUids) {
		this.deptUids = deptUids;
	}

	public String getPosUids() {
		return this.posUids;
	}

	public void setPosUids(String posUids) {
		this.posUids = posUids;
	}

	public Date getLastlogon() {
		return this.lastlogon;
	}

	public void setLastlogon(Date lastlogon) {
		this.lastlogon = lastlogon;
	}

	public Date getCreatedon() {
		return this.createdon;
	}

	public void setCreatedon(Date createdon) {
		this.createdon = createdon;
	}

	public String getOrderNum() {
		return this.orderNum;
	}

	public void setOrderNum(String orderNum) {
		this.orderNum = orderNum;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public Date getModifyPassdate() {
		return modifyPassdate;
	}

	public void setModifyPassdate(Date modifyPassdate) {
		this.modifyPassdate = modifyPassdate;
	}
	
	public String getLockType() {
		return lockType;
	}

	public void setLockType(String lockType) {
		this.lockType = lockType;
	}
	
	public Date getLockDate() {
		return lockDate;
	}

	public void setLockDate(Date lockDate) {
		this.lockDate = lockDate;
	}
	
	
	

}